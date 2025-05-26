import api from './axios';

export const getTransactions = (userId) =>
  api.get(`/transactions/${userId}`);

export const createTransaction = (data) =>
  api.post('/transactions', data);

export const getFilteredTransactions = (userId, filters) =>
  api.get(`/transactions/${userId}`, {
    params: filters, // 可包含 start_date, end_date, category_id, min_amount, max_amount
  });