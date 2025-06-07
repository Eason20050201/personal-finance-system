from pydantic import BaseModel, condecimal
from datetime import date, datetime
from enum import Enum

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

# ➕ 建立交易時的輸入資料格式
class TransactionCreate(BaseModel):
    
    amount: condecimal(max_digits=15, decimal_places=2)
    type: TransactionType
    transaction_date: date  
    note: str | None = None
    tags: dict | None = None
    account_id: int | None = None
    category_id: int | None = None
    recurring_id: int | None = None

# 📤 查詢/回傳用的交易資料格式（含交易 ID 與建立時間）
class TransactionOut(TransactionCreate):
    transaction_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ➕ 更新交易時的輸入資料格式
class TransactionUpdate(BaseModel):
    amount: condecimal(max_digits=10, decimal_places=2) | None = None
    type: TransactionType | None = None
    transaction_date: date | None = None
    note: str | None = None
    tags: dict | None = None
    account_id: int | None = None
    category_id: int | None = None
    recurring_id: int | None = None