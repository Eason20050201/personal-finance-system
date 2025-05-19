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