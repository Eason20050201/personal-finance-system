from fastapi import APIRouter, Depends, HTTPException, Query, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional, List
import csv
from io import StringIO

from database import get_db
from models import Transaction
import crud.transaction as transaction_crud
import schemas.transaction as transaction_schema
from utils.categorize import categorize_transaction, get_or_create_category_id

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
)

# ➕ 新增交易
@router.post("/", response_model=transaction_schema.TransactionOut)
def create_transaction(
    transaction_in: transaction_schema.TransactionCreate,
    db: Session = Depends(get_db),
):
    return transaction_crud.create_transaction(db, transaction_in)

# 📥 查詢指定使用者的所有交易
# @router.get("/{user_id}", response_model=list[transaction_schema.TransactionOut])
# def get_transactions_by_user(user_id: int, db: Session = Depends(get_db)):
#     transactions = transaction_crud.get_transactions_by_user(db, user_id)
#     if not transactions:
#         raise HTTPException(status_code=404, detail="No transactions found for this user")
#     return transactions

# 📥 查詢指定使用者的所有交易，支援條件查詢
@router.get("/{user_id}", response_model=list[transaction_schema.TransactionOut])
def get_transactions_by_user(
    user_id: int,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    min_amount: Optional[float] = Query(None),
    max_amount: Optional[float] = Query(None),
    db: Session = Depends(get_db),
):
    return transaction_crud.get_transactions_by_filters(
        db, user_id, start_date, end_date, category_id, min_amount, max_amount
    )

# ✏️ 修改交易
@router.put("/{transaction_id}", response_model=transaction_schema.TransactionOut)
def update_transaction(
    transaction_id: int,
    transaction_in: transaction_schema.TransactionUpdate,
    db: Session = Depends(get_db),
):
    updated = transaction_crud.update_transaction(db, transaction_id, transaction_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated

# ❌ 刪除交易
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    deleted = transaction_crud.delete_transaction(db, transaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"detail": "Transaction deleted"}



from typing import List
from models.transaction import Transaction
from sqlalchemy.exc import SQLAlchemyError

# 🧾 批量匯入交易資料（例如從 CSV）
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import csv
from io import StringIO
from models import Transaction  # 假設你有這個模型
from database import get_db

#router = APIRouter()

@router.post("/bulk-csv")
def import_transactions_from_csv(
    user_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        user_id = int(user_id)
        content = file.file.read().decode("utf-8")
        reader = csv.DictReader(StringIO(content))
        imported_data = []

        for i, row in enumerate(reader, start=1):
            try:
                amount = float(row["金額"])
                transaction_type = "income" if amount > 0 else "expense"
                category_name = categorize_transaction(row["項目"])
                category_id = get_or_create_category_id(category_name, user_id, db)

                db_transaction = Transaction(
                    user_id=user_id,
                    transaction_date=row["日期"],
                    amount=abs(amount),
                    note=row.get("備註", ""),
                    type=transaction_type,
                    account_id=1,
                    category_id=category_id
                )
                db.add(db_transaction)
                imported_data.append({
                    "transaction_date": row["日期"],
                    "amount": abs(amount),
                    "note": row.get("備註", ""),
                    "type": transaction_type,
                    "category_id": category_id
                })
            except Exception as row_err:
                raise HTTPException(
                    status_code=400,
                    detail=f"第 {i} 筆資料格式錯誤：{row_err}"
                )

        db.commit()
        return {
            "msg": "CSV 匯入成功，自動分類完成",
            "data": imported_data
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"CSV 匯入失敗：{str(e)}")
from schemas import transaction as transaction_schema

@router.get("/all/{user_id}")
def get_transactions_by_user(user_id: int, db: Session = Depends(get_db)):
    print(f"✅ 收到 user_id: {user_id}")
    
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    
    result = []
    for t in transactions:
        result.append({
            "id": t.transaction_id,
            "transaction_date": t.transaction_date,
            "amount": t.amount,
            "note": t.note,
            "type": t.type,
            "category": {
                "id": t.category.category_id,
                "name": t.category.name
            } if t.category else None,
        })

    return result