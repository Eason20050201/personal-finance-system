import { useEffect, useState } from 'react';
import { getFilteredTransactions } from '../api/transaction';
import TransactionFilter from './TransactionFilter';
import { useAuth } from '../AuthContext';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  const load = (filters = {}) => {
    if (!user) return;
    getFilteredTransactions(user.user_id, filters)
      .then(res => setTransactions(res.data))
      .catch(err => alert('讀取失敗'));
  };

  useEffect(() => {
    load(); // 預設載入全部資料
  }, [user]);

  return (
    <div>
      <h3>交易紀錄</h3>
      <TransactionFilter onFilter={load} />
      <ul>
        {transactions.map(tx => (
          <li key={tx.transaction_id}>
            {new Date(tx.transaction_date).toLocaleDateString()} - {tx.type} - ${tx.amount} ({tx.note})
          </li>
        ))}
      </ul>
    </div>
  );
}

