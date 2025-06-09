from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Budget, Transaction
from schemas.budget import BudgetCreate, BudgetUpdate


def get_budgets_by_user(db: Session, user_id: int):
    budgets = db.query(Budget).filter(Budget.user_id == user_id).all()
    enriched = []

    for budget in budgets:
        # 計算該分類在此預算區間內的支出總額
        spent = (
            db.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.user_id == user_id,
                Transaction.category_id == budget.category_id,
                Transaction.transaction_date >= budget.start_date,
                Transaction.transaction_date <= budget.end_date,
                (Transaction.category_id == budget.category_id if budget.category_id is not None else True),
                Transaction.type == "expense"
            )
            .scalar()
        )

        enriched.append({
            "budget_id": budget.budget_id,
            "user_id": budget.user_id,
            "category_id": budget.category_id,
            "amount": budget.amount,
            "period": budget.period,
            "start_date": budget.start_date,
            "end_date": budget.end_date,
            "created_at": budget.created_at,
            "spent_amount": spent
        })

    return enriched


def create_budget(db: Session, budget_in: BudgetCreate):
    budget = Budget(**budget_in.dict())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


def update_budget(db: Session, budget_id: int, budget_in: BudgetUpdate):
    budget = db.query(Budget).filter(Budget.budget_id == budget_id).first()
    if not budget:
        return None
    for field, value in budget_in.dict(exclude_unset=True).items():
        setattr(budget, field, value)
    db.commit()
    db.refresh(budget)
    return budget


def delete_budget(db: Session, budget_id: int):
    budget = db.query(Budget).filter(Budget.budget_id == budget_id).first()
    if not budget:
        return None
    db.delete(budget)
    db.commit()
    return True
