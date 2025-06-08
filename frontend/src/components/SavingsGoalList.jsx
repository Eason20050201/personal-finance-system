// SavingsGoalList.jsx
import { useEffect, useState } from 'react';
import { getSavingsGoals } from '../api/savings_goal';
import { useAuth } from '../AuthContext';

export default function SavingsGoalList({ refreshTrigger }) {
  const [goals, setGoals] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.user_id) return;

    getSavingsGoals(user.user_id)
      .then((res) => setGoals(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setGoals([]);
        } else {
          alert('載入失敗');
        }
      });
  }, [user, refreshTrigger]); // ✅ 依賴 refreshTrigger

  return (
    <div>
      <h3>儲蓄目標列表</h3>
      <ul>
        {goals.map((goal) => {
          const percent = ((goal.current_amount / goal.target_amount) * 100).toFixed(1);
          return (
            <li key={goal.goal_id} style={{ marginBottom: '1rem' }}>
               {goal.name}：{goal.current_amount} / {goal.target_amount}（{percent}%）
              <div style={{ background: '#eee', height: 10, width: '100%', marginTop: 4 }}>
                <div style={{ width: `${percent}%`, background: '#4caf50', height: '100%' }}></div>
              </div>
              {goal.note && (
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: 4 }}>
                  備註：{goal.note}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
