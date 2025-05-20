# scripts/run_daily_tasks.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from database import SessionLocal
from services.recurring_processor import process_due_recurring_transactions

def main():
    print("[INFO] Running daily recurring transaction task...")
    db: Session = SessionLocal()
    try:
        count = process_due_recurring_transactions(db)
        print(f"[INFO] Done. {count} transaction(s) generated.")
    except Exception as e:
        print(f"[ERROR] Failed to process recurring transactions: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()