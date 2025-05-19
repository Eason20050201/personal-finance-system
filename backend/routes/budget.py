from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud.budget as budget_crud
import schemas.budget as budget_schema

router = APIRouter(
    prefix="/budgets",
    tags=["budgets"],
)

# ➕ 建立預算
@router.post("/", response_model=budget_schema.BudgetOut)
def create_budget(
    budget_in: budget_schema.BudgetCreate,
    db: Session = Depends(get_db),
):
    return budget_crud.create_budget(db, budget_in)

# 📥 查詢某使用者所有預算
@router.get("/{user_id}", response_model=list[budget_schema.BudgetOut])
def get_budgets_by_user(user_id: int, db: Session = Depends(get_db)):
    budgets = budget_crud.get_budgets_by_user(db, user_id)
    if not budgets:
        raise HTTPException(status_code=404, detail="No budgets found for this user")
    return budgets