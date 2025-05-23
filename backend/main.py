from fastapi import FastAPI
from config import settings  # 匯入設定物件
from routes import auth      # 匯入 auth 路由模組
from routes import user      # 匯入 user 路由模組

app = FastAPI()

# 印出資料庫連線字串，確認 config 有作用
print("✅ Database URL:", settings.database_url)

@app.get("/")
def read_root():
    return {"msg": "Hello, Personal Finance"}

# 掛載 /auth 路由
app.include_router(auth.router, prefix="/auth")

# 掛載 /users 路由，標註為 Users 分類
app.include_router(user.router, prefix="/users", tags=["Users"])

# 掛載 /transactions 路由，標註為 Transactions 分類
from routes import transaction

app.include_router(transaction.router)

# 掛載 /categories 路由，標註為 Categories 分類
from routes import category

app.include_router(category.router)

# 掛載 /accounts 路由，標註為 Accounts 分類
from routes import account

app.include_router(account.router)

# 掛載 /budgets 路由，標註為 Budgets 分類
from routes import budget

app.include_router(budget.router)

# 掛載 /savings 路由，標註為 Savings 分類
from routes import savings_goal

app.include_router(savings_goal.router)

# 掛載 /reports 路由，標註為 Reports 分類
from routes import report

app.include_router(report.router)

# 掛載 /recurring 路由，標註為 Recurring Transactions 分類
from routes import recurring_transaction
app.include_router(recurring_transaction.router)

# 掛載 /notifications 路由，標註為 Notifications 分類
from routes import notification
app.include_router(notification.router)

# uvicorn 一啟動，每天凌晨 3 點就會自動執行 recurring 處理。
from apscheduler.schedulers.background import BackgroundScheduler
from services.recurring_processor import process_due_recurring_transactions
from scripts.run_daily_tasks import check_budget_exceed
from database import SessionLocal

def run_daily_jobs():
    db = SessionLocal()
    try:
        print("[INFO] ⏰ Daily job started")
        process_due_recurring_transactions(db)
        check_budget_exceed(db)
        print("[INFO] ✅ Daily job finished")
    except Exception as e:
        print(f"[ERROR] Daily job failed: {e}")
    finally:
        db.close()

scheduler = BackgroundScheduler()
# scheduler.add_job(run_daily_jobs, "cron", hour=3, minute=0)
scheduler.add_job(run_daily_jobs, "cron", minute='*/1')  # 每分鐘測試一次
scheduler.start()