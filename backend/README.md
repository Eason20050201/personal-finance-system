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

### 4️⃣ 設定環境變數 `.env`

請參考 `.env.example`，複製一份 `.env`，並填入你的資料庫資訊：

```env
DB_URL=mysql+pymysql://root:你的密碼@localhost/finance_db
```

**注意：** `.env` 請勿上傳到 GitHub，已在 `.gitignore` 中排除。

### 5️⃣ 啟動 FastAPI Server

```bash
uvicorn main:app --reload
```

後端 API 會啟動在：[http://localhost:8000](http://localhost:8000)

Swagger API 文件查看：[http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧹 注意事項

- 請確保本地有正確安裝 MySQL，並建立好 `finance_db` 資料庫。
- 請匯入 `sql/DDL.sql` 與 `sql/Relations.sql` 初始化資料表與測資。
- `venv/`、`.env` 已被排除在 Git 版本控制之外。

---

## 📋 資料庫初始化指令範例

```bash
mysql -u root -p
CREATE DATABASE finance_db;
exit

mysql -u root -p finance_db < ../sql/DDL.sql
mysql -u root -p finance_db < ../sql/Relations.sql
```

---

## 📦 檔案結構簡述

```plaintext
backend/
├── main.py              # FastAPI 程式進入點
├── config.py            # 讀取 .env 並產生設定
├── database.py          # 資料庫連線與 Session 管理
│
├── models/              # SQLAlchemy 資料表定義
│   ├── __init__.py
│   └── user.py
│
├── schemas/             # Pydantic schema：請求/回應格式
│   ├── __init__.py
│   └── user.py
│
├── crud/                # 資料庫操作邏輯封裝
│   ├── __init__.py
│   └── user.py
│
├── routes/                 # API 路由定義
│   ├── __init__.py
│   └── auth.py
│
├── requirements.txt     # 所有 Python 套件清單
├── .env.example         # .env 範例檔案

```

---

## 🚀 其他說明

未來會陸續增加：

- 資料模型 models/
- API 路由 routes/
- Schema 驗證 schemas/

請持續關注專案更新內容 ✨
