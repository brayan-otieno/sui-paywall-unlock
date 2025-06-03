
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: '2024-01-01', earnings: 0 },
  { date: '2024-01-05', earnings: 25.5 },
  { date: '2024-01-10', earnings: 125.5 },
  { date: '2024-01-15', earnings: 340.0 },
  { date: '2024-01-20', earnings: 465.5 },
  { date: '2024-01-25', earnings: 520.0 },
  { date: '2024-01-30', earnings: 465.5 },
];

export const RevenueChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            stroke="#94a3b8"
          />
          <YAxis 
            tickFormatter={(value) => `${value} SUI`}
            stroke="#94a3b8"
          />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [`${value} SUI`, 'Earnings']}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#e2e8f0'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="earnings" 
            stroke="#06b6d4" 
            strokeWidth={3}
            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#0891b2' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
