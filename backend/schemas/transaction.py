from pydantic import BaseModel, condecimal
from datetime import date, datetime
from enum import Enum
from typing import Optional
from schemas.category import CategoryOut  # ⬅️ 確保這行有匯入正確

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

class TransactionCreate(BaseModel):
    amount: condecimal(max_digits=15, decimal_places=2)
    type: TransactionType
    transaction_date: date  
    note: Optional[str] = None
    tags: Optional[dict] = None
    account_id: Optional[int] = None
    category_id: Optional[int] = None
    recurring_id: Optional[int] = None

class TransactionOut(TransactionCreate):
    transaction_id: int
    created_at: datetime
    category: Optional[CategoryOut] = None  # ✅ 加這行

    class Config:
        orm_mode = True

class TransactionUpdate(BaseModel):
    amount: Optional[condecimal(max_digits=10, decimal_places=2)] = None
    type: Optional[TransactionType] = None
    transaction_date: Optional[date] = None
    note: Optional[str] = None
    tags: Optional[dict] = None
    account_id: Optional[int] = None
    category_id: Optional[int] = None
    recurring_id: Optional[int] = None

# schemas/category.py

from pydantic import BaseModel

class CategoryOut(BaseModel):
    category_id: int
    name: str
    type: str  # "income" or "expense"

    class Config:
        orm_mode = True
