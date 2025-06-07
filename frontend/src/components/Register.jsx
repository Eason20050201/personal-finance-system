import { useState } from 'react'
import api from '../api/axios'

const Register = ({ onRegisterSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    currency_preference: 'TWD',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !confirmPassword) {
      setError('請填寫所有欄位')
      return
    }
    if (form.password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }
    try {
      await api.post('/register', form)
      alert('註冊成功，請登入')
      onRegisterSuccess()
    } catch (err) {
      console.error('註冊錯誤:', err)
      setError('email已存在，註冊失敗')
    }
  }

  return (
    <div className="login-container">
      <div className="logo">個人理財管理系統</div>
      <h2 className="login-title">註冊帳號</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>姓名</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>密碼</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>再次輸入密碼</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>偏好貨幣</label>
          <select name="currency_preference" value={form.currency_preference} onChange={handleChange}>
            <option value="TWD">TWD（台幣）</option>
            <option value="USD">USD（美元）</option>
            <option value="JPY">JPY（日圓）</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="login-btn" type="submit">註冊</button>
        <button
          type="button"
          className="register-btn"
          onClick={onRegisterSuccess}
        >
          返回登入
        </button>
      </form>
    </div>
  )
}

export default Register

