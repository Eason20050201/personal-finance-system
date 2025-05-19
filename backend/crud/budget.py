from sqlalchemy.orm import Session
from models.budget import Budget
from schemas.budget import BudgetCreate

# ➕ 建立一筆預算資料
def create_budget(db: Session, budget_in: BudgetCreate):
    db_budget = Budget(**budget_in.dict())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

# 📥 查詢某使用者的所有預算
def get_budgets_by_user(db: Session, user_id: int):
    return db.query(Budget).filter(Budget.user_id == user_id).all()