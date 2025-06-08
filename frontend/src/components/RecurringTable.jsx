import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../AuthContext'

const RecurringTable = ({ onEdit }) => {
  const [records, setRecords] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchRecurring = async () => {
      try {
        const res = await api.get(`/recurring/user/${user.user_id}`) // 根據你的後端路由調整
        setRecords(res.data)
      } catch (err) {
        console.error('取得定期交易失敗:', err)
      }
    }

    if (user) fetchRecurring()
  }, [user])

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
                <button onClick={() => onEdit(item)}>編輯</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecurringTable
