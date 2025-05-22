from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud.account as account_crud
import schemas.account as account_schema

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
)

# ➕ 建立帳戶
@router.post("/", response_model=account_schema.AccountOut)
def create_account(
    account_in: account_schema.AccountCreate,
    db: Session = Depends(get_db),
):
    return account_crud.create_account(db, account_in)

# 📥 查詢某使用者的所有帳戶
@router.get("/{user_id}", response_model=list[account_schema.AccountOut])
def get_accounts_by_user(user_id: int, db: Session = Depends(get_db)):
    accounts = account_crud.get_accounts_by_user(db, user_id)
    if not accounts:
        raise HTTPException(status_code=404, detail="No accounts found for this user")
    return accounts

@router.put("/{account_id}", response_model=account_schema.AccountOut)
def update_account(
    account_id: int,
    account_in: account_schema.AccountUpdate,
    db: Session = Depends(get_db),
):
    updated = account_crud.update_account(db, account_id, account_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Account not found")
    return updated

@router.delete("/{account_id}")
def delete_account(account_id: int, db: Session = Depends(get_db)):
    deleted = account_crud.delete_account(db, account_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"detail": "Account deleted"}