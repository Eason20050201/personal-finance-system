import { useEffect, useState } from 'react';
import { getSavingsGoals } from '../api/savings_goal';
import { useAuth } from '../AuthContext'; // ✅ 加這行

export default function SavingsGoalList() {
  const [goals, setGoals] = useState([]);
  const { user } = useAuth(); // ✅ 取得目前登入的 user

  useEffect(() => {
    if (!user) return;
    getSavingsGoals(user.user_id)  // ✅ 改這裡
      .then((res) => setGoals(res.data))
      .catch(() => alert('載入失敗'));
  }, [user]); // ✅ user 進依賴清單，確保登入後能重新載入

  return (
    <div>
      <h3>儲蓄目標列表</h3>
      <ul>
        {goals.map((goal) => {
          const percent = ((goal.current_amount / goal.target_amount) * 100).toFixed(1);
          return (
            <li key={goal.goal_id}>
              🎯 {goal.name}：{goal.current_amount} / {goal.target_amount}（{percent}%）
              <div style={{ background: '#eee', height: 10, width: '100%', marginTop: 4 }}>
                <div style={{ width: `${percent}%`, background: '#4caf50', height: '100%' }}></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

