from fastapi import FastAPI
from config import settings  # ✅ 匯入設定物件
from routes import auth

app = FastAPI()

# 印出資料庫連線字串，確認 config 有作用
print("✅ Database URL:", settings.database_url)

@app.get("/")
def read_root():
    return {"msg": "Hello, Personal Finance"}

# 掛載 /auth 路由
app.include_router(auth.router, prefix="/auth")