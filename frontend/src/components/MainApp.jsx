import { useRef, useState } from 'react'
import NavBar from './NavBar'
import RecurringForm from './RecurringForm'
import BudgetCards from './BudgetCards'
import RecordTable from './RecordTable'
import SavingsGoals from './SavingsGoals'
import FinancialCharts from './FinancialCharts'
import AdviceCards from './AdviceCards'
import Papa from 'papaparse'
import api from '../api/axios'
import AddRecordModal from './AddRecordModal'

const MainApp = ({onLogout}) => {
  const recurrRef = useRef(null)
  const recordRef = useRef(null)
  const budgetRef = useRef(null)
  const reportRef = useRef(null)
  const savingsRef = useRef(null)
  const adviceRef = useRef(null)

  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRecordAdded = () => setRefreshKey(prev => prev + 1)

  const handleScrollTo = (section) => {
    const sectionMap = {
      '定期交易': recurrRef,
      '收支記錄': recordRef,
      '預算管理': budgetRef,
      '財務報表與圖表': reportRef,
      '儲蓄目標設定': savingsRef,
      '個人理財建議': adviceRef,
    }
    const targetRef = sectionMap[section]
    if (targetRef && targetRef.current) {
      const offset = 80 // navbar 高度
      const top = targetRef.current.offsetTop - offset
      targetRef.current.scrollIntoView({ top, behavior: 'smooth' })
    }
  }

  const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const transactions = results.data.map(row => ({
            date: row['日期'],
            amount: parseFloat(row['金額']),
            note: row['備註'],
            category: row['分類'] || '', // 根據你的 schema 調整
            user_id: 1 // 如果後端需要 user_id，可根據實際登入使用者傳遞
          }))
          await api.post('/transactions/bulk', { transactions })
          alert('匯入成功')
        } catch (error) {
          console.error('匯入失敗:', error)
          alert('匯入失敗')
        }
      }
    })
  }

  return (
    <div className="main-container">
      <NavBar onLogout={onLogout} onNavigate={handleScrollTo} />

      <div ref={recurrRef}><RecurringForm onSubmit={(data) => console.log('定期交易提交:', data)} /></div>
      
      <div className="quick-actions">
        <button className="action-btn" onClick={() => setShowModal(true)}>+ 收支記錄</button>
        <button className="action-btn">修改賬戶餘額</button>
        <label className="action-btn" style={{ cursor: 'pointer' }}>
          匯入帳本
          <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
        </label>
        <button className="action-btn">切換帳戶</button>
      </div>

      {showModal && (
        <AddRecordModal
          onClose={() => setShowModal(false)}
          onRecordAdded={handleRecordAdded}
        />
      )}
      
      <div ref={recordRef}><RecordTable key={refreshKey} /></div>
      <div ref={budgetRef}><BudgetCards /></div>
      <div ref={savingsRef}><SavingsGoals /></div>
      <div ref={reportRef}><FinancialCharts /></div>
      <div ref={adviceRef}><AdviceCards /></div>
    </div>
  )
}

export default MainApp
