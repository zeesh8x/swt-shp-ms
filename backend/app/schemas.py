from pydantic import BaseModel
from typing import Optional

class UserUpdate(BaseModel):
    username:Optional[str]
    password:Optional[str]
    role:Optional[str]

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"

class UserOut(BaseModel):
    id: int
    username: str
    role:str
    class Config:
        orm_mode = True

class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class SweetCreate(SweetBase):
    pass

class Sweet(SweetBase):
    id: int
    class Config:
        orm_mode = True
