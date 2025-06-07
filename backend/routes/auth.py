# backend/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin

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
    db.refresh(db_user)  # ← 建議加這行，取得自動生成的 id 等欄位

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