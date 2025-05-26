# 📚 Backend/README.md - 個人理財管理系統後端環境說明

---

## 🛠️ 環境需求

- Python 3.11.8（建議使用 pyenv 管理）
- MySQL Server
- pip（Python 套件管理工具）

---

## 🗂️ 安裝與啟動流程

### 1️⃣ 安裝 pyenv 並設定 Python 版本

如果尚未安裝 pyenv：

```bash
brew install pyenv
```

指定本專案 Python 版本：

```bash
cd backend
pyenv install 3.11.8
pyenv local 3.11.8
```

### 2️⃣ 建立虛擬環境並啟用

```bash
python -m venv venv
source venv/bin/activate  # Windows 請使用 venv\Scripts\activate
```

### 3️⃣ 安裝後端依賴套件

```bash
pip install -r requirements.txt
```

## 📋 資料庫初始化與創建

```bash
mysql -u root -p
CREATE DATABASE finance;
exit

mysql -u root -p finance < ../sql/DDL.sql
mysql -u root -p finance < ../sql/Relations.sql
```

---

### 4️⃣ 設定環境變數 `.env`

請參考 `.env.example`，複製一份 `.env`，並填入你的資料庫資訊：

```env
# .env.example
DB_USER=root
DB_PASSWORD=[你的密碼]
DB_HOST=localhost
DB_PORT=3306
DB_NAME=[你的資料庫名稱]
```

**注意：** `.env` 請勿上傳到 GitHub，已在 `.gitignore` 中排除。

### 5️⃣ 啟動 FastAPI Server

```bash
uvicorn main:app --reload
```

後端 API 會啟動在：[http://localhost:8000](http://localhost:8000)

Swagger API 文件查看：[http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📦 檔案結構簡述

```plaintext
📁 backend/
├── 📁 crud/
│   ├── __init__.py
│   ├── account.py
│   ├── budget.py
│   ├── category.py
│   ├── recurring_transaction.py
│   ├── report.py
│   ├── savings_goal.py
│   ├── transaction.py
│   └── user.py
│
├── 📁 models/
│   ├── __init__.py
│   ├── account.py
│   ├── budget.py
│   ├── category.py
│   ├── recurring_transaction.py
│   ├── savings_goal.py
│   ├── transaction.py
│   └── user.py
│
├── 📁 routes/
│   ├── __init__.py
│   ├── account.py
│   ├── auth.py
│   ├── budget.py
│   ├── category.py
│   ├── recurring_transaction.py
│   ├── report.py
│   ├── savings_goal.py
│   ├── transaction.py
│   └── user.py
│
├── 📁 schemas/
│   ├── __init__.py
│   ├── account.py
│   ├── budget.py
│   ├── category.py
│   ├── recurring_transaction.py
│   ├── report.py
│   ├── savings_goal.py
│   ├── transaction.py
│   └── user.py
│
├── 📁 scripts/
│   ├── __init__.py
│   └── run_daily_tasks.py
│
├── 📁 services/
│   ├── __init__.py
│   └── recurring_processor.py
│
├── 📁 utils/
│   ├── __init__.py
│   └── date_utils.py
│
├── .env # (本地使用，勿上傳)
├── .env.example
├── .gitignore
├── .python-version
├── config.py
├── database.py
├── main.py
├── README.md
└── requirements.txt
```

---

## 🚀 其他說明

請持續關注專案更新內容 ✨
