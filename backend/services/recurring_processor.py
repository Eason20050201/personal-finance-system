# app/services/recurring_processor.py
from datetime import date, timedelta
from sqlalchemy.orm import Session
from models.recurring_transaction import RecurringTransaction
from models.transaction import Transaction
from utils.date_utils import get_next_occurrence

# ✅ 自動轉換符合條件的 recurring_transaction 成為實際交易

def process_due_recurring_transactions(db: Session):
    today = date.today()

    due_recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.next_occurrence == today,
        (RecurringTransaction.end_date == None) | (RecurringTransaction.end_date >= today)
    ).all()

    for rec in due_recurring:
        # 建立對應的交易紀錄
        txn = Transaction(
            user_id=rec.user_id,
            account_id=rec.account_id,
            category_id=rec.category_id,
            amount=rec.amount,
            type=rec.type,
            note=rec.note or f"Auto generated from recurring #{rec.recurring_id}",
            transaction_date=today,
            recurring_id=rec.recurring_id
        )
        db.add(txn)

        # 更新 next_occurrence
        rec.next_occurrence = get_next_occurrence(today, rec.frequency)

    db.commit()
    return len(due_recurring)
