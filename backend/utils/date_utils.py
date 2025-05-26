from datetime import date, timedelta, datetime
import calendar
import pytz

# ✅ 回傳台灣時區的現在時間（datetime）
def now_tw() -> datetime:
    return datetime.now(pytz.timezone("Asia/Taipei"))

# ➕ 根據 frequency 字串（daily/weekly/monthly）計算下一次日期
def get_next_occurrence(current: date, frequency: str) -> date:
    if frequency == "daily":
        return current + timedelta(days=1)
    elif frequency == "weekly":
        return current + timedelta(weeks=1)
    elif frequency == "monthly":
        # 增加一個月（保留日數）
        year = current.year + (current.month // 12)
        month = current.month % 12 + 1
        day = current.day
        last_day = calendar.monthrange(year, month)[1]
        return date(year, month, min(day, last_day))
    else:
        raise ValueError(f"Unsupported frequency: {frequency}")