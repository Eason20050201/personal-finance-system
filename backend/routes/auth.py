# backend/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin
from crud import user as crud_user

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter_by(username=user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_pw = bcrypt.hash(user.password)
    db_user = User(username=user.username, password_hash=hashed_pw)
    db.add(db_user)
    db.commit()
    return crud_user.create_user(db, user)

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter_by(username=user.username).first()
    if not db_user or not bcrypt.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="帳號或密碼錯誤")
    return {"message": "登入成功"}
