from sqlalchemy.orm import Session
from models.transaction import Transaction
from schemas.transaction import TransactionCreate
from schemas.transaction import TransactionUpdate

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

def update_transaction(db: Session, transaction_id: int, transaction_in: TransactionUpdate):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not transaction:
        return None
    for field, value in transaction_in.dict(exclude_unset=True).items():
        setattr(transaction, field, value)
    db.commit()
    db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, transaction_id: int):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not transaction:
        return None
    db.delete(transaction)
    db.commit()
    return transaction