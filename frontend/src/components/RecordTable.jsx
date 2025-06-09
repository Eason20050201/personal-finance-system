import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../AuthContext'

const RecordTable = ({ refreshTrigger, onEdit, onDelete }) => {
  const [records, setRecords] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const { user } = useAuth()

  const fetchRecords = async () => {
    if (!user?.user_id) {
      console.warn("⚠️ 尚未登入或 user_id 不存在")
      return
    }

    try {
      // 處理定期交易（這會插入資料）
      await api.post(`/recurring/process/${user.user_id}`)
      console.log("✅ 已處理定期交易")

      // 抓最新交易資料
      const res = await api.get(`/transactions/all/${user.user_id}`)

      const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number)

      const filtered = res.data.filter((record) => {
        const txDate = new Date(record.transaction_date)
        return (
          txDate.getFullYear() === selectedYear &&
          txDate.getMonth() === selectedMonthNum - 1
        )
      })

      const sorted = filtered.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))

      console.log("✅ 選定月份的交易資料：", sorted)
      setRecords(sorted)
    } catch (err) {
      console.error("❌ 錯誤：", err)
    }
  }

  useEffect(() => {
    fetchRecords()

    const intervalId = setInterval(() => {
      fetchRecords()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [user, selectedMonth])

  return (
    <div className="section">
      <h3 className="section-title">收入與支出紀錄</h3>

      <div className="month-selector" style={{ marginBottom: '1rem' }}>
        <label>選擇月份：</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <table className="record-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>金額</th>
            <th>類別</th>
            <th>備註</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.transaction_date}</td>
              <td>{record.amount}</td>
              <td>{record.category?.name || '未知'}</td>
              <td>{record.note}</td>
              <td>
                <button
                  onClick={() => onEdit(record)}
                  style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    marginRight: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  編輯
                </button>
                <button
                  onClick={() => onDelete(record.id)} 
                  style={{
                    backgroundColor: '#e53935',
                    color: 'white',
                    border: 'none',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecordTable
