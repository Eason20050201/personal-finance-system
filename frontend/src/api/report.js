import api from './axios';

export const getCategorySummary = (userId, startDate, endDate) =>
  api.get('/reports/category-summary', {
    params: {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    },
  });
