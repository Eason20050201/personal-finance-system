import { useState } from 'react'
import api from '../api/axios'

const Register = ({ onRegisterSuccess }) => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await api.post('/register', { account, password })
      onRegisterSuccess()
    } catch {
      setError('註冊失敗')
    }
  }

  return (
    <div className="login-container">
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="login-btn" type="submit">註冊</button>
      </form>
    </div>
  )
}

export default Register
