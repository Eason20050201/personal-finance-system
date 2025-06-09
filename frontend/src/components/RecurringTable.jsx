import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../AuthContext'

const RecurringTable = ({ onEdit }) => {
  const [records, setRecords] = useState([])
  const [categoryMap, setCategoryMap] = useState({})
  const [recordsWithNext, setRecordsWithNext] = useState([])
  const { user } = useAuth()

    const fetchRecurring = async () => {
      try {
        const res = await api.get(`/recurring/user/${user.user_id}`)
        setRecords(res.data)
      } catch (err) {
        console.error('取得定期交易失敗:', err)
      }
    }

  useEffect(() => {
    let intervalId;

    if (user) {
      fetchRecurring() // 首次進入就抓一次
      intervalId = setInterval(fetchRecurring, 5000) // 每 5 秒抓一次
    }

    return () => clearInterval(intervalId) // 清除 interval
  }, [user])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/categories/${user.user_id}`)
        const map = {}
        res.data.forEach((cat) => {
          map[cat.category_id] = cat.name
        })
        setCategoryMap(map)
      } catch (err) {
        console.error('⚠️ 載入分類失敗:', err)
      }
    }

    if (user) fetchCategories()
  }, [user])

  // 計算下一次發生日
  useEffect(() => {
    setRecordsWithNext(records)
  }, [records])

  const formatDate = (dateStr) => {
    if (!dateStr) return '無'
    const d = new Date(dateStr)
    if (isNaN(d)) return '格式錯誤'
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
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
            <th>分類</th>
            <th>頻率</th>
            <th>起始日</th>
            <th>結束日</th>
            <th>下次發生日</th>
            <th>備註</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {recordsWithNext.map((item, index) => (
            <tr key={index}>
              <td>{item.amount}</td>
              <td>{categoryMap[item.category_id] || '未知分類'}</td>
              <td>{item.frequency}</td>
              <td>{formatDate(item.start_date)}</td>
              <td>{formatDate(item.end_date)}</td>
              <td>{formatDate(item.next_occurrence)}</td>
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
