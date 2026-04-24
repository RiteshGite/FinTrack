import React from 'react';

const Stats = ({ income, expense, balance }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="stats-container">
      <div className="stat-card income">
        <div className="stat-icon">↑</div>
        <div className="stat-info">
          <h3>Total Income</h3>
          <p className="stat-amount">{formatCurrency(income)}</p>
        </div>
      </div>

      <div className="stat-card expense">
        <div className="stat-icon">↓</div>
        <div className="stat-info">
          <h3>Total Expense</h3>
          <p className="stat-amount">{formatCurrency(expense)}</p>
        </div>
      </div>

      <div className="stat-card balance">
        <div className="stat-icon">⚖</div>
        <div className="stat-info">
          <h3>Net Balance</h3>
          <p className="stat-amount">{formatCurrency(balance)}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
