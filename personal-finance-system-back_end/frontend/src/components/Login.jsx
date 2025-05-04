const Login = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="login-container">
      <div className="logo">logo</div>
      <h2 className="login-title">登入介面</h2>
      <div className="login-form">
        <div className="form-group">
          <label htmlFor="account">account</label>
          <input type="text" id="account" placeholder="輸入帳號" />
        </div>
        <div className="form-group">
          <label htmlFor="password">password</label>
          <input type="password" id="password" placeholder="輸入密碼" />
        </div>
        <button className="login-btn" onClick={handleSubmit}>login</button>
        <button className="google-login">
          <img src="/assets/google-logo.svg" alt="Google logo" />
          use google to login
        </button>
      </div>
    </div>
  )
}

export default Login
