import { useState } from 'react';

export default function TransactionFilter({ onFilter }) {
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    category_id: '',
    min_amount: '',
    max_amount: ''
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(form); // 呼叫父元件的篩選函式
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <label>起始日：
        <input type="date" name="start_date" onChange={handleChange} />
      </label>
      <label>結束日：
        <input type="date" name="end_date" onChange={handleChange} />
      </label>
      <label>分類 ID：
        <input type="number" name="category_id" onChange={handleChange} />
      </label>
      <label>最小金額：
        <input type="number" name="min_amount" onChange={handleChange} />
      </label>
      <label>最大金額：
        <input type="number" name="max_amount" onChange={handleChange} />
      </label>
      <button type="submit">搜尋</button>
    </form>
  );
}
