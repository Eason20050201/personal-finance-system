import { useEffect, useState } from 'react';
import { getRecurring } from '../api/recurring';
import { useAuth } from '../AuthContext'; // ✅ 引入登入資訊

export default function RecurringList() {
  const [recurring, setRecurring] = useState([]);
  const { user } = useAuth(); // ✅ 取得登入者 user_id

  useEffect(() => {
    if (!user) return;
    getRecurring(user.user_id)  // ✅ 改成動態 user_id
      .then((res) => setRecurring(res.data))
      .catch(() => alert('讀取失敗'));
  }, [user]); // ✅ user 變動時重新抓資料

  return (
    <div>
      <h3>定期交易列表</h3>
      <ul>
        {recurring.map((item) => (
          <li key={item.recurring_id}>
            {item.frequency} {item.type === 'expense' ? '💸' : '💵'} ${item.amount} → {item.note}（{item.next_occurrence}）
          </li>
        ))}
      </ul>
    </div>
  );
}