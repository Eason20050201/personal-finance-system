from sqlalchemy.orm import Session
from models.recurring_transaction import RecurringTransaction
from schemas.recurring_transaction import RecurringTransactionCreate, RecurringTransactionUpdate

# ➕ 建立週期性交易
def create_recurring(db: Session, data: RecurringTransactionCreate):
    db_obj = RecurringTransaction(**data.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# 📥 查詢使用者的所有週期性交易
def get_recurring_by_user(db: Session, user_id: int):
    return db.query(RecurringTransaction).filter(RecurringTransaction.user_id == user_id).all()

# 🔁 更新指定的 recurring
def update_recurring(db: Session, recurring_id: int, data: RecurringTransactionUpdate):
    db_obj = db.query(RecurringTransaction).filter(RecurringTransaction.recurring_id == recurring_id).first()
    if not db_obj:
        return None
    for field, value in data.dict(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# ❌ 刪除 recurring
def delete_recurring(db: Session, recurring_id: int):
    db_obj = db.query(RecurringTransaction).filter(RecurringTransaction.recurring_id == recurring_id).first()
    if not db_obj:
        return None
    db.delete(db_obj)
    db.commit()
    return db_obj