from pydantic import BaseModel, EmailStr
from datetime import datetime

# 建立使用者時的輸入格式
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    currency_preference: str

# 使用者登入時的輸入格式
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# 回傳用的使用者格式
class UserOut(BaseModel):
    user_id: int
    name: str
    email: str
    currency_preference: str
    created_at: datetime

    class Config:
        orm_mode = True

class LoginResponse(BaseModel):
    message: str
    user: UserOut
