import api from './axios';

export const getRecurring = (userId) =>
  api.get(`/recurring/user/${userId}`);

export const createRecurring = (data) =>
  api.post('/recurring', data);
