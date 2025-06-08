import { useState, useEffect } from 'react'
import '../styles/AddRecordModal.css'
import api from '../api/axios'
import { useAuth } from '../AuthContext';
import { createTransaction } from '../api/transaction';
import { getCategories } from '../api/category';

const AddRecordModal = ({ onClose, onRecordAdded }) => {
  const { user } = useAuth()  // ✅ hook 正確呼叫位置
  const [form, setForm] = useState({ 
    transaction_date: '', 
    amount: '', 
    type: '',
    note: '',
    account_id: '',       // ✅ 暫時用測試值
    category_id: '', 
  })

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
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      user_id: user.user_id,
      amount: parseFloat(form.amount),
      //account_id: parseInt(form.account_id),
      //category_id: parseInt(form.category_id),
    }

    try {
      await api.post('/transactions/', payload)
      //await createTransaction(payload)
      alert('新增成功')
      onRecordAdded()
      onClose()
    } catch (err) {
      console.error('新增失敗:', err)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>新增收支紀錄</h3>
        <form onSubmit={handleSubmit}>
          <input type="date" name="transaction_date" value={form.transaction_date} onChange={handleChange} required />
          <input type="number" name="amount" placeholder="金額" value={form.amount} onChange={handleChange} required />
          {/* <input type="text" name="category" placeholder="分類" value={form.category} onChange={handleChange} required /> */}
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">請選擇類型</option>
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
          {/* <select name="category" value={form.category} onChange={handleChange} required> */}
          <select name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">請選擇分類</option>
            <option value="1">食品</option>
            <option value="2">薪水</option>
            <option value="3">娛樂</option>
            <option value="4">交通</option>
          </select>
          <input type="text" name="note" placeholder="備註" value={form.note} onChange={handleChange} />
          <div style={{ marginTop: '1rem' }}>
            <button type="submit">送出</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>取消</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRecordModal
