from sqlalchemy.orm import Session
from sqlalchemy import func
from models.transaction import Transaction
from models.category import Category

# 📊 查詢某使用者在指定期間內的各類別支出總額與百分比
def get_category_expense_summary(db: Session, user_id: int, start_date, end_date):
    # 聚合各類別支出總額
    results = (
        db.query(
            Transaction.category_id,
            Category.name.label("category_name"),
            func.sum(Transaction.amount).label("total")
        )
        .join(Category, Transaction.category_id == Category.category_id)
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date
        )
        .group_by(Transaction.category_id, Category.name)
        .all()
    )

    # 計算總支出以算百分比
    total_expense = sum(row.total for row in results)

    # 回傳帶百分比的結果
    return [
        {
            "category_id": row.category_id,
            "category_name": row.category_name,
            "total": round(float(row.total), 2),
            "percentage": round((row.total / total_expense) * 100, 2) if total_expense > 0 else 0
        }
        for row in results
    ]