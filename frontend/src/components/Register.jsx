import { useState } from 'react';
import { register } from '../api/auth';

export default function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    currency_preference: 'TWD',
  });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.currency_preference);
      alert('註冊成功，請登入');
      onRegisterSuccess(); // ✅ 切回登入畫面
    } catch (err) {
      setError('email已存在，註冊失敗');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">註冊帳號</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="姓名" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="密碼" onChange={handleChange} required />
        <select name="currency_preference" onChange={handleChange}>
          <option value="TWD">TWD（台幣）</option>
          <option value="USD">USD（美元）</option>
          <option value="JPY">JPY（日圓）</option>
        </select>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">註冊</button>
      </form>
    </div>
  );
}
