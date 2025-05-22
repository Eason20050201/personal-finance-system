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

@router.put("/{transaction_id}", response_model=transaction_schema.TransactionOut)
def update_transaction(
    transaction_id: int,
    transaction_in: transaction_schema.TransactionUpdate,
    db: Session = Depends(get_db),
):
    updated = transaction_crud.update_transaction(db, transaction_id, transaction_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated


@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    deleted = transaction_crud.delete_transaction(db, transaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"detail": "Transaction deleted"}