import { useState } from 'react'
import '../styles/AddRecordModal.css'
import api from '../api/axios'

const AddRecordModal = ({ onClose, onRecordAdded }) => {
  const [form, setForm] = useState({ date: '', amount: '', category: '', note: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/transactions', form)
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
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
          <input type="number" name="amount" placeholder="金額" value={form.amount} onChange={handleChange} required />
          <input type="text" name="category" placeholder="分類" value={form.category} onChange={handleChange} required />
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
