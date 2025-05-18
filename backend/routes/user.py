# backend/routes/user.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import UserCreate, UserOut
from crud import user as user_crud
from models.user import User

router = APIRouter()

# 建立使用者
@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user)

# 查詢所有使用者
@router.get("/", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    print("🚨 查到的 users:", users)
    for u in users:
        print("🚨 單一 user 欄位：", u.__dict__)
    return users
