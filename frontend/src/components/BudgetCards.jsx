import { useEffect, useState } from 'react'
import api from '../api/axios'

const BudgetCards = () => {
  /*
  const budgetData = [
    { title: '我的', content: '預算: $10,000' },
    { title: '總支經費', content: '$8,500' },
    { title: '我的', content: '日常' },
    { title: '總賬目帳號', content: '$25,000' }
  ]
  */
  const [budgetData, setBudgets] = useState([])

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await api.get('/budgets')  // 請根據實際 API 調整
        setBudgets(res.data)
      } catch (err) {
        console.error('取得預算資料失敗:', err)
      }
    }
    fetchBudgets()
  }, [])

  return (
    <div className="section">
      <h3 className="section-title">預算管理</h3>
      <div className="budget-cards">
        {budgetData.map((item, index) => (
          <div key={index} className="budget-card">
            <h4>{item.title}</h4>
            <p>{item.amount ? `預算: $${item.amount}` : '無資料'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BudgetCards
