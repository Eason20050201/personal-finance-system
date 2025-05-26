import NavBar from './NavBar'
import BudgetCards from './BudgetCards'
import RecordTable from './RecordTable'
import SavingsGoals from './SavingsGoals'
import FinancialCharts from './FinancialCharts'
import AdviceCards from './AdviceCards'

// 👇 加入這兩個
import AccountForm from './AccountForm'
import AccountList from './AccountList'

//新增交易紀錄
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

//儲蓄目標
import SavingsGoalForm from './SavingsGoalForm';
import SavingsGoalList from './SavingsGoalList';

//報表
import ReportChart from './ReportChart';

//定期交易
import RecurringForm from './RecurringForm';
import RecurringList from './RecurringList';

//通知系統
import NotificationList from './NotificationList';




const MainApp = ({ onLogout }) => {
  return (
    <div className="main-container">
      <NavBar onLogout={onLogout} />
      
      <div className="quick-actions">
        <button className="action-btn">+ 記錄 提交更新并更新預留日明細表</button>
        <button className="action-btn">續寫</button>
        <button className="action-btn">+ 增加賬戶餘額</button>
        <button className="action-btn">切換賬戶</button>
      </div>

      {/* ✅ 帳戶專區：新增 + 顯示 */}
      <div className="section">
        <h3 className="section-title">帳戶管理</h3>
        <AccountForm />
        <AccountList />
      </div>


      {/* ✅ 交易紀錄 */}
      <div className="section">
        <h3 className="section-title">交易管理</h3>
        <TransactionForm />
        <TransactionList />
      </div>

      {/* ✅ 儲蓄目標 */}
      <div className="section">
        <h3 className="section-title">儲蓄目標</h3>
        <SavingsGoalForm />
        <SavingsGoalList />
      </div>

      {/* ✅ 報表 */}
      <div className="section">
        <h3 className="section-title">消費報表</h3>
        <ReportChart />
      </div>
    
      {/* ✅ 定期交易 */}
      <div className="section">
        <h3 className="section-title">定期交易</h3>
        <RecurringForm />
        <RecurringList />
      </div>

      {/* ✅ 通知系統 */}
      <div className="section">
        <NotificationList />
      </div>


    


      <RecordTable />
      <BudgetCards />
      <SavingsGoals />
      <FinancialCharts />
      <AdviceCards />
      
      <div className="section">
        <h3 className="section-title">網站內容</h3>
        <p>更多理財資訊與工具...</p>
      </div>
    </div>
  )
}

export default MainApp
