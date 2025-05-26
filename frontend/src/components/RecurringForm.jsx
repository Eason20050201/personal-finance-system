import { useState } from 'react';
import { createRecurring } from '../api/recurring';

export default function RecurringForm() {
  const [form, setForm] = useState({
    user_id: 1,
    account_id: 1,
    category_id: 1,
    amount: 1000,
    type: 'expense',
    frequency: 'monthly',
    start_date: '',
    end_date: '',
    next_occurrence: '',
    note: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRecurring(form);
      alert('新增成功');
    } catch {
      alert('新增失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>新增定期交易</h3>
      <input name="amount" placeholder="金額" type="number" onChange={handleChange} />
      <select name="type" onChange={handleChange}>
        <option value="expense">支出</option>
        <option value="income">收入</option>
      </select>
      <select name="frequency" onChange={handleChange}>
        <option value="daily">每日</option>
        <option value="weekly">每週</option>
        <option value="monthly">每月</option>
      </select>
      <input name="start_date" type="date" onChange={handleChange} placeholder="起始日" />
      <input name="end_date" type="date" onChange={handleChange} placeholder="結束日（可空）" />
      <input name="next_occurrence" type="date" onChange={handleChange} placeholder="下次執行日" />
      <input name="note" placeholder="備註" onChange={handleChange} />
      <button type="submit">新增</button>
    </form>
  );
}
