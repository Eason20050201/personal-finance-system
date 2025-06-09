import { useState } from 'react';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';

export default function BudgetCards() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <div className="section">
      <h3 className="section-title">預算管理</h3>
      <BudgetForm onSuccess={triggerRefresh} />
      <BudgetList refreshTrigger={refreshTrigger} />
    </div>
  );
}
