import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../AuthContext'

const RecordTable = () => {
  const [records, setRecords] = useState([])
  const { user } = useAuth()

  // 抓取交易紀錄的函式
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
      console.log("✅ 抓到的交易資料：", res.data)
      setRecords(res.data)
    } catch (err) {
      console.error("❌ 錯誤：", err)
    }
  }

  // 初始載入 + 定時輪詢
  useEffect(() => {
    fetchRecords()

    const intervalId = setInterval(() => {
      fetchRecords()
    }, 5000) // 每 5 秒輪詢一次，你也可以調成 10000 (10 秒)

    return () => clearInterval(intervalId) // 離開時清除計時器
  }, [user])

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
              <td>{record.category?.name || '未知'}</td>
              <td>{record.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecordTable
