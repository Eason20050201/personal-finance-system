import os
from dotenv import load_dotenv

load_dotenv()  # 載入 .env 檔案

db_url = os.getenv("DB_URL")  # 取得資料庫連線字串
print(f"Database URL: {db_url}")
