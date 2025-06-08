from models import Category
def categorize_transaction(item: str) -> str:
    item = item.lower()  # 小寫處理避免大小寫錯誤

    if any(kw in item for kw in ['薪資', '收入', '獎金', '退款', '匯款']):
        return '收入'
    elif any(kw in item for kw in ['早餐', '午餐', '晚餐', 'starbucks', 'subway', '拉麵', '牛肉麵', '餐']):
        return '餐飲'
    elif any(kw in item for kw in ['7-11', '全聯', '家樂福', 'pchome', 'momo', '蝦皮', '博客來']):
        return '購物'
    elif any(kw in item for kw in ['捷運', '公車', '高鐵', 'uber', 'ubike', '加油', '交通']):
        return '交通'
    elif any(kw in item for kw in ['atm', '轉帳', '還款', '提款', '手續費', '銀行']):
        return '銀行交易'
    elif any(kw in item for kw in ['租金', '房租']):
        return '房租'
    elif any(kw in item for kw in ['netflix', '電影', '音樂', '演唱會']):
        return '娛樂'
    elif any(kw in item for kw in ['補習', '學費', '教材', '書店']):
        return '教育'
    else:
        return '其它'

def get_or_create_category_id(category_name: str, user_id: int, db) -> int:
    category = db.query(Category).filter_by(user_id=user_id, name=category_name).first()
    if not category:
        category = Category(user_id=user_id, name=category_name)
        db.add(category)
        db.flush()           # 讓 SQLAlchemy 發出 INSERT
        db.refresh(category) # 強制更新，取得 ID
    return category.category_id

