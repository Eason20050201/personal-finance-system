from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
import crud.report as report_crud
import schemas.report as report_schema
from datetime import date

router = APIRouter(
    prefix="/reports",
    tags=["reports"],
)

# 📊 查詢各分類支出的總金額與比例
@router.get("/category-summary", response_model=list[report_schema.CategorySummary])
def get_category_summary(
    user_id: int = Query(..., description="使用者 ID"),
    start_date: date = Query(..., description="起始日期"),
    end_date: date = Query(..., description="結束日期"),
    db: Session = Depends(get_db),
):
    summary = report_crud.get_category_expense_summary(
        db=db,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date
    )
    if not summary:
        raise HTTPException(status_code=404, detail="No expense data found for this user and time period")
    return summary