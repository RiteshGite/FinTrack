import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CategoryChart = ({ data }) => {
  const COLORS = [
    '#2563eb', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#6366f1', '#f97316'
  ];

  const chartData = data.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.total
  }));

  if (chartData.length === 0) {
    return (
      <div className="chart-empty" style={{ 
        height: '300px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-main)',
        borderRadius: '8px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3>No data available</h3>
        <p>Add some transactions to see your breakdown.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Category Breakdown (This Month)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `₹${value.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
