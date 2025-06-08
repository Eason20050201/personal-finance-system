import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../AuthContext'

const RecordTable = ({ refreshTrigger }) => {
  const [records, setRecords] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user?.user_id) {
        console.warn("⚠️ 尚未登入或 user_id 不存在")
        return
      }

      try {
        const res = await api.get(`/transactions/${user.user_id}`)
        console.log("✅ 抓到的交易資料：", res.data)
        setRecords(res.data)
      } catch (err) {
        console.error('❌ 取得資料錯誤', err)
      }
    }

    fetchRecords()
  }, [refreshTrigger, user])

  return (
    <div className="section">
      <h3 className="section-title">收入與支出紀錄</h3>
      <table className="record-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>金額</th>
            <th>類別</th>
            <th>備註</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.transaction_date}</td>
              <td>{record.amount}</td>
              <td>{record.category?.name}</td>
              <td>{record.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecordTable
