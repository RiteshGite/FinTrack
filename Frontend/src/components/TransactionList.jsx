import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { downloadCSV } from '../services/api';

const TransactionList = ({ transactions, onDelete, loading, onFilterChange, customCategories = [] }) => {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    sortBy: 'date',
    order: 'desc'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleExport = async () => {
    try {
      await downloadCSV();
    } catch (error) {
      alert('Failed to export transactions');
    }
  };

  const defaultCategories = [
    'salary', 'freelance', 'investment', 'gift', 'business', 'bonus',
    'food', 'transport', 'entertainment', 'utilities', 'healthcare',
    'shopping', 'education', 'rent', 'subscriptions', 'insurance', 'other'
  ];

  const allCategories = Array.from(new Set([
    ...defaultCategories,
    ...customCategories.map(c => c.name)
  ])).sort();

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <h3>Transactions</h3>
        <button onClick={handleExport} className="btn-small btn-outline-primary">Download CSV</button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Type</label>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Order</label>
          <select name="order" value={filters.order} onChange={handleFilterChange}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="6" className="empty-msg">No transactions found.</td></tr>
            ) : (
              transactions.map((t) => (
                <tr key={t._id} className={t.type}>
                  <td>{format(new Date(t.date), 'dd MMM yyyy')}</td>
                  <td className="capitalize">{t.category}</td>
                  <td>{t.description || '-'}</td>
                  <td className="amount">{formatCurrency(t.amount)}</td>
                  <td>
                    <span className={`badge ${t.type}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => onDelete(t._id)} 
                      className="delete-btn"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--bg-main);
          border-radius: 8px;
        }
        .filter-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #64748b;
        }
        .filter-group select {
          width: 100%;
          padding: 0.4rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }
        .btn-outline-primary {
          border: 1px solid #2563eb;
          color: #2563eb;
          background: transparent;
          cursor: pointer;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
        }
        .btn-outline-primary:hover {
          background: #2563eb;
          color: white;
        }
      `}} />
    </div>
  );
};

export default TransactionList;
