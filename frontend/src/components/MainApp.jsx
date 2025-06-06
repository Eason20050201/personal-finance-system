import NavBar from './NavBar'
import BudgetCards from './BudgetCards'
import RecordTable from './RecordTable'
import SavingsGoals from './SavingsGoals'
import FinancialCharts from './FinancialCharts'
import AdviceCards from './AdviceCards'

const MainApp = ({onLogout}) => {
  return (
    <div className="main-container">
      <NavBar onLogout={onLogout} />
      
      <div className="quick-actions">
        <button className="action-btn">+ 記錄 提交更新并更新預留日明細表</button>
        <button className="action-btn">續寫</button>
        <button className="action-btn">+ 增加賬戶餘額</button>
        <button className="action-btn">切換賬戶</button>
      </div>
      
      <RecordTable />
      <BudgetCards />
      <SavingsGoals />
      <FinancialCharts />
      <AdviceCards />
    </div>
  )
}

export default MainApp
