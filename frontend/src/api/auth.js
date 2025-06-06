import api from './axios';

// 使用者登入
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// 使用者註冊
export const register = (name, email, password, currency_preference) =>
  api.post('/auth/register', {  // ← 加上 /auth
    name,
    email,
    password,
    currency_preference,
  });