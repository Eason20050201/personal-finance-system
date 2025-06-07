import api from './axios';  // 你應該已經有 axios.js

// 取得某使用者的帳戶清單
export const getAccounts = (userId) => api.get(`/accounts/${userId}`);

// 新增一個帳戶
export const createAccount = (data) => api.post('/accounts', data);