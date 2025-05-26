from pydantic import BaseModel, condecimal

# 📊 類別消費統計資料格式
class CategorySummary(BaseModel):
    category_id: int
    category_name: str
    total: condecimal(max_digits=15, decimal_places=2)
    percentage: condecimal(max_digits=5, decimal_places=2)  # 百分比，如 32.50%

    class Config:
        orm_mode = True