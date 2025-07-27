from fastapi import FastAPI, Depends, HTTPException, status, Body, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional,List  # if you want to use Optional instead of | None

from . import models, schemas, crud, auth
from .database import engine, SessionLocal
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# --- APP CREATION AND CORS ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Use ["*"] for dev/testing if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

# --- DEPENDENCIES ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ADMIN-ONLY DEPENDENCY ---
def admin_required(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Request models
class RestockRequest(BaseModel):
    quantity: int

class PurchaseRequest(BaseModel):
    quantity: int

# --- SEARCH SWEETS ---

@app.get("/sweets/search", response_model=List[schemas.Sweet])
def search_sweets(
    name: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    # CRUD call filtering only if params provided
    return crud.search_sweets(db, name=name, category=category, min_price=min_price, max_price=max_price)

# --- RESTOCK SWEET ---
@app.post("/sweets/{sweet_id}/restock", response_model=schemas.Sweet)
def restock_sweet(
    sweet_id: int,
    restock: RestockRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    if restock.quantity <= 0:
        raise HTTPException(status_code=400, detail="Restock quantity must be positive")
    sweet = crud.get_sweet(db, sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    
    new_quantity = sweet.quantity + restock.quantity
    updated_sweet = crud.update_sweet_quantity(db, sweet_id, new_quantity)
    return updated_sweet


# --- USER REGISTRATION ---
@app.post("/users/", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    # Default role 'user'; admins must be created via Swagger or seed
    return crud.create_user(db, user)


# --- TOKEN AUTHENTICATION ---
@app.post("/token", response_model=dict)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


# --- SWEETS CRUD ---
@app.post("/sweets/", response_model=schemas.Sweet)
def create_sweet(
    sweet: schemas.SweetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)  # any logged-in user add sweet? Or change to admin_required if needed
):
    return crud.create_sweet(db, sweet)


@app.get("/sweets/", response_model=list[schemas.Sweet])
def read_sweets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_sweets(db, skip=skip, limit=limit)


@app.get("/sweets/{sweet_id}", response_model=schemas.Sweet)
def read_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_sweet = crud.get_sweet(db, sweet_id)
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return db_sweet


@app.put("/sweets/{sweet_id}", response_model=schemas.Sweet)
def update_sweet(
    sweet_id: int,
    sweet: schemas.SweetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required)  # Admin only
):
    db_sweet = crud.update_sweet(db, sweet_id, sweet)
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return db_sweet


@app.delete("/sweets/{sweet_id}", response_model=schemas.Sweet)
def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required)  # Admin only
):
    db_sweet = crud.delete_sweet(db, sweet_id)
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return db_sweet


# --- PURCHASE SWEET ---
@app.post("/purchase/{sweet_id}", response_model=schemas.Sweet)
def purchase_sweet(
    sweet_id: int,
    purchase: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    requested_qty = purchase.quantity
    if requested_qty <= 0:
        raise HTTPException(status_code=400, detail="Invalid purchase quantity")

    db_sweet = crud.get_sweet(db, sweet_id)
    if not db_sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    if db_sweet.quantity < requested_qty:
        raise HTTPException(status_code=400, detail="Insufficient stock to fulfill purchase")

    new_qty = db_sweet.quantity - requested_qty
    updated_sweet = crud.update_sweet_quantity(db, sweet_id, new_qty)
    return updated_sweet



@app.get("/users/", response_model=List[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    return crud.get_all_users(db)