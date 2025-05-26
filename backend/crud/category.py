from sqlalchemy.orm import Session
from models.category import Category
from schemas.category import CategoryCreate
from schemas.category import CategoryUpdate

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

def update_category(db: Session, category_id: int, category_in: CategoryUpdate):
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        return None
    for field, value in category_in.dict(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category

def delete_category(db: Session, category_id: int):
    category = db.query(Category).filter(Category.category_id == category_id).first()
    if not category:
        return None
    db.delete(category)
    db.commit()
    return category