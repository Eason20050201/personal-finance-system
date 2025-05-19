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