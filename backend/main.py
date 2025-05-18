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
