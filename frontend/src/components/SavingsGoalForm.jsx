// SavingsGoalForm.jsx
import { useState, useEffect } from 'react';
import { createSavingsGoal, updateSavingsGoal } from '../api/savings_goal';
import { useAuth } from '../AuthContext';

export default function SavingsGoalForm({ onSuccess, editingData }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    target_amount: 10000,
    current_amount: 0,
    target_date: '',
    note: '',
  });

  // 🔁 載入 editingData
  useEffect(() => {
    if (editingData) {
      setForm({
        name: editingData.name || '',
        target_amount: editingData.target_amount || 0,
        current_amount: editingData.current_amount || 0,
        target_date: editingData.target_date || '',
        note: editingData.note || '',
      });
    }
  }, [editingData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingData) {
        // ✏️ 編輯模式
        await updateSavingsGoal(editingData.goal_id, form);
        alert('目標已更新');
      } else {
        // ➕ 新增模式
        await createSavingsGoal({ ...form, user_id: user.user_id });
        alert('目標已建立');
      }
      setForm({
        name: '',
        target_amount: 10000,
        current_amount: 0,
        target_date: '',
        note: '',
      });
      onSuccess(); // ✅ 通知父層刷新
    } catch (err) {
      alert('建立失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h3 className="login-title">新增儲蓄目標</h3>
      
      <div className="form-group">
        <label>目標名稱</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>目標金額</label>
        <input name="target_amount" value={form.target_amount} type="number" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>目前金額</label>
        <input name="current_amount" value={form.current_amount} type="number" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>目標日期</label>
        <input name="target_date" value={form.target_date} type="date" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>備註</label>
        <textarea name="note" value={form.note} onChange={handleChange} />
      </div>

      <button className="login-btn" type="submit">送出</button>
    </form>
  );
}
