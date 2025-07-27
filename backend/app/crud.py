from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from typing import Optional, List

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------------- USER CRUD ----------------------

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_all_users(db: Session) -> List[models.User]:
    return db.query(models.User).all()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_pw = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_pw, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate) -> Optional[models.User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    if user_update.username:
        user.username = user_update.username
    if user_update.password:
        user.hashed_password = pwd_context.hash(user_update.password)
    if user_update.role:
        user.role = user_update.role
    db.commit()
    db.refresh(user)
    return user


# ---------------------- SWEETS CRUD ----------------------

def create_sweet(db: Session, sweet: schemas.SweetCreate) -> models.Sweet:
    db_sweet = models.Sweet(**sweet.dict())
    db.add(db_sweet)
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

def get_sweets(db: Session, skip: int = 0, limit: int = 100) -> List[models.Sweet]:
    return db.query(models.Sweet).offset(skip).limit(limit).all()

def get_sweet(db: Session, sweet_id: int) -> Optional[models.Sweet]:
    return db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()

def update_sweet(db: Session, sweet_id: int, sweet: schemas.SweetCreate) -> Optional[models.Sweet]:
    db_sweet = get_sweet(db, sweet_id)
    if db_sweet:
        for field, value in sweet.dict().items():
            setattr(db_sweet, field, value)
        db.commit()
        db.refresh(db_sweet)
    return db_sweet

def delete_sweet(db: Session, sweet_id: int) -> Optional[models.Sweet]:
    db_sweet = get_sweet(db, sweet_id)
    if db_sweet:
        db.delete(db_sweet)
        db.commit()
    return db_sweet

def update_sweet_quantity(db: Session, sweet_id: int, new_qty: int) -> Optional[models.Sweet]:
    sweet = get_sweet(db, sweet_id)
    if sweet:
        sweet.quantity = new_qty
        db.commit()
        db.refresh(sweet)
    return sweet

def search_sweets(
    db: Session,
    name: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
) -> List[models.Sweet]:
    query = db.query(models.Sweet)
    if name:
        query = query.filter(models.Sweet.name.ilike(f"%{name}%"))
    if category:
        query = query.filter(models.Sweet.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(models.Sweet.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Sweet.price <= max_price)
    return query.all()
