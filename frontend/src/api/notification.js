import api from './axios';

// 取得通知（可選是否只看未讀）
export const getNotifications = (userId, unreadOnly = false) =>
  api.get(`/notifications/${userId}?unread_only=${unreadOnly}`);

// 將通知設為已讀
export const markNotificationRead = (id) =>
  api.post(`/notifications/${id}/read`);