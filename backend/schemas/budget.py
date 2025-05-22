from pydantic import BaseModel, condecimal
from datetime import date, datetime
from typing import Optional

# ➕ 建立預算輸入格式
class BudgetCreate(BaseModel):
    user_id: int
    category_id: Optional[int] = None
    amount: condecimal(max_digits=15, decimal_places=2)
    period: str  # 例如 'monthly'
    start_date: date
    end_date: date
    notify_interval_days: Optional[int] = 1  # 預設每天提醒

# 📤 回傳預算資料格式
class BudgetOut(BudgetCreate):
    budget_id: int
    created_at: datetime
    last_notified_at: Optional[date] = None

    class Config:
        from_attributes = True  # 若使用 Pydantic v2，取代 orm_mode

# 🔁 更新預算格式
class BudgetUpdate(BaseModel):
    category_id: Optional[int] = None
    amount: Optional[condecimal(max_digits=15, decimal_places=2)] = None
    period: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notify_interval_days: Optional[int] = None