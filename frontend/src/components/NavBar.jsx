import { useState } from 'react'

const NavBar = ({onLogout, onNavigate}) => {
  const [activeTab, setActiveTab] = useState('定期交易')

  const tabs = ['定期交易', '收支記錄', '預算管理', '儲蓄目標設定', '財務報表與圖表']

  return (
    <div className="nav-bar">
      {tabs.map(tab => (
        <div 
          key={tab}
          className={`nav-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => {
            setActiveTab(tab)
            onNavigate?.(tab)
          }}
        >
          {tab}
        </div>
      ))}
      <button className="logout-btn" onClick={onLogout}>登出</button>
    </div>
  )
}

export default NavBar
