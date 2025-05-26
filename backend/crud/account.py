from sqlalchemy.orm import Session
from models.account import Account
from schemas.account import AccountCreate
from schemas.account import AccountUpdate

# ➕ 建立一筆帳戶資料
def create_account(db: Session, account_in: AccountCreate):
    db_account = Account(**account_in.dict())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

# 📥 查詢某使用者的所有帳戶
def get_accounts_by_user(db: Session, user_id: int):
    return db.query(Account).filter(Account.user_id == user_id).all()

def update_account(db: Session, account_id: int, account_in: AccountUpdate):
    account = db.query(Account).filter(Account.account_id == account_id).first()
    if not account:
        return None
    for field, value in account_in.dict(exclude_unset=True).items():
        setattr(account, field, value)
    db.commit()
    db.refresh(account)
    return account

def delete_account(db: Session, account_id: int):
    account = db.query(Account).filter(Account.account_id == account_id).first()
    if not account:
        return None
    db.delete(account)
    db.commit()
    return account