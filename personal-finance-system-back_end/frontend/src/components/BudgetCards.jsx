const BudgetCards = () => {
  const budgetData = [
    { title: '我的', content: '預算: $10,000' },
    { title: '總支經費', content: '$8,500' },
    { title: '我的', content: '日常' },
    { title: '總賬目帳號', content: '$25,000' }
  ]

  return (
    <div className="section">
      <h3 className="section-title">預算管理</h3>
      <div className="budget-cards">
        {budgetData.map((item, index) => (
          <div key={index} className="budget-card">
            <h4>{item.title}</h4>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BudgetCards
