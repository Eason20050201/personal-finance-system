import RecurringForm from './RecurringForm'
import '../styles/AddRecurringModal.css'

const RecurringModal = ({ onClose, onRecurringAdded }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>新增定期交易</h3>
        <RecurringForm
          onSuccess={() => {
            onRecurringAdded()
            onClose()
          }}
        />
        {/* <button className="action-btn" onClick={onClose} style={{ marginTop: '1rem' }}>取消</button> */}
        <div className="form-row" style={{ justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button className="cancel-btn" onClick={onClose} style={{ marginTop: '1rem' }}>取消</button>
        </div>
      </div>
    </div>
  )
}

export default RecurringModal
