from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud.category as category_crud
import schemas.category as category_schema

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
)

# ➕ 建立分類
@router.post("/", response_model=category_schema.CategoryOut)
def create_category(
    category_in: category_schema.CategoryCreate,
    db: Session = Depends(get_db),
):
    return category_crud.create_category(db, category_in)

# 📥 查詢使用者的所有分類
@router.get("/{user_id}", response_model=list[category_schema.CategoryOut])
def get_categories_by_user(user_id: int, db: Session = Depends(get_db)):
    categories = category_crud.get_categories_by_user(db, user_id)
    if not categories:
        raise HTTPException(status_code=404, detail="No categories found for this user")
    return categories