# backend/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin
from models.account import Account  # ← 確保你有這個 import
from sqlalchemy.exc import SQLAlchemyError

from models.category import Category  # 確保有 import

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 檢查 email 是否已被註冊
    if db.query(User).filter_by(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email 已被註冊")

    hashed_pw = bcrypt.hash(user.password)

    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw,
        currency_preference=user.currency_preference
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # 取得 user_id

    # ✅ 自動為新使用者建立預設帳戶
    try:
        default_account = Account(
            user_id=db_user.user_id,
            account_name="預設帳戶",
            account_type="cash",
            currency=db_user.currency_preference,
            balance=0  # ← 建議你補上這行
        )
        db.add(default_account)
        db.commit()
        db.refresh(default_account)
        print(f"✅ 帳戶建立成功，account_id: {default_account.account_id}")
    except SQLAlchemyError as e:
        db.rollback()
        print(f"❌ 帳戶建立失敗: {e}")
        raise HTTPException(status_code=500, detail="建立預設帳戶失敗")

    # ➕ 預設分類
    default_categories = [
        {"name": "收入", "type": "income", "color_tag": "#FFD700"},
        {"name": "餐飲", "type": "expense", "color_tag": "#FF0000"},
        {"name": "購物", "type": "expense", "color_tag": "#FFA500"},
        {"name": "交通", "type": "expense", "color_tag": "#00AA00"},
        {"name": "銀行交易", "type": "expense", "color_tag": "#0000FF"},
        {"name": "房租", "type": "expense", "color_tag": "#800080"},
        {"name": "娛樂", "type": "expense", "color_tag": "#87CEFA"},
        {"name": "學習", "type": "expense", "color_tag": "#00008B"},
        {"name": "其它", "type": "expense", "color_tag": "#00008B"},
    ]

    try:
        for cat in default_categories:
            new_category = Category(
                user_id=db_user.user_id,
                name=cat["name"],
                type=cat["type"],
                color_tag=cat["color_tag"]
            )
            db.add(new_category)
        db.commit()
        print(f"✅ 預設分類建立成功，共 {len(default_categories)} 筆")
    except SQLAlchemyError as e:
        db.rollback()
        print(f"❌ 分類建立失敗: {e}")
        raise HTTPException(status_code=500, detail="建立預設分類失敗")

    return {"message": "註冊成功"}

from schemas.user import UserOut
from schemas.user import UserLogin, LoginResponse


@router.post("/login", response_model=LoginResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter_by(email=user.email).first()

    if not db_user or not bcrypt.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="帳號或密碼錯誤")

    return {
        "message": "登入成功",
        "user": db_user
    }