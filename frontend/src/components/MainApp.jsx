import { useRef } from 'react'
import NavBar from './NavBar'
import RecurringForm from './RecurringForm'
import BudgetCards from './BudgetCards'
import RecordTable from './RecordTable'
import SavingsGoals from './SavingsGoals'
import FinancialCharts from './FinancialCharts'
import AdviceCards from './AdviceCards'

const MainApp = ({onLogout}) => {
  const recurrRef = useRef(null)
  const recordRef = useRef(null)
  const budgetRef = useRef(null)
  const reportRef = useRef(null)
  const savingsRef = useRef(null)
  const adviceRef = useRef(null)

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

  return (
    <div className="main-container">
      <NavBar onLogout={onLogout} onNavigate={handleScrollTo} />

      <div ref={recurrRef}><RecurringForm onSubmit={(data) => console.log('定期交易提交:', data)} /></div>
      
      <div className="quick-actions">
        <button className="action-btn">+ 收支記錄</button>
        <button className="action-btn">修改賬戶餘額</button>
        <button className="action-btn">匯入帳本</button>
        <button className="action-btn">切換帳戶</button>
      </div>
      
      <div ref={recordRef}><RecordTable /></div>
      <div ref={budgetRef}><BudgetCards /></div>
      <div ref={savingsRef}><SavingsGoals /></div>
      <div ref={reportRef}><FinancialCharts /></div>
      <div ref={adviceRef}><AdviceCards /></div>
    </div>
  )
}

export default MainApp
