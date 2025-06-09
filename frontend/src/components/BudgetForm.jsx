import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../AuthContext';

export default function BudgetForm({ onSuccess, editingData }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    category_id: 2,
    amount: '',
    start_date: '',
    end_date: ''
  });

  const [categories, setCategories] = useState([]); // ✅ 分類選項

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

  // ✅ 每 5 秒自動呼叫 onSuccess
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (typeof onSuccess === 'function') {
  //       onSuccess();
  //     }
  //   }, 5000);
  //   return () => clearInterval(intervalId);
  // }, [onSuccess]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // ❌ 不呼叫 onSuccess（因為會關 modal）
      // 改呼叫 window.dispatchEvent 自定義事件
      window.dispatchEvent(new Event('budget-refresh'));
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (editingData) {
      setForm({
        category_id: editingData.category_id,
        amount: editingData.amount,
        start_date: editingData.start_date?.slice(0, 10),
        end_date: editingData.end_date?.slice(0, 10),
      });
    }
  }, [editingData]);


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await api.post('/budgets', {
      //   ...form,
      //   user_id: user.user_id,
      //   amount: parseFloat(form.amount),
      //   category_id: form.category_id ? parseInt(form.category_id) : null
      // });
      // alert('預算已建立');
      if (editingData) {
        // 修改模式：PUT
        await api.put(`/budgets/${editingData.budget_id}`, {
          ...form,
          user_id: user.user_id,
          amount: parseFloat(form.amount),
          category_id: form.category_id ? parseInt(form.category_id) : null,
        });
        alert('預算已更新');
      } else {
        // 新增模式：POST
        await api.post('/budgets', {
          ...form,
          user_id: user.user_id,
          amount: parseFloat(form.amount),
          category_id: form.category_id ? parseInt(form.category_id) : null,
        });
        alert('預算已建立');
      }
      setForm({ category_id: '2', amount: '', start_date: '', end_date: '' });
      onSuccess();
    } catch (err) {
      alert(editingData ? '更新失敗' : '建立失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <div className="form-group">
        <label>分類</label>
        <select name="category_id" value={form.category_id} onChange={handleChange}>
          <option value="">選擇分類</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>金額</label>
        <input name="amount" type="number" placeholder="預算金額" value={form.amount} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>起始日</label>
        <input name="start_date" type="date" value={form.start_date} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>結束日</label>
        <input name="end_date" type="date" value={form.end_date} onChange={handleChange} />
      </div>

      <button type="submit" className="submit-btn">送出</button>
    </form>
  );
}
