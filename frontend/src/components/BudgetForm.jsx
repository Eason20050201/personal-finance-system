import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../AuthContext';

export default function BudgetForm({ onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    category_id: 2,
    amount: '',
    start_date: '',
    end_date: ''
  });

  const [categories, setCategories] = useState([]) // ✅ 分類選項

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/categories/${user.user_id}`);
        setCategories(res.data);
      } catch (err) {
        console.error('載入分類失敗', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', {
        ...form,
        user_id: user.user_id,
        amount: parseFloat(form.amount),
        category_id: form.category_id ? parseInt(form.category_id) : null
      });
      alert('預算已建立');
      setForm({ category_id: '', amount: '', start_date: '', end_date: '' });
      onSuccess();
    } catch (err) {
      alert('建立失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>新增預算</h4>

      {/* ✅ 分類下拉選單 */}
      <select name="category_id" value={form.category_id} onChange={handleChange}>
        <option value="">選擇分類</option>
        {categories.map((cat) => (
          <option key={cat.category_id} value={cat.category_id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input name="amount" value={form.amount} type="number" placeholder="預算金額" onChange={handleChange} />
      {/* <select name="period" value={form.period} onChange={handleChange}>
        <option value="daily">每日</option>
        <option value="weekly">每週</option>
        <option value="monthly">每月</option>
      </select> */}
      <input name="start_date" value={form.start_date} type="date" onChange={handleChange} />
      <input name="end_date" value={form.end_date} type="date" onChange={handleChange} />
      <button type="submit">送出</button>
    </form>
  );
}
