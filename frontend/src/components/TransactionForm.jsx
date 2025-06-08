import { useState } from 'react';
import { createTransaction } from '../api/transaction';

export default function TransactionForm() {
  const [form, setForm] = useState({
    user_id: 1,
    amount: 0,
    type: 'expense',
    transaction_date: new Date().toISOString().split('T')[0],
    note: '',
    account_id: 1,
    category_id: 1,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: form.amount.toString(),
      end_date: form.end_date || null,
    }

    try {
      await createTransaction(payload);
      alert('新增交易成功');
    } catch (err) {
      alert('新增失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>新增交易</h3>
      <input name="amount" type="number" placeholder="金額" onChange={handleChange} />
      <select name="type" onChange={handleChange}>
        <option value="expense">支出</option>
        <option value="income">收入</option>
      </select>
      <input name="transaction_date" type="date" onChange={handleChange} />
      <input name="note" placeholder="備註" onChange={handleChange} />
      <input name="account_id" placeholder="帳戶 ID" onChange={handleChange} />
      <input name="category_id" placeholder="分類 ID" onChange={handleChange} />
      <button type="submit">送出</button>
    </form>
  );
}