# utils/recurring.py

from datetime import date, timedelta
from sqlalchemy.orm import Session
from models.transaction import Transaction
from models.recurring_transaction import RecurringTransaction
from utils.date_utils import now_tw

def process_recurring_transactions(db: Session, user_id: int = None):
    today = now_tw().date()
    query = db.query(RecurringTransaction).filter(RecurringTransaction.next_occurrence <= today)

    if user_id:
        query = query.filter(RecurringTransaction.user_id == user_id)

    recs = query.all()

    for rec in recs:
        while rec.next_occurrence <= today:
            if rec.end_date and rec.next_occurrence > rec.end_date:
                break

            # 建立新交易
            txn = Transaction(
                user_id=rec.user_id,
                account_id=rec.account_id,
                category_id=rec.category_id,
                amount=rec.amount,
                type=rec.type,
                note=rec.note,
                transaction_date=rec.next_occurrence
            )
            db.add(txn)

            # 更新 next_occurrence
            next_date = rec.next_occurrence
            if rec.frequency == "daily":
                next_date += timedelta(days=1)
            elif rec.frequency == "weekly":
                next_date += timedelta(weeks=1)
            elif rec.frequency == "monthly":
                year = next_date.year + (next_date.month // 12)
                month = next_date.month % 12 + 1
                day = min(next_date.day, 28)
                next_date = next_date.replace(year=year, month=month, day=day)

            rec.next_occurrence = next_date


    db.commit()
