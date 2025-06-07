import { useState } from 'react';
import { createSavingsGoal } from '../api/savings_goal';

export default function SavingsGoalForm() {
  const [form, setForm] = useState({
    user_id: 1,
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
      await createSavingsGoal(form);
      alert('目標已建立');
    } catch (err) {
      alert('建立失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>新增儲蓄目標</h3>
      <input name="name" placeholder="目標名稱" onChange={handleChange} />
      <input name="target_amount" type="number" placeholder="目標金額" onChange={handleChange} />
      <input name="target_date" type="date" onChange={handleChange} />
      <textarea name="note" placeholder="備註" onChange={handleChange} />
      <button type="submit">送出</button>
    </form>
  );
}
