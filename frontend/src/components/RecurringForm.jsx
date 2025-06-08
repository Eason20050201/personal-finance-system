import { useState } from 'react'
import { createRecurring } from '../api/recurring'
import { useAuth } from '../AuthContext';

const RecurringForm = ({ onSuccess }) => {
  const { user } = useAuth()  // ✅ hook 正確呼叫位置

  console.log("✅ RecurringForm user:", user)

  const [form, setForm] = useState({
    account_id: 1,       // ✅ 暫時用測試值
    category_id: 2,
    amount: '',
    type: 'expense',
    frequency: 'monthly',
    start_date: '',
    end_date: '',
    next_occurrence: '',
    note: '',
  })

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
      if (err.response) {
        console.error('⚠️ 錯誤詳情：', JSON.stringify(err.response.data, null, 2))
      }
      }
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