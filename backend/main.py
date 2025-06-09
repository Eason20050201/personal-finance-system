from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# ✅ 先建立 app
app = FastAPI()

# ✅ 再馬上掛 middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # 本機開發用
        "https://Eason20050201.github.io",  # GitHub Pages 網域
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 然後匯入 routes（務必放在 CORS 後面）
from routes import auth, user, transaction, category, account, budget, savings_goal, report, recurring_transaction, notification

# ✅ 接著掛載路由
app.include_router(auth.router, prefix="/auth")
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(transaction.router)
app.include_router(category.router)
app.include_router(account.router)
app.include_router(budget.router)
app.include_router(savings_goal.router)
app.include_router(report.router)
app.include_router(recurring_transaction.router)
app.include_router(notification.router)

# ✅ 根目錄測試
@app.get("/")
def read_root():
    return {"msg": "Hello, Personal Finance"}

# ✅ 顯示資料庫連線確認
print("✅ Database URL:", settings.database_url)

# ✅ 最後加排程
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
