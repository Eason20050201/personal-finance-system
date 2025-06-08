// SavingsGoalForm.jsx
import { useState } from 'react';
import { createSavingsGoal } from '../api/savings_goal';
import { useAuth } from '../AuthContext';

export default function SavingsGoalForm({ onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    target_amount: 10000,
    current_amount: 0,
    target_date: '',
    note: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSavingsGoal({ ...form, user_id: user.user_id });
      alert('目標已建立');
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
    <form onSubmit={handleSubmit}>
      <h3>新增儲蓄目標</h3>
      <input name="name" value={form.name} placeholder="目標名稱" onChange={handleChange} />
      <input name="target_amount" value={form.target_amount} type="number" placeholder="目標金額" onChange={handleChange} />
      <input name="target_date" value={form.target_date} type="date" onChange={handleChange} />
      <textarea name="note" value={form.note} placeholder="備註" onChange={handleChange} />
      <button type="submit">送出</button>
    </form>
  );
}
