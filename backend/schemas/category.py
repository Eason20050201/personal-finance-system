from pydantic import BaseModel
from enum import Enum

class CategoryType(str, Enum):
    income = "income"
    expense = "expense"

# ➕ 建立類別用
class CategoryCreate(BaseModel):
    user_id: int
    name: str
    type: CategoryType

# 📤 回傳類別資訊用
class CategoryOut(CategoryCreate):
    category_id: int

    class Config:
        orm_mode = True

class CategoryUpdate(BaseModel):
    name: str | None = None
    type: CategoryType | None = None