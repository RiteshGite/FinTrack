const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlyStats,
  getCategoryStats,
  exportTransactions,
  getCategories,
  createCategory
} = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const { validateTransaction } = require('../utils/validation');

// All transaction routes require authentication
router.use(auth);

/**
 * @route   GET /api/transactions/stats/monthly
 * @desc    Get monthly summary stats
 */
router.get('/stats/monthly', getMonthlyStats);

/**
 * @route   GET /api/transactions/stats/category
 * @desc    Get category-wise stats for current month
 */
router.get('/stats/category', getCategoryStats);

/**
 * @route   GET /api/transactions/export
 * @desc    Export transactions as CSV
 */
router.get('/export', exportTransactions);

/**
 * @route   GET /api/transactions/categories
 * @desc    Get all user categories
 */
router.get('/categories', getCategories);

/**
 * @route   POST /api/transactions/categories
 * @desc    Create a new user category
 */
router.post('/categories', createCategory);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with filters
 */
router.get('/', getTransactions);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 */
router.post('/', validateTransaction, createTransaction);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get a single transaction
 */
router.get('/:id', getTransaction);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update a transaction
 */
router.put('/:id', updateTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction
 */
router.delete('/:id', deleteTransaction);

module.exports = router;
