import { useEffect, useState } from 'react';
import { getCategorySummary } from '../api/report';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useAuth } from '../AuthContext'; // ✅ 加這行

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

export default function ReportChart() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const { user } = useAuth(); // ✅ 加這行

  const loadData = (targetMonth) => {
    if (!user) return; // ✅ 未登入不查詢
    const [year, mon] = targetMonth.split('-');
    const startDate = `${year}-${mon}-01`;
    const endDate = `${year}-${mon}-31`;

    getCategorySummary(user.user_id, startDate, endDate) // ✅ 改這裡
      .then((res) => setData(res.data))
      .catch(() => alert('載入報表失敗'));
  };

  useEffect(() => {
    loadData(month);
  }, [month, user]); // ✅ 加入 user，登入者切換也會重新查詢

  return (
    <div>
      <h3>支出分類統計圖</h3>
      <label>
        選擇月份：
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </label>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category_name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
