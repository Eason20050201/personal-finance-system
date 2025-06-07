import { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead } from '../api/notification';
import { useAuth } from '../AuthContext'; // ✅ 引入登入狀態

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth(); // ✅ 取得目前登入的使用者

  const load = () => {
    if (!user) return;
    getNotifications(user.user_id) // ✅ 改成登入者的 ID
      .then((res) => setNotifications(res.data))
      .catch(() => alert('通知載入失敗'));
  };

  useEffect(() => {
    load(); // ✅ 初次與登入變化時觸發
  }, [user]); // ✅ 依賴 user

  const handleClick = async (id) => {
    await markNotificationRead(id);
    load(); // 重新刷新
  };

  return (
    <div>
      <h3>🔔 通知中心</h3>
      <ul>
        {notifications.length === 0 && <li>目前沒有通知</li>}
        {notifications.map((note) => (
          <li
            key={note.notification_id}
            onClick={() => handleClick(note.notification_id)}
            style={{
              cursor: 'pointer',
              background: note.is_read ? '#eee' : '#fff',
              borderLeft: note.is_read ? '4px solid #aaa' : '4px solid #ff9800',
              padding: 8,
              margin: '8px 0',
            }}
          >
            <strong>{note.type}</strong> - {note.message}
            <br />
            <small>{note.created_at}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
