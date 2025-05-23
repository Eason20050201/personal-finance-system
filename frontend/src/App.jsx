/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

const handleLogin = () => {
    setIsLoggedIn(true)
  }
*/
import { useState } from 'react'
import Login from './components/Login'
import MainApp from './components/MainApp'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  return (
    <div className="app">
      {showRegister ? (
      <Register onRegisterSuccess={() => setShowRegister(false)} />
    ) : !isLoggedIn ? (
      <>
        <Login onLogin={handleLogin} />
        <button onClick={() => setShowRegister(true)}>沒有帳號？註冊</button>
      </>
    ) : (
      <MainApp onLogout={handleLogout} />
    )}
    </div>
  )
}

export default App
