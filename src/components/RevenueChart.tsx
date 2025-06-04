
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
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            stroke="#666666"
          />
          <YAxis 
            tickFormatter={(value) => `${value} SUI`}
            stroke="#666666"
          />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => [`${value} SUI`, 'Earnings']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#333333'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="earnings" 
            stroke="#2962FF" 
            strokeWidth={3}
            dot={{ fill: '#2962FF', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#6A1B9A' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
