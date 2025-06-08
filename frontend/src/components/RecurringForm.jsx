import { useState, useEffect } from 'react'
import { createRecurring } from '../api/recurring'
import { useAuth } from '../AuthContext'
import api from '../api/axios'

const RecurringForm = ({ onSuccess, editingData }) => {
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

  // ✅ 這裡自動載入 account_id
  useEffect(() => {
    // const fetchAccount = async () => {
    const initForm = async () => {
      if (editingData) {
        setForm({
          ...editingData,
          amount: String(editingData.amount),
          end_date: editingData.end_date || '',
        })
      } else {
      try {
        const res = await api.get(`/accounts/by_user_id?user_id=${user.user_id}`)
        const accountId = res.data.account_id
        setForm(prev => ({ ...prev, account_id: accountId }))
      } catch (err) {
        console.error("⚠️ 載入帳戶失敗", err)
        alert("無法載入帳戶資料")
      }
    }
  }
  initForm()
    // fetchAccount()
  }, [editingData, user.user_id])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      account_id: form.account_id || '',         // 預防缺失
      category_id: form.category_id || 2,
      amount: form.amount.toString(),
      type: form.type,
      frequency: form.frequency,
      start_date: form.start_date,
      end_date: form.end_date || null,
      next_occurrence: form.next_occurrence || null,
      note: form.note,
      user_id: user.user_id
    }

    try {
      if (editingData) {
        await api.put(`/recurring/${editingData.id}`, payload)
        alert('更新成功')
      } else {
        await createRecurring(payload)
        alert('新增成功')
      }
      if (onSuccess) onSuccess()
      // await createRecurring(payload)
      // alert('新增成功')
      // if (onSuccess) onSuccess()
    } catch (err) {
      alert('新增失敗')
      if (err.response) {
        alert(editingData ? '更新失敗' : '新增失敗')
        console.error('❌ 定期交易提交錯誤:', err.response?.data || err)
        console.error('❌ 定期交易提交錯誤:', err.response?.data)
        alert(JSON.stringify(err.response?.data, null, 2))  // 彈出後端錯誤
        // console.error('伺服器回應：', err.response.data)
        // console.error('❌ 新增定期交易錯誤:', err)
      }
    }
  }

  return (
    <div className="section">
      <h3 className="section-title">{editingData ? '編輯定期交易' : '新增定期交易'}</h3>
      <form onSubmit={handleSubmit} className="login-form" style={{ maxWidth: '500px' }}>
        <div className="form-row">
          <div className="form-group">
            <label>金額</label>
            <input name="amount" type="number" value={form.amount} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>起始日</label>
            <input name="start_date" type="date" value={form.start_date} onChange={handleChange} />
          </div>

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
          <button type="submit" className="login-btn">{editingData ? '更新' : '新增'}</button>
        </div>
        
      </form>
    </div>
  )
}

export default RecurringForm