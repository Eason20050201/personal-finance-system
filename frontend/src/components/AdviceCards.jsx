const AdviceCards = () => {
  const adviceData = [
    { title: '預算優化建議', content: '根據您的支出模式，建議減少娛樂開支。' },
    { title: '支出控制提示', content: '本月餐費已超過預算20%。' },
    { title: '個人化理財建議', content: '考慮建立緊急預備金。' },
    { title: '儲蓄或投資建議', content: '建議每月儲蓄收入的20%。' }
  ]

  return (
    <div className="section">
      <h3 className="section-title">理財建議</h3>
      <div className="advice-cards">
        {adviceData.map((advice, index) => (
          <div key={index} className="advice-card">
            <h4>{advice.title}</h4>
            <p>{advice.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdviceCards
