import { useState } from 'react'
import api from '../api/axios'

const Register = ({ onRegisterSuccess }) => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!account || !password || !confirmPassword) {
      setError('請填寫所有欄位')
      return
    }
    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }
    try {
      await api.post('/register', { account, password })
      onRegisterSuccess()
    } catch {
      setError('註冊失敗，請稍後再試')
    }
  }

  return (
    <div className="login-container">
      <div className="logo">個人理財管理系統</div>
      <h2 className="login-title">註冊帳號</h2>
      <form className="login-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label>帳號</label>
          <input type="text" value={account} onChange={e => setAccount(e.target.value)} />
        </div>
        <div className="form-group">
          <label>密碼</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>再次輸入密碼</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="login-btn" type="submit">註冊</button>
        <button
          type="button"
          className="login-btn register-btn"
          style={{ marginTop: '0.5rem', backgroundColor: '#aaa' }}
          onClick={onRegisterSuccess}
        >
          返回登入
        </button>
      </form>
    </div>
  )
}

export default Register
