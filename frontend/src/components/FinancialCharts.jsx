import { getCategorySummary } from '../api/report'
import { useContext } from 'react'
import { useAuth } from '../AuthContext'
import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line,
} from 'recharts'
import api from '../api/axios'

const COLORS = ['#0088FE', '#FF8042']

const FinancialCharts = () => {
  const [data, setData] = useState([])
  const [type, setType] = useState('pie')
  const [period, setPeriod] = useState('daily')

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await api.get(`/transactions?period=${period}`)
  //       setData(res.data)
  //     } catch (err) {
  //       console.error('讀取資料錯誤:', err)
  //     }
  //   }
  //   fetchData()
  // }, [period])

  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res
        if (type === 'pie') {
          const today = new Date()
          const end = today.toISOString().split('T')[0]
          const start = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0]

          res = await getCategorySummary(user.user_id, start, end)
          // 從報表 API 回傳的資料格式：
          // [{ category_name: '食品', total: '250.0', percentage: '100.00' }]
          const formatted = res.data.map(item => ({
            type: item.category_name,
            amount: parseFloat(item.total)
          }))
          setData(formatted)
        } else {
          // 暫時保留原本 bar/line 使用的交易資料 API
          res = await api.get(`/transactions?period=${period}`)
          setData(res.data)
        }
      } catch (err) {
        console.error('讀取資料錯誤:', err)
      }
    }
    if (user) fetchData()
  }, [type, period, user])

  return (
    <div className="section">
      <h3 className="section-title">財務報表圖表</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          圖表類型：
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="pie">圓餅圖</option>
            <option value="bar">柱狀圖</option>
            <option value="line">折線圖</option>
          </select>
        </label>
        <label style={{ marginLeft: '1rem' }}>
          時間範圍：
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="daily">日常</option>
            <option value="monthly">月度</option>
            <option value="yearly">年度</option>
          </select>
        </label>
      </div>

      {type === 'pie' && (
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="type"
            cx="50%" cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      )}

      {type === 'bar' && (
        <BarChart width={500} height={300} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      )}

      {type === 'line' && (
        <LineChart width={500} height={300} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      )}
    </div>
  )
}

export default FinancialCharts
