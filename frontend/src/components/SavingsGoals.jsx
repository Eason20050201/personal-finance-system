// SavingsGoals.jsx
import { useState } from 'react';
import SavingsGoalList from './SavingsGoalList';
import SavingsGoalForm from './SavingsGoalForm';

export default function SavingsGoals() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="section">
      <h3 className="section-title">儲蓄目標設定與追蹤</h3>
      <SavingsGoalForm onSuccess={triggerRefresh} />
      <SavingsGoalList refreshTrigger={refreshTrigger} />
    </div>
  );
}
