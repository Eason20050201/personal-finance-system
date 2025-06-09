import { useState, useEffect } from 'react';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import BudgetModal from './BudgetModal';

export default function BudgetCards() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const autoRefresh = () => setRefreshTrigger(prev => prev + 1);
  // const triggerRefresh = () => {
  //   setRefreshTrigger((prev) => prev + 1);
  //   setShowModal(false);
  // };
  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowModal(false);
  };

  useEffect(() => {
    const listener = () => autoRefresh();
    window.addEventListener('budget-refresh', listener);
    return () => window.removeEventListener('budget-refresh', listener);
  }, []);


  return (
    <div className="section">
      <h3 className="section-title">預算管理</h3>
      <button className="action-btn" onClick={() => setShowModal(true)}>+ 新增預算</button>
      <BudgetList refreshTrigger={refreshTrigger} />
      {showModal && <BudgetModal onClose={() => setShowModal(false)} onSuccess={handleFormSuccess} />}
    </div>
  );
}
