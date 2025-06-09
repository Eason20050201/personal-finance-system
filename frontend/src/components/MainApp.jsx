import { useRef, useState } from 'react'
import { useAuth } from '../AuthContext'
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
import RecurringTable from './RecurringTable'
import RecurringModal from './RecurringModal'



const MainApp = ({onLogout}) => {
  const recurrRef = useRef(null)
  const recordRef = useRef(null)
  const budgetRef = useRef(null)
  const reportRef = useRef(null)
  const savingsRef = useRef(null)
  const adviceRef = useRef(null)
  const { user } = useAuth()

  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [recurringRefreshKey, setRecurringRefreshKey] = useState(0)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [editingRecurring, setEditingRecurring] = useState(null)
  const [editingRecord, setEditingRecord] = useState(null)

  const handleEditRecord = (record) => {
    setEditingRecord(record)
    setShowModal(true)
  }

  const handleDeleteRecord = async (transactionId) => {
    if (!window.confirm('確定要刪除這筆紀錄嗎？')) return;

    try {
      await api.delete(`/transactions/${transactionId}`)
      alert('刪除成功')
      setRefreshKey(prev => prev + 1) // 重新載入資料
    } catch (err) {
      console.error('刪除失敗:', err)
      alert('刪除失敗，請稍後再試')
    }
  }


  const handleEdit = (item) => {
    setEditingRecurring(item);
    setShowRecurringModal(true);
  };

  const handleRecordAdded = () => setRefreshKey(prev => prev + 1)

  const handleRecurringAdded = () => {
    setRecurringRefreshKey(prev => prev + 1)
  }

  const handleScrollTo = (section) => {
    const sectionMap = {
      '定期交易': recurrRef,
      '收支記錄': recordRef,
      '預算管理': budgetRef,
      '儲蓄目標設定': savingsRef,
      '財務報表與圖表': reportRef,
      '個人理財建議': adviceRef,
    }
    const targetRef = sectionMap[section]
    if (targetRef && targetRef.current) {
      const offset = 80 // navbar 高度
      const top = targetRef.current.offsetTop - offset
      targetRef.current.scrollIntoView({ top, behavior: 'smooth' })
    }
  }

  
  const handleCSVUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) {
    alert('請選擇檔案')
    return
  }

  const userId = user?.user_id
  console.log('userId:', userId)
  console.log('file:', file)

  const formData = new FormData()
  formData.append('file', file) // ✅ 確保是真正的 File 物件
  formData.append('user_id', String(userId))

  try {
    const res = await api.post('/transactions/bulk-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('✅ 匯入成功', res.data)
    alert('匯入成功！')
  } catch (err) {
    console.error('❌ 匯入失敗:', err)
    console.log('錯誤細節:', err.response?.data)
    alert('匯入失敗：' + (err.response?.data?.detail?.[0]?.msg || err.message))
  }
}
  return (
    <div className="main-container">
      <NavBar onLogout={onLogout} onNavigate={handleScrollTo} />

      {/* <div ref={recurrRef}>
        <RecurringForm onSuccess={handleRecurringAdded} onSubmit={(data) => console.log('定期交易提交:', data)} />
        <RecurringTable key={recurringRefreshKey}/>
      </div> */}
      <div ref={recurrRef}>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => setShowRecurringModal(true)}>+ 定期交易</button>
        </div>

        <RecurringTable key={recurringRefreshKey} onEdit={handleEdit}/>

        {showRecurringModal && (
          <RecurringModal
            onClose={() => {
              setShowRecurringModal(false)
              setEditingRecurring(null)
            }}
            onRecurringAdded={handleRecurringAdded}
            editingData={editingRecurring} 
          />
        )}
      </div>

      
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
          onClose={() => {
            setShowModal(false)
            setEditingRecord(null)
          }}
          onRecordAdded={handleRecordAdded}
          editingData={editingRecord}
        />
      )}

      <div ref={recordRef}><RecordTable key={refreshKey} refreshTrigger={refreshKey} onEdit={handleEditRecord} onDelete={handleDeleteRecord}/></div>
      <div ref={budgetRef}><BudgetCards /></div>
      <div ref={savingsRef}><SavingsGoals /></div>
      <div ref={reportRef}><FinancialCharts /></div>
      <div ref={adviceRef}><AdviceCards /></div>
    </div>
  )
}

{/* // 👇 加入這兩個
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
import NotificationList from './NotificationList'; */}




 {/* const MainApp = ({ onLogout }) => {
  return (
    <div className="main-container">
      <NavBar onLogout={onLogout} />
      
      <div className="quick-actions">
        <button className="action-btn">+ 記錄 提交更新并更新預留日明細表</button>
        <button className="action-btn">續寫</button>
        <button className="action-btn">+ 增加賬戶餘額</button>
        <button className="action-btn">切換賬戶</button>
      </div> */}

      {/* {//✅ 帳戶專區：新增 + 顯示} 
      <div className="section">
        <h3 className="section-title">帳戶管理</h3>
        <AccountForm />
        <AccountList />
      </div> */}


      {/* {// ✅ 交易紀錄 }
      <div className="section">
        <h3 className="section-title">交易管理</h3>
        <TransactionForm />
        <TransactionList />
      </div> */}

      {/* {// ✅ 儲蓄目標 }
      <div className="section">
        <h3 className="section-title">儲蓄目標</h3>
        <SavingsGoalForm />
        <SavingsGoalList />
      </div> */}

      {/* {// ✅ 報表 }
      <div className="section">
        <h3 className="section-title">消費報表</h3>
        <ReportChart />
      </div> */}
    
      {/* {// ✅ 定期交易 }
      <div className="section">
        <h3 className="section-title">定期交易</h3>
        <RecurringForm />
        <RecurringList />
      </div> */}

      {/* {// ✅ 通知系統 }
      <div className="section">
        <NotificationList />
      </div> */}


    


      {/* <RecordTable />
      <BudgetCards />
      <SavingsGoals />
      <FinancialCharts />
      <AdviceCards /> */}
      
      {/* <div className="section">
        <h3 className="section-title">網站內容</h3>
        <p>更多理財資訊與工具...</p>
      </div>
    </div>
  )
} */}

export default MainApp 
