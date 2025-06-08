// src/api/category.js
import api from './axios';

export const getCategories = (user_id) => {
  return api.get(`/categories/${user_id}`);
};