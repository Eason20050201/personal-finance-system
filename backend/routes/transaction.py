from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
import crud.transaction as transaction_crud
import schemas.transaction as transaction_schema

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

# router = APIRouter()

@router.post("/bulk-csv")
def import_transactions_from_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = file.file.read().decode("utf-8")
        print(f"收到檔案：{file.filename}")
        reader = csv.DictReader(StringIO(content))

        imported_data = []

        for i, row in enumerate(reader, start=1):
            try:
                amount = float(row["金額"])
                transaction_type = "income" if amount > 0 else "expense"
                db_transaction = Transaction(
                    user_id=1,  # 先寫死，日後從 token 抓
                    transaction_date=row["日期"],
                    amount=abs(amount),  # 存入資料統一為正值
                    note=row.get("備註", ""),
                    type=transaction_type,
                    account_id=1,
                    category_id=1,
                )
                db.add(db_transaction)
                imported_data.append({
                    "transaction_date": row["日期"],
                    "amount": float(row["金額"]),
                    "note": row.get("備註", None),
                    "type": "expense",
                    "account_id": 1,
                    "category_id": 1
                })
            except Exception as row_err:
                raise HTTPException(
                    status_code=400,
                    detail=f"第 {i} 筆資料格式錯誤：{row_err}"
                )

        db.commit()
        return {
            "msg": "CSV 匯入成功",
            "data": imported_data
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"CSV 匯入失敗：{str(e)}")

@router.get("/", response_model=list[transaction_schema.TransactionOut])
def get_all_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return transactions

