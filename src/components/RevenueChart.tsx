
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tickFormatter={(value) => `${value} SUI`}
          />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [`${value} SUI`, 'Earnings']}
          />
          <Line 
            type="monotone" 
            dataKey="earnings" 
            stroke="#6366f1" 
            strokeWidth={3}
            dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
