import { useState } from 'react'

const NavBar = ({onLogout}) => {
  const [activeTab, setActiveTab] = useState('記錄')

  const tabs = ['記錄', '時間/分析', '預測', '儲蓄理財詳情']

  return (
    <div className="nav-bar">
      {tabs.map(tab => (
        <div 
          key={tab}
          className={`nav-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </div>
      ))}
      <button onClick={onLogout} style={{ marginLeft: 'auto' }}>登出</button>
    </div>
  )
}

export default NavBar
