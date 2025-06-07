import { useState } from 'react'
import api from '../api/axios'

// const Login = ({ onLogin, onShowRegister}) => {
//   const [account, setAccount] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
import { useAuth } from '../AuthContext';
import { login } from '../api/auth'   // ✅ 加這行


const Login = ({ onLogin, onShowRegister }) => {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { loginUser } = useAuth(); // ✅ 加這行

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      /*
      const res = await api.post('/login', { account, password })
      if (res.status === 200) {
        onLogin()
        */
      const res = await login(account, password)   // ✅ 改這裡！
      if (res.status === 200) {
        console.log("[DEBUG] 登入 API 回傳：", res.data)

        loginUser(res.data.user);  // ✅ 這樣 user.user_id 就正確存在 context 裡
        onLogin();           // ✅ 切換進入 MainApp
      }
    } catch (err) {
      console.error('登入錯誤:', err)  // 使用 err
      setError('登入失敗，請檢查帳號或密碼')
    }
  }

  return (
    <div className="login-container">
      <div className="logo">個人理財管理系統</div>
      <h2 className="login-title">Login</h2>
      <div className="login-form">
        <div className="form-group">
          <label htmlFor="account">account</label>
          <input type="text" id="account" value={account} onChange={e => setAccount(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">password</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="login-btn" onClick={handleSubmit}>login</button>
        <button type="button" className="login-btn register-btn" onClick={onShowRegister}>Register</button>
      </div>
    </div>
  )
}

export default Login
