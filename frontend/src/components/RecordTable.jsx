const RecordTable = () => {
  const records = [
    { date: '2023-05-01', amount: '+5,000', note: '薪水' },
    { date: '2023-05-02', amount: '-1,200', note: '餐費' }
  ]

  return (
    <div className="section">
      <h3 className="section-title">收入與支出紀錄</h3>
      <table className="record-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>金額</th>
            <th>備註</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.amount}</td>
              <td>{record.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecordTable
