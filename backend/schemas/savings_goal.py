from pydantic import BaseModel, condecimal
from datetime import date, datetime

# ➕ 儲蓄目標建立格式
class SavingsGoalCreate(BaseModel):
    user_id: int
    name: str
    target_amount: condecimal(max_digits=15, decimal_places=2)
    current_amount: condecimal(max_digits=15, decimal_places=2) = 0
    target_date: date | None = None
    note: str | None = None

# 📤 儲蓄目標回傳格式
class SavingsGoalOut(SavingsGoalCreate):
    goal_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class SavingsGoalUpdate(BaseModel):
    name: str | None = None
    target_amount: condecimal(max_digits=15, decimal_places=2) | None = None
    current_amount: condecimal(max_digits=15, decimal_places=2) | None = None
    target_date: date | None = None
    note: str | None = None

