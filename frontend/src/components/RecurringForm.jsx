import { useState } from 'react'
import { createRecurring } from '../api/recurring'

const RecurringForm = ({ user, onSuccess }) => {
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    frequency: 'monthly',
    start_date: '',
    end_date: '',
    next_occurrence: '',
    note: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        user_id: user.user_id,
        account_id: user.account_id,
        category_id: user.category_id
      }
      await createRecurring(payload)
      alert('新增成功')
      if (onSuccess) onSuccess()
    } catch (err) {
      alert('新增失敗')
      console.error(err)
    }
  }

  return (
    <div className="section">
      <h3 className="section-title">新增定期交易</h3>
      <form onSubmit={handleSubmit} className="login-form" style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>金額</label>
          <input name="amount" type="number" value={form.amount} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>類型</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
        </div>

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

        <div className="form-group">
          <label>結束日（可空）</label>
          <input name="end_date" type="date" value={form.end_date} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>下次執行日</label>
          <input name="next_occurrence" type="date" value={form.next_occurrence} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>備註</label>
          <input name="note" value={form.note} onChange={handleChange} />
        </div>

        <button type="submit" className="login-btn">新增</button>
      </form>
    </div>
  )
}

export default RecurringForm
