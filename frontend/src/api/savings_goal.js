import api from './axios';

export const getSavingsGoals = (userId) =>
  api.get(`/savings-goals/${userId}`);

export const createSavingsGoal = (data) =>
  api.post('/savings-goals', data);

export const updateSavingsGoal = (goalId, data) =>
  api.put(`/savings-goals/${goalId}`, data);

export const deleteSavingsGoal = (goalId) =>
  api.delete(`/savings-goals/${goalId}`);

