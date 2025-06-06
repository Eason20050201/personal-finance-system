import pandas as pd

def create_realistic_statement(filename="sample_statement.xlsx"):
    data = {
        '日期': [
            '2025-06-01', '2025-06-01', '2025-06-02', '2025-06-02', '2025-06-03',
            '2025-06-03', '2025-06-04', '2025-06-04', '2025-06-04', '2025-06-05',
            '2025-06-05', '2025-06-06', '2025-06-06', '2025-06-07', '2025-06-07',
            '2025-06-07', '2025-06-08', '2025-06-08', '2025-06-09', '2025-06-10',
            '2025-06-10', '2025-06-11', '2025-06-11', '2025-06-12', '2025-06-12',
            '2025-06-13', '2025-06-13', '2025-06-14', '2025-06-14', '2025-06-15',
            '2025-06-15', '2025-06-16', '2025-06-17', '2025-06-17', '2025-06-18'
        ],
        '項目': [
            '7-11購物', '薪資入帳', '早餐店 豆漿', '捷運悠遊卡加值', 'ATM提款',
            '轉帳給好友', '家樂福 購物', 'Netflix月費', '全聯 消費', 'Uber Eats 訂餐',
            'LINE Pay 轉帳', '手續費', '博客來 書籍', '拍賣退款', '國泰世華信用卡還款',
            '轉帳來自王小明', 'Subway 午餐', '租金收入', '水果攤', '家樂福 生鮮',
            '加油站', 'iTunes 訂閱', '公司發票獎金', '醫院掛號費', '藥局消費',
            'PChome 購物', '還信用卡', '水費', '電費', '電話費',
            '電話費（補扣）', '咖啡店 Starbucks', 'Uber 搭車', '電影院 訂票', '提款'
        ],
        '金額': [
            -165, 38000, -45, -500, -1000,
            -600, -820, -390, -256, -180,
            -900, -15, -315, 200, -9000,
            1500, -139, 8000, -60, -430,
            -1300, -150, 3000, -200, -185,
            -1299, -5000, -320, -870, -600,
            -210, -145, -250, -280, -2000
        ],
        '備註': [
            '生活日常', '2025年6月薪水', '早餐', '捷運通勤加值', '現金提領',
            'LINE好友轉帳', '日用品採購', '每月自動扣款', '日常採買', '外送平台',
            '手機轉帳', '轉帳手續費', '閱讀購物', '退貨', '信用卡帳單付款',
            '轉帳收款', '速食店用餐', '房東轉入', '市場水果', '採買蔬菜肉類',
            '汽油加油', '蘋果訂閱費用', '員工獎金', '門診費用', '感冒藥',
            '線上購物', '繳費', '台水繳費單', '台電帳單', '中華電信',
            '補扣上期費用', '咖啡飲品', '交通搭乘', '朋友約電影', 'ATM 現金'
        ]
    }
    df = pd.DataFrame(data)
    df.to_excel(filename, index=False)
    print(f" 已建立範例對帳單：{filename}")

def auto_categorize(df: pd.DataFrame) -> pd.DataFrame:
    def categorize(row):
        item = row['項目']
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
    df['分類'] = df.apply(categorize, axis=1)
    return df

def manual_check(df: pd.DataFrame) -> pd.DataFrame:
    print("\n 進入手動校對模式（按 Enter 可跳過）\n")
    for i, row in df.iterrows():
        print(f"{i+1:02d}. {row['日期']} | {row['項目']} | 金額: {row['金額']} | 建議分類: {row['分類']}")
        new_cat = input("請輸入新的分類（或 Enter 保留）：").strip()
        if new_cat:
            df.at[i, '分類'] = new_cat
    return df

def export_to_excel(df: pd.DataFrame, output_path: str):
    df.to_excel(output_path, index=False)
    print(f"\n 已匯出分類後對帳單至：{output_path}")

def main():
    input_file = "sample_statement.xlsx"
    output_file = "categorized_statement.xlsx"
    
    create_realistic_statement(input_file)
    df = pd.read_excel(input_file)
    df = auto_categorize(df)
    df = manual_check(df)
    export_to_excel(df, output_file)

if __name__ == "__main__":
    main()
