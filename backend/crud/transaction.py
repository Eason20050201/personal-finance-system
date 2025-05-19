from sqlalchemy.orm import Session
from models.transaction import Transaction
from schemas.transaction import TransactionCreate

# ➕ 新增一筆交易
def create_transaction(db: Session, transaction_in: TransactionCreate):
    db_transaction = Transaction(**transaction_in.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# 📥 根據使用者查詢他的所有交易
def get_transactions_by_user(db: Session, user_id: int):
    return db.query(Transaction).filter(Transaction.user_id == user_id).all()