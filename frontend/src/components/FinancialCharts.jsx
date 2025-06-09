import { getCategorySummary } from '../api/report'
import { getIncomeExpenseTotals } from '../api/report'
import { useAuth } from '../AuthContext'
import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell
} from 'recharts'

const FinancialCharts = () => {
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [data, setData] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { user } = useAuth()

  // 初次載入時預設為當月
  const toDateInputString = (dateObj) => {
    return dateObj.toLocaleDateString('sv-SE')  // "2025-06-01"
  }

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const start = toDateInputString(new Date(year, month, 1))
    const end = toDateInputString(new Date(year, month + 1, 0))

    setStartDate(start)
    setEndDate(end)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !startDate || !endDate) return
      try {
        const totals = await getIncomeExpenseTotals(user.user_id, startDate, endDate)
        setTotalIncome(totals.data.income)
        setTotalExpense(totals.data.expense)

        const res = await getCategorySummary(user.user_id, startDate, endDate)

        const formatted = res.data.map(item => ({
          type: item.category_name,
          amount: parseFloat(item.total),
          color: item.color_tag || '#8884d8'
        }))
        .sort((a, b) => b.amount - a.amount)

        setData(formatted)
      } catch (err) {
        console.error('讀取資料錯誤:', err)
      }
    }

    fetchData()
  }, [user, startDate, endDate])

  return (
    <div className="section">
      <h3 className="section-title">財務報表圖表</h3>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label>
          起始日期：
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <label>
          結束日期：
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>       
        {/* 圓餅圖區塊 + 中心餘額 */}
        <div style={{ position: 'relative', width: 500, height: 450 }}>
          {/* 中心餘額顯示 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            pointerEvents: 'none'  // 避免蓋住 PieChart 滑鼠事件
          }}>
          <div>餘額</div>
            <div>NT${(totalIncome - totalExpense).toLocaleString()}</div>
          </div>

          {/* 圓餅圖 */}
          <PieChart width={500} height={450} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={140}
              innerRadius={80}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              label={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* 圖例區塊 */}
        <div style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '300px' }}>
          <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
            總收入：NT${totalIncome.toLocaleString()}
          </div>
          <table style={{ borderCollapse: 'collapse', fontSize: '16px' }}>
            <thead>
              <tr>
                <th style={{ padding: '4px 12px', textAlign: 'left' }}>分類</th>
                <th style={{ padding: '4px 12px', textAlign: 'right' }}>金額</th>
                <th style={{ padding: '4px 12px', textAlign: 'right' }}>佔比</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => {
                const total = data.reduce((sum, d) => sum + d.amount, 0)
                return (
                  <tr key={index}>
                    <td style={{ padding: '4px 12px', display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: entry.color,
                          display: 'inline-block',
                          marginRight: '8px'
                        }}
                      ></span>
                      {entry.type}
                    </td>
                    <td style={{ padding: '4px 12px', textAlign: 'right' }}>
                      NT${entry.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '4px 12px', textAlign: 'right' }}>
                      {((entry.amount / total) * 100).toFixed(0)}%
                    </td>
                  </tr>
                )
              })}
              <tr style={{ fontWeight: 'bold', borderTop: '1px solid #ccc' }}>
                <td style={{ padding: '6px 12px' }}>合計</td>
                <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                  NT${data.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                </td>
                <td style={{ padding: '6px 12px', textAlign: 'right' }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FinancialCharts