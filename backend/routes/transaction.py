from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud.transaction as transaction_crud
import schemas.transaction as transaction_schema

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
)

# ➕ 新增交易
@router.post("/", response_model=transaction_schema.TransactionOut)
def create_transaction(
    transaction_in: transaction_schema.TransactionCreate,
    db: Session = Depends(get_db),
):
    return transaction_crud.create_transaction(db, transaction_in)

# 📥 查詢指定使用者的所有交易
@router.get("/{user_id}", response_model=list[transaction_schema.TransactionOut])
def get_transactions_by_user(user_id: int, db: Session = Depends(get_db)):
    transactions = transaction_crud.get_transactions_by_user(db, user_id)
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this user")
    return transactions