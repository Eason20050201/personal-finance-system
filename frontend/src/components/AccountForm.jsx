import { useState } from 'react';
import { createAccount } from '../api/account';

export default function AccountForm() {
  const [form, setForm] = useState({
    user_id: 1,
    account_name: '',
    account_type: 'cash',
    currency: 'TWD',
    balance: 0,
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createAccount(form);
      alert('新增成功');
    } catch {
      alert('新增失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="account_name" placeholder="帳戶名稱" onChange={handleChange} />
      <input name="balance" type="number" placeholder="初始金額" onChange={handleChange} />
      <select name="account_type" onChange={handleChange}>
        <option value="cash">現金</option>
        <option value="bank">銀行</option>
      </select>
      <button type="submit">新增帳戶</button>
    </form>
  );
}
