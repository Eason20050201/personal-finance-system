from sqlalchemy.orm import Session
from models.budget import Budget
from schemas.budget import BudgetCreate
from schemas.budget import BudgetUpdate

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

def update_budget(db: Session, budget_id: int, budget_in: BudgetUpdate):
    budget = db.query(Budget).filter(Budget.budget_id == budget_id).first()
    if not budget:
        return None
    for field, value in budget_in.dict(exclude_unset=True).items():
        setattr(budget, field, value)
    db.commit()
    db.refresh(budget)
    return budget

def delete_budget(db: Session, budget_id: int):
    budget = db.query(Budget).filter(Budget.budget_id == budget_id).first()
    if not budget:
        return None
    db.delete(budget)
    db.commit()
    return budget