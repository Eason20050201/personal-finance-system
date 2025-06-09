from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
import crud.report as report_crud
import schemas.report as report_schema
from datetime import date
from sqlalchemy import func
from models.transaction import Transaction

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
    return summary  # ✅ 就算 summary 是空陣列也沒關係

# 📊 查詢使用者在指定期間內的支出與收入總額
@router.get("/totals", response_model=dict)
def get_income_expense_totals(
    user_id: int = Query(...),
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db)
):
    from models.transaction import Transaction

    income = db.query(func.sum(Transaction.amount))\
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "income",
            Transaction.transaction_date.between(start_date, end_date)
        ).scalar() or 0

    expense = db.query(func.sum(Transaction.amount))\
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            Transaction.transaction_date.between(start_date, end_date)
        ).scalar() or 0

    return {"income": income, "expense": expense}