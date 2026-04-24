import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryStats, setCategoryStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchTransactions = useCallback(async (filters = {}, page = 1) => {
    try {
      setLoading(true);
      const params = { page, ...filters };
      const res = await api.get('/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/transactions/stats/monthly');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const fetchCategoryStats = useCallback(async () => {
    try {
      const res = await api.get('/transactions/stats/category');
      if (res.data.success) {
        setCategoryStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching category stats:', err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/transactions/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const addCategory = async (name, type) => {
    try {
      const res = await api.post('/transactions/categories', { name, type });
      if (res.data.success) {
        await fetchCategories();
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add category' };
    }
  };

  const createTransaction = async (data) => {
    try {
      setLoading(true);
      const res = await api.post('/transactions', data);
      if (res.data.success) {
        await fetchTransactions();
        await fetchStats();
        await fetchCategoryStats();
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create transaction' };
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      setLoading(true);
      const res = await api.put(`/transactions/${id}`, data);
      if (res.data.success) {
        await fetchTransactions();
        await fetchStats();
        await fetchCategoryStats();
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update transaction' };
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setLoading(true);
      const res = await api.delete(`/transactions/${id}`);
      if (res.data.success) {
        await fetchTransactions();
        await fetchStats();
        await fetchCategoryStats();
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete transaction' };
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    stats,
    categoryStats,
    categories,
    pagination,
    fetchTransactions,
    fetchStats,
    fetchCategoryStats,
    fetchCategories,
    addCategory,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
};

export default useTransactions;
