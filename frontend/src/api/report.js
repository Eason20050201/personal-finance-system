import api from './axios';

export const getCategorySummary = (userId, startDate, endDate) => {
  // 🛡 修正非法日期，例如 2025-06-31 → 2025-06-30
  const safeEndDate = fixInvalidDate(endDate);

  return api.get('/reports/category-summary', {
    params: {
      user_id: userId,
      start_date: startDate,
      end_date: safeEndDate,
    },
  });
};

export const getIncomeExpenseTotals = (user_id, start_date, end_date) =>
  api.get(`/reports/totals`, {
    params: { user_id, start_date, end_date }
  })

// 🔧 新增這個函數
function fixInvalidDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // ❌ 無法解析的日期，就強制設成今天
    return new Date().toISOString().split('T')[0];
  }
  // ✅ 輸出 yyyy-mm-dd 格式
  return date.toISOString().split('T')[0];
}
