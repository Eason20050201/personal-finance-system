import { useState, useEffect } from 'react'
import '../styles/AddRecordModal.css'
import api from '../api/axios'
import { useAuth } from '../AuthContext';
import { createTransaction } from '../api/transaction';
import { getCategories } from '../api/category';

const AddRecordModal = ({ onClose, onRecordAdded, editingData }) => {
  const { user } = useAuth()
  
  const [form, setForm] = useState({ 
    transaction_date: '', 
    amount: '', 
    type: '',
    note: '',
    account_id: '',  // ⛔ 起初為空，待 useEffect 自動補上
    category_id: ''
  })

  const [categories, setCategories] = useState([])

  // ✅ 自動載入 account_id
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

    if (user?.user_id) {
      fetchAccount()
    }
  }, [user])

  // ✅ 自動載入分類
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/categories/${user.user_id}`)
        setCategories(res.data)
      } catch (err) {
        console.error('❌ 載入分類失敗:', err)
      }
    }

    if (user?.user_id) {
      fetchCategories()
    }
  }, [user])

  // 若是編輯模式，預設填入原有資料
  useEffect(() => {
    if (editingData) {
      console.log("🛠️ 編輯模式資料：", editingData)
      setForm({
        ...editingData,
        transaction_id: editingData.transaction_id || editingData.id,
        amount: editingData.amount.toString(), // 確保是字串
        transaction_date: editingData.transaction_date?.slice(0, 10), // 去掉時間部分
        category_id: editingData.category?.category_id || editingData.category_id,
        type: editingData.category?.type || editingData.type
      })
    }
  }, [editingData])

  const handleChange = (e) => {
  const { name, value } = e.target

  // 如果使用者改變了 type，就清除已選的 category_id
  if (name === 'type') {
      setForm(prev => ({
        ...prev,
        type: value,
        category_id: ''
      }))
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
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

    console.log("📦 傳送的資料:", payload)  // ← 這行加上！

    try {
      if (editingData?.transaction_id || editingData?.id) {
        const id = editingData.transaction_id || editingData.id
        await api.put(`/transactions/${id}`, payload)
        // await api.put(`/transactions/${editingData.id}`, payload)
        alert('更新成功')
      } else {
        await api.post('/transactions/', payload)
        alert('新增成功')
      }
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
          
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">請選擇類型</option>
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>

          <select name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">請選擇分類</option>
            {categories
              .filter(cat => cat.type === form.type) // 🧠 根據當前選擇的 type 過濾
              .map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
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