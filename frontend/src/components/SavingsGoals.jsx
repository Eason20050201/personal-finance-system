// SavingsGoals.jsx
import { useState } from 'react';
import SavingsGoalList from './SavingsGoalList';
import SavingsGoalForm from './SavingsGoalForm';
import { deleteSavingsGoal } from '../api/savings_goal';

export default function SavingsGoals() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setShowModal(true)
  }

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('確定要刪除這筆儲蓄目標嗎？')) return;

    try {
      await deleteSavingsGoal(goalId);
      alert('刪除成功');
      triggerRefresh();
    } catch (err) {
      alert('刪除失敗');
      console.error(err);
    }
  };

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="section">
      {/* <h3 className="section-title">儲蓄目標設定與追蹤</h3>
      <SavingsGoalForm onSuccess={triggerRefresh} />
      <SavingsGoalList refreshTrigger={refreshTrigger} /> */}
      <div className="quick-actions">
        <button className="action-btn" onClick={() => {
          setEditingGoal(null);   // 👉 按新增時清除編輯狀態
          setShowModal(true);
        }}>+ 儲蓄目標</button>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <SavingsGoalForm
              editingData={editingGoal}
              onSuccess={() => {
                triggerRefresh()
                setShowModal(false)
                setEditingGoal(null);
              }}
            />
            <button className="cancel-btn" onClick={() => setShowModal(false)}>取消</button>
          </div>
        </div>
      )}

      <SavingsGoalList
        refreshTrigger={refreshTrigger}
        onEdit={handleEditGoal}   // ✅ 傳入 onEdit
        onDelete={handleDeleteGoal}
      />
    </div>
  );
}
