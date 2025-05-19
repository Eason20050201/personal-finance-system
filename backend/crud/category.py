from sqlalchemy.orm import Session
from models.category import Category
from schemas.category import CategoryCreate

# ➕ 新增一筆分類
def create_category(db: Session, category_in: CategoryCreate):
    db_category = Category(**category_in.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# 📥 查詢某使用者的所有分類
def get_categories_by_user(db: Session, user_id: int):
    return db.query(Category).filter(Category.user_id == user_id).all()