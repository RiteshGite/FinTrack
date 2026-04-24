import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useTransactions from '../hooks/useTransactions';
import Stats from './Stats';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import CategoryChart from './CategoryChart';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    transactions,
    loading,
    stats,
    categoryStats,
    categories,
    fetchTransactions,
    fetchStats,
    fetchCategoryStats,
    fetchCategories,
    addCategory,
    createTransaction,
    deleteTransaction
  } = useTransactions();

  useEffect(() => {
    fetchTransactions();
    fetchStats();
    fetchCategoryStats();
    fetchCategories();
  }, [fetchTransactions, fetchStats, fetchCategoryStats, fetchCategories]);

  const handleAddTransaction = async (data) => {
    const res = await createTransaction(data);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const res = await deleteTransaction(id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const handleFilterChange = (filters) => {
    fetchTransactions(filters);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Here's your financial overview for this month.</p>
      </header>

      <Stats 
        income={stats.income} 
        expense={stats.expense} 
        balance={stats.balance} 
      />

      <div className="dashboard-grid">
        <div className="grid-item">
          <TransactionForm 
            onSubmit={handleAddTransaction} 
            loading={loading} 
            customCategories={categories}
            onAddCategory={addCategory}
          />
        </div>
        <div className="grid-item">
          <CategoryChart data={categoryStats} />
        </div>
      </div>

      <div className="dashboard-footer">
        <TransactionList 
          transactions={transactions} 
          onDelete={handleDeleteTransaction} 
          loading={loading}
          onFilterChange={handleFilterChange}
          customCategories={categories}
        />
      </div>
    </div>
  );
};

export default Dashboard;
