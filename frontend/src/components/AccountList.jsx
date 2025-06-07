import { useEffect, useState } from 'react';
import { getAccounts } from '../api/account';
import { useAuth } from '../AuthContext'; // 加這行

export default function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const { user } = useAuth(); // 從 context 拿到登入者資訊

  useEffect(() => {
    if (!user) return;
    getAccounts(user.user_id)
      .then(res => setAccounts(res.data))
      .catch(err => alert('載入失敗'));
  }, [user]);

  return (
    <div>
      <h2>帳戶列表</h2>
      <ul>
        {accounts.map(acc => (
          <li key={acc.account_id}>
            {acc.account_name} ({acc.currency})：{acc.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}
