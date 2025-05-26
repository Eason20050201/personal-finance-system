import api from './axios';

// 使用者登入
export const login = (username, password) =>
  api.post('/login', { username, password });

// 使用者註冊
export const register = (name, email, password, currency_preference) =>
  api.post('/register', {
    name,
    email,
    password,
    currency_preference,
  });