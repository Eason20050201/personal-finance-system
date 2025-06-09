// SavingsGoalList.jsx
import { useEffect, useState } from 'react';
import { getSavingsGoals } from '../api/savings_goal';
import { useAuth } from '../AuthContext';

export default function SavingsGoalList({ refreshTrigger, onEdit, onDelete }) {
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
    <div className="savings-goal-list">
      <h3 className="section-title">儲蓄目標列表</h3>
      <ul className="goal-list">
        {goals.map((goal) => {
          const percent = ((goal.current_amount / goal.target_amount) * 100).toFixed(1);
          return (
            <li key={goal.goal_id} className="goal-item">
              <div className="goal-header">
                {/* <strong>{goal.name}</strong> */}
                <div className="goal-title">{goal.name}</div>
                <div className="goal-actions"></div>
                <button
                  onClick={() => onEdit(goal)}
                  className="edit-btn"
                >
                  編輯
                </button>
                <button
                  onClick={() => onDelete(goal.goal_id)}
                  className="delete-btn"
                >
                  刪除
                </button>
              </div>
              <div className="goal-progress">
                {goal.current_amount} / {goal.target_amount}（{percent}%）
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
              {goal.note && <div className="goal-note">備註：{goal.note}</div>}
            </li>
          );
        })}
      </ul>
    </div>
    // <div>
    //   <h3>儲蓄目標列表</h3>
    //   <ul>
    //     {goals.map((goal) => {
    //       const percent = ((goal.current_amount / goal.target_amount) * 100).toFixed(1);
    //       return (
    //         <li key={goal.goal_id} style={{ marginBottom: '1rem' }}>
    //            {goal.name}：{goal.current_amount} / {goal.target_amount}（{percent}%）
    //           <div style={{ background: '#eee', height: 10, width: '100%', marginTop: 4 }}>
    //             <div style={{ width: `${percent}%`, background: '#4caf50', height: '100%' }}></div>
    //           </div>
    //           {goal.note && (
    //             <div style={{ fontSize: '0.9rem', color: '#666', marginTop: 4 }}>
    //               備註：{goal.note}
    //             </div>
    //           )}
    //         </li>
    //       );
    //     })}
    //   </ul>
    // </div>
  );
}
