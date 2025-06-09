import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../AuthContext';

export default function BudgetList({ refreshTrigger }) {
  const [budgetData, setBudgets] = useState([]);
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  const getCategoryName = (id) => {
    const found = categories.find(cat => cat.category_id === id);
    return found ? found.name : `分類 ${id}`;
    };

  useEffect(() => {
    const fetchCategories = async () => {
        try {
        const res = await api.get(`/categories/${user.user_id}`);
        setCategories(res.data);
        } catch (err) {
        console.error("載入分類失敗", err);
        }
    };
    if (user?.user_id) fetchCategories();
    }, [user]);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user?.user_id) return;
      try {
        const res = await api.get(`/budgets/${user.user_id}`);
        setBudgets(res.data);
      } catch (err) {
        console.error('取得預算資料失敗:', err);
      }
    };

    fetchBudgets();
  }, [user, refreshTrigger]); // 🔁 當 refreshTrigger 改變就重新載入

  return (
    <div className="budget-cards">
        {budgetData.map((item) => {
        const percent = item.spent_amount && item.amount
            ? ((item.spent_amount / item.amount) * 100).toFixed(1)
            : null;

        return (
            <div className="budget-card" key={item.budget_id}>
            <h4>{item.category_id ? getCategoryName(item.category_id) : '總預算'}</h4>
            <p>預算: ${item.amount}</p>
            <p>已花: ${item.spent_amount}</p>
            <p>期間: {item.period}</p>
            <p>起始日: {item.start_date?.slice(0, 10)}</p>
            <p>結束日: {item.end_date?.slice(0, 10)}</p>

            {percent !== null && (
                <>
                <div style={{ background: '#eee', height: 10, width: '100%', marginTop: 4 }}>
                    <div
                    style={{
                        width: `${Math.min(percent, 100)}%`,
                        background: '#f44336',
                        height: '100%',
                    }}
                    />
                </div>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    使用率：{percent}%
                </p>
                </>
            )}
            </div>
        );
        })}
    </div>
    );
}
