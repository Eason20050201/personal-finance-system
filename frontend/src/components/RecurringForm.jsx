import { useState, useEffect } from 'react'
import { createRecurring } from '../api/recurring'
import { useAuth } from '../AuthContext'
import api from '../api/axios'

const RecurringForm = ({ onSuccess }) => {
  const { user } = useAuth()

  const [form, setForm] = useState({
    account_id: '',  // ⛔ 先空的，等後端回傳再補上
    category_id: 2,
    amount: '',
    type: 'expense',
    frequency: 'monthly',
    start_date: '',
    end_date: '',
    next_occurrence: '',
    note: '',
  })
  const [categories, setCategories] = useState([])
    useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/categories/${user.user_id}`)
        setCategories(res.data)
      } catch (err) {
        console.error("⚠️ 載入分類失敗", err)
        alert("無法載入分類資料")
      }
    }

    fetchCategories()
  }, [user.user_id])

  useEffect(() => {
    if (!form.start_date || !form.frequency) return

    const start = new Date(form.start_date)
    let next = new Date(start)

    switch (form.frequency) {
      case 'daily':
        next.setDate(start.getDate() + 1)
        break
      case 'weekly':
        next.setDate(start.getDate() + 7)
        break
      case 'monthly':
        next.setMonth(start.getMonth() + 1)
        break
      default:
        break
    }

    const formatted = next.toISOString().split('T')[0]  // YYYY-MM-DD
    setForm(prev => ({ ...prev, next_occurrence: formatted }))
  }, [form.start_date, form.frequency])

  // ✅ 這裡自動載入 account_id
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await api.get(`/accounts/by_user_id?user_id=${user.user_id}`)
        const accountId = res.data.account_id
        setForm(prev => ({ ...prev, account_id: accountId }))
      } catch (err) {
        console.error("⚠️ 載入帳戶失敗", err)
        alert("無法載入帳戶資料")
      }
    }

    fetchAccount()
  }, [user.user_id])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      amount: form.amount.toString(),
      end_date: form.end_date || null,
      user_id: user.user_id,
    }

    try {
      await createRecurring(payload)
      alert('新增成功')
      if (onSuccess) onSuccess()
    } catch (err) {
      alert('新增失敗')
      if (err.response) {
        console.error('伺服器回應：', err.response.data)
        console.error('❌ 新增定期交易錯誤:', err)
      }
    }
  }

  return (
    <div className="section">
      <h3 className="section-title">新增定期交易</h3>
      <form onSubmit={handleSubmit} className="login-form" style={{ maxWidth: '500px' }}>
        <div className="form-row">
          <div className="form-group">
            <label>金額</label>
            <input name="amount" type="number" value={form.amount} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>分類</label>
            <select name="category_id" value={form.category_id} onChange={handleChange}>
              <option value="">請選擇分類</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>頻率</label>
            <select name="frequency" value={form.frequency} onChange={handleChange}>
              <option value="daily">每日</option>
              <option value="weekly">每週</option>
              <option value="monthly">每月</option>
            </select>
          </div>

          <div className="form-group">
            <label>起始日</label>
            <input name="start_date" type="date" value={form.start_date} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>結束日（可空）</label>
            <input name="end_date" type="date" value={form.end_date} onChange={handleChange} />
          </div>

          {/* <div className="form-group">
            <label>下次執行日</label>
            <input name="next_occurrence" type="date" value={form.next_occurrence} onChange={handleChange} />
          </div> */}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>備註</label>
            <input name="note" value={form.note} onChange={handleChange} />
          </div>
        </div>
        
        <div className="form-row" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="submit" className="login-btn">新增</button>
        </div>
        
      </form>
    </div>
  )
}

export default RecurringForm