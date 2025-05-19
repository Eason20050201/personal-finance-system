from pydantic import BaseModel, condecimal
from datetime import date, datetime

# ➕ 建立預算輸入格式
class BudgetCreate(BaseModel):
    user_id: int
    category_id: int
    amount: condecimal(max_digits=15, decimal_places=2)
    period: str  # 例如 'monthly'
    start_date: date
    end_date: date

# 📤 回傳預算資料格式
class BudgetOut(BudgetCreate):
    budget_id: int
    created_at: datetime

    class Config:
        orm_mode = True