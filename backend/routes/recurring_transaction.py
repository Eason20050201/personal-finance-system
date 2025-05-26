from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud.recurring_transaction as recurring_crud
import schemas.recurring_transaction as recurring_schema

router = APIRouter(prefix="/recurring", tags=["recurring_transactions"])

# ➕ 建立週期性交易
@router.post("/", response_model=recurring_schema.RecurringTransactionOut)
def create_recurring(
    data: recurring_schema.RecurringTransactionCreate,
    db: Session = Depends(get_db)
):
    return recurring_crud.create_recurring(db, data)

# 📥 查詢使用者所有 recurring 記錄
@router.get("/user/{user_id}", response_model=list[recurring_schema.RecurringTransactionOut])
def get_user_recurring(user_id: int, db: Session = Depends(get_db)):
    return recurring_crud.get_recurring_by_user(db, user_id)

# 🔁 更新 recurring 記錄
@router.put("/{recurring_id}", response_model=recurring_schema.RecurringTransactionOut)
def update_recurring(
    recurring_id: int,
    data: recurring_schema.RecurringTransactionUpdate,
    db: Session = Depends(get_db)
):
    updated = recurring_crud.update_recurring(db, recurring_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    return updated

# ❌ 刪除 recurring 記錄
@router.delete("/{recurring_id}")
def delete_recurring(recurring_id: int, db: Session = Depends(get_db)):
    deleted = recurring_crud.delete_recurring(db, recurring_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    return {"detail": "Recurring transaction deleted"}