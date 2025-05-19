from pydantic import BaseModel, condecimal
from datetime import datetime

# ➕ 新增帳戶輸入格式
class AccountCreate(BaseModel):
    user_id: int
    account_name: str
    account_type: str  # 可進一步限制選項，如 Enum
    currency: str = "TWD"
    balance: condecimal(max_digits=15, decimal_places=2) = 0

# 📤 查詢/回傳帳戶資料格式
class AccountOut(AccountCreate):
    account_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ➕ 更新帳戶輸入格式
class AccountUpdate(BaseModel):
    account_name: str | None = None
    account_type: str | None = None
    currency: str | None = None
    balance: condecimal(max_digits=15, decimal_places=2) | None = None
