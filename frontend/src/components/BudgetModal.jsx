import '../styles/main.css';
import BudgetForm from './BudgetForm';

export default function BudgetModal({ onClose, onSuccess, editingData }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>新增預算</h3>
        <BudgetForm onSuccess={onSuccess} editingData={editingData}/>
        <button onClick={onClose} className="close-btn">取消</button>
      </div>
    </div>
  );
}
