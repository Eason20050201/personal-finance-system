from sqlalchemy.orm import Session
from models.account import Account
from schemas.account import AccountCreate

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