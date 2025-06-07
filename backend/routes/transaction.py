from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
import crud.transaction as transaction_crud
import schemas.transaction as transaction_schema
import pdfplumber
from models.transaction import Transaction, TransactionType

import pandas as pd
import pdfplumber
from datetime import datetime
import os

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

# 📥 查詢指定使用者的所有交易，支援條件查詢
@router.get("/{user_id}", response_model=List[transaction_schema.TransactionOut])
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

# 🧾 批量匯入交易資料（API 呼叫傳入 JSON 陣列）
@router.post("/bulk")
def import_transactions(
    transactions: List[transaction_schema.TransactionCreate],
    db: Session = Depends(get_db),
):
    try:
        for transaction in transactions:
            db_transaction = Transaction(**transaction.dict())
            db.add(db_transaction)
        db.commit()
        return {"msg": "success"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"批次匯入失敗：{str(e)}")

# 📂 上傳 CSV、Excel、PDF 檔案，自動分類並匯入
from models.category import Category  

@router.post("/upload")
async def upload_transaction_file(
    file: UploadFile = File(...),
    user_id: int = Query(...),
    db: Session = Depends(get_db),
):
    def parse_file(file: UploadFile) -> pd.DataFrame:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext == ".csv":
            return pd.read_csv(file.file)
        elif ext == ".pdf":
            return parse_pdf(file)
        else:
            raise HTTPException(status_code=400, detail="只支援 CSV, 或 PDF")

    def parse_pdf(file: UploadFile) -> pd.DataFrame:
        with pdfplumber.open(file.file) as pdf:
            all_rows = []
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        all_rows.append(row)
        df = pd.DataFrame(all_rows[1:], columns=all_rows[0])
        return df

    def auto_categorize(item: str) -> str:
        if any(kw in item for kw in ['早餐', '午餐', '晚餐', 'Starbucks', 'Subway']):
            return '餐飲'
        elif any(kw in item for kw in ['7-11', '全聯', '家樂福', 'PChome', '博客來']):
            return '購物'
        elif any(kw in item for kw in ['薪資', '收入', '獎金', '退款']):
            return '收入'
        elif any(kw in item for kw in ['ATM', '轉帳', '還款', '提款']):
            return '銀行交易'
        elif any(kw in item for kw in ['悠遊卡', 'Uber', '捷運', '加油']):
            return '交通'
        elif any(kw in item for kw in ['水費', '電費', '電話費']):
            return '生活費'
        elif any(kw in item for kw in ['Netflix', 'iTunes', '電影']):
            return '娛樂訂閱'
        elif any(kw in item for kw in ['藥局', '醫院']):
            return '醫療'
        else:
            return '其他'

    def get_category_id_by_name(db: Session, name: str) -> int | None:
        category = db.query(Category).filter(Category.name == name).first()
        return category.category_id if category else None

    try:
        df = parse_file(file)

        required_columns = {'日期', '項目', '金額', '備註'}
        if not required_columns.issubset(set(df.columns)):
            raise HTTPException(status_code=400, detail=f"檔案缺少欄位：{required_columns - set(df.columns)}")

        inserted = 0
        for _, row in df.iterrows():
            try:
                item = str(row['項目'])
                amount = float(row['金額'])
                trans_type = TransactionType.income if amount > 0 else TransactionType.expense

                category_name = auto_categorize(item)
                category_id = get_category_id_by_name(db, category_name)

                transaction_data = TransactionCreate(
                    user_id=user_id,
                    account_id=None,
                    category_id=category_id,
                    amount=abs(amount),
                    type=trans_type,
                    transaction_date=pd.to_datetime(row['日期']).date(),
                    note=str(row.get('備註', '')),
                    tags=None,
                    recurring_id=None
                )

                create_transaction(db, transaction_data)
                inserted += 1
            except Exception as e:
                print(f"跳過錯誤列：{row} - {e}")
                continue

        db.commit()
        return {"msg": "成功匯入", "筆數": inserted}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"匯入失敗：{str(e)}")
