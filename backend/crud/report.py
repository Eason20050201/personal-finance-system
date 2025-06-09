from sqlalchemy.orm import Session
from sqlalchemy import func
from models.transaction import Transaction
from models.category import Category
from datetime import date

# 📊 查詢某使用者在指定期間內的各類別支出總額與百分比
def get_category_expense_summary(db: Session, user_id: int, start_date: date, end_date: date):
    total = db.query(func.sum(Transaction.amount))\
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            Transaction.transaction_date.between(start_date, end_date)  # ✅ 正確欄位
        )\
        .scalar() or 1  # 避免除以 0

    results = db.query(
        Category.category_id.label("category_id"),
        Category.name.label("category_name"),
        func.sum(Transaction.amount).label("total"),
        func.round((func.sum(Transaction.amount) / total * 100), 2).label("percentage"),
        Category.color_tag.label("color_tag")
    ).join(Transaction, Transaction.category_id == Category.category_id)\
    .filter(
        Transaction.user_id == user_id,
        Transaction.type == "expense",
        Transaction.transaction_date.between(start_date, end_date)
    )\
    .group_by(Category.category_id, Category.name, Category.color_tag)\
    .all()

    return results