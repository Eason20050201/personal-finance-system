import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../AuthContext'

const RecurringTable = ({ onEdit }) => {
  const [records, setRecords] = useState([])
  const { user } = useAuth()

  const fetchRecurring = async () => {
      try {
        const res = await api.get(`/recurring/user/${user.user_id}`) // 根據你的後端路由調整
        setRecords(res.data)
      } catch (err) {
        console.error('取得定期交易失敗:', err)
      }
    }


  useEffect(() => {
    if (user) fetchRecurring()
  }, [user])

  const handleDelete = async (recurring_id) => {
    if (!window.confirm('確定要刪除這筆定期交易嗎？')) return

    try {
      await api.delete(`/recurring/${recurring_id}`)
      alert('刪除成功')
      fetchRecurring()  // 重新載入資料
    } catch (err) {
      console.error('❌ 刪除失敗:', err)
      alert('刪除失敗')
    }
  }

  return (
    <div className="section">
      <h3 className="section-title">定期交易紀錄</h3>
      <table className="record-table">
        <thead>
          <tr>
            <th>金額</th>
            <th>類型</th>
            <th>頻率</th>
            <th>起始日</th>
            <th>結束日</th>
            <th>下次發生日</th>
            <th>備註</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item, index) => (
            <tr key={index}>
              <td>{item.amount}</td>
              <td>{item.type}</td>
              <td>{item.frequency}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date || '無'}</td>
              <td>{item.next_occurrence}</td>
              <td>{item.note}</td>
              <td>
                <button
                  onClick={() => onEdit(item)}
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
                  onClick={() => handleDelete(item.recurring_id)}
                  style={{
                    backgroundColor: '#d32f2f',
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

export default RecurringTable
