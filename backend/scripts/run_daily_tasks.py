# scripts/run_daily_tasks.py

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from database import SessionLocal
from services.recurring_processor import process_due_recurring_transactions
from sqlalchemy import func
from collections import defaultdict
from datetime import date
from models import Budget, Transaction, Notification, Category

def check_budget_exceed(db: Session):
    from datetime import datetime, timedelta  # ✅ 用來處理分鐘比較
    today = date.today()
    start_of_month = today.replace(day=1)

    # Step 1: 計算當月分類支出
    transactions = (
        db.query(
            Transaction.user_id,
            Transaction.category_id,
            func.sum(Transaction.amount).label("total_spent")
        )
        .filter(
            Transaction.transaction_date >= start_of_month,
            Transaction.transaction_date <= today,
            Transaction.type == "expense"
        )
        .group_by(Transaction.user_id, Transaction.category_id)
        .all()
    )

    spending_dict = defaultdict(lambda: defaultdict(float))
    for row in transactions:
        spending_dict[row.user_id][row.category_id] = float(row.total_spent)

    # Step 2: 讀取當期預算，判斷是否超出 & 檢查提醒間隔
    budgets = db.query(Budget).filter(
        Budget.start_date <= today,
        Budget.end_date >= today
    ).all()

    now = datetime.now()  # ✅ 現在時間（含時分秒）

    for b in budgets:
        spent = spending_dict[b.user_id][b.category_id]
        if spent > float(b.amount):
            # --- ✅【原始邏輯】根據「天數」來判斷是否該提醒 ---
            # """
            should_notify = (
                b.last_notified_at is None or
                (today - b.last_notified_at).days >= b.notify_interval_days
            )
            # """

            # --- ✅【測試用邏輯】改用「分鐘」來判斷是否該提醒 ---
            """
            if b.last_notified_at is None:
                should_notify = True
            else:
                last_dt = datetime.combine(b.last_notified_at, datetime.min.time())  # → 轉成 datetime
                delta = now - last_dt
                should_notify = delta.total_seconds() >= b.notify_interval_days * 60  # 將 notify_interval_days 當「分鐘」用
            """
            # --------------------------------------------

            if should_notify:
                category = db.query(Category).filter(Category.category_id == b.category_id).first()
                message = f"你的分類「{category.name}」已超過預算上限 (${b.amount})，目前已花費 ${spent}。"

                db.add(Notification(
                    user_id=b.user_id,
                    type="budget_exceed",
                    message=message
                ))

                # ✅ 更新提醒時間
                b.last_notified_at = today

    db.commit()
    print("[INFO] ✅ 預算超額提醒檢查完成。")

def main():
    print("[INFO] Running daily tasks...")
    db: Session = SessionLocal()
    try:
        count = process_due_recurring_transactions(db)
        print(f"[INFO] Recurring OK. {count} transaction(s) generated.")

        check_budget_exceed(db)  # 👈 新增這行
    except Exception as e:
        print(f"[ERROR] Task failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()