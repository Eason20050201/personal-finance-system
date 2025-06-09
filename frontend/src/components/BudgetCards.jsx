import { useState, useEffect } from 'react';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import BudgetModal from './BudgetModal';
import api from '../api/axios';


export default function BudgetCards() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const autoRefresh = () => setRefreshTrigger(prev => prev + 1);
  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowModal(false);
    setEditingBudget(null);
  };

  useEffect(() => {
    const listener = () => autoRefresh();
    window.addEventListener('budget-refresh', listener);
    return () => window.removeEventListener('budget-refresh', listener);
  }, []);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('確定要刪除此預算？')) return;

    try {
      await api.delete(`/budgets/${budgetId}`);
      alert('刪除成功');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('刪除失敗:', err);
      alert('刪除失敗，請稍後再試');
    }
  };

  return (
    <div className="section">
      <h3 className="section-title">預算管理</h3>
      {/* <button className="action-btn" onClick={() => setShowModal(true)}>+ 新增預算</button> */}
      <button className="action-btn" onClick={() => {
        setEditingBudget(null); // 清除編輯狀態
        setShowModal(true);
      }}>+ 新增預算</button>
      <BudgetList refreshTrigger={refreshTrigger} onEdit={handleEdit} onDelete={handleDelete}/>
      {/* {showModal && <BudgetModal onClose={() => setShowModal(false)} onSuccess={handleFormSuccess} />} */}
      {showModal && (
        <BudgetModal
          onClose={() => {
            setShowModal(false);
            setEditingBudget(null);
          }}
          onSuccess={handleFormSuccess}
          editingData={editingBudget}
        />
      )}
    </div>
  );
}
