from models import Category

def categorize_transaction(item: str) -> str:
    if any(kw in item for kw in ['早餐', '午餐', '餐', 'Starbucks', 'Subway']):
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

def get_or_create_category_id(category_name: str, user_id: int, db) -> int:
    category = db.query(Category).filter_by(user_id=user_id, name=category_name).first()
    if not category:
        category = Category(user_id=user_id, name=category_name)
        db.add(category)
        db.flush()           # 讓 SQLAlchemy 發出 INSERT
        db.refresh(category) # 強制更新，取得 ID
    return category.category_id

