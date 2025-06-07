import api from './axios';

export const getSavingsGoals = (userId) =>
  api.get(`/savings-goals/${userId}`);

export const createSavingsGoal = (data) =>
  api.post('/savings-goals', data);
