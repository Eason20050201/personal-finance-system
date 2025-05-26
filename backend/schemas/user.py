# backend/schemas/user.py
from pydantic import BaseModel
from datetime import datetime

# 建立使用者時的輸入格式
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    currency_preference: str

# 使用者登入時的輸入格式
class UserLogin(BaseModel):
    username: str  # 使用者名稱
    password: str  # 使用者密碼

 # 回傳用的使用者格式，用於 API response
class UserOut(BaseModel):
    user_id: int
    name: str
    email: str
    currency_preference: str
    created_at: datetime

    class Config:
        orm_mode = True