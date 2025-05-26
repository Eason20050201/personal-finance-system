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

# 🔍 查詢帶條件交易
def get_transactions_by_filters(db, user_id, start_date, end_date, category_id, min_amount, max_amount):
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start_date:
        query = query.filter(Transaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(Transaction.transaction_date <= end_date)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if min_amount is not None:
        query = query.filter(Transaction.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Transaction.amount <= max_amount)

    return query.all()

# ✏️ 更新
def update_transaction(db: Session, transaction_id: int, transaction_in: TransactionUpdate):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not transaction:
        return None
    for field, value in transaction_in.dict(exclude_unset=True).items():
        setattr(transaction, field, value)
    db.commit()
    db.refresh(transaction)
    return transaction

# ❌ 刪除
def delete_transaction(db: Session, transaction_id: int):
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not transaction:
        return None
    db.delete(transaction)
    db.commit()
    return transaction