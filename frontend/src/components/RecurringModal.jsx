import RecurringForm from './RecurringForm'
import '../styles/AddRecurringModal.css'

const RecurringModal = ({ onClose, onRecurringAdded, editingData }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{editingData ? '編輯定期交易' : '新增定期交易'}</h3>
        <RecurringForm
          editingData={editingData}
          onSuccess={() => {
            onRecurringAdded()
            onClose()
          }}
        />

        {/* <button className="action-btn" onClick={onClose} style={{ marginTop: '1rem' }}>取消</button> */}
        <div className="form-row" style={{ justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button className="cancel-btn" onClick={onClose} style={{ marginTop: '1rem' }}>取消</button>
        </div>
      </div>
    </div>
  )
}

export default RecurringModal
