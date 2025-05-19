from pydantic import BaseModel, condecimal
from datetime import date
from typing import Optional

class RecurringTransactionBase(BaseModel):
    user_id: int
    account_id: int
    category_id: int
    amount: condecimal(max_digits=15, decimal_places=2)
    type: str  # 'income' or 'expense'
    note: Optional[str] = None
    frequency: str  # 'daily', 'weekly', 'monthly'
    start_date: date
    end_date: Optional[date] = None
    next_occurrence: date

class RecurringTransactionCreate(RecurringTransactionBase):
    pass

class RecurringTransactionUpdate(BaseModel):
    account_id: Optional[int] = None
    category_id: Optional[int] = None
    amount: Optional[condecimal(max_digits=15, decimal_places=2)] = None
    type: Optional[str] = None
    note: Optional[str] = None
    frequency: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    next_occurrence: Optional[date] = None

class RecurringTransactionOut(RecurringTransactionBase):
    recurring_id: int

    class Config:
        orm_mode = True
