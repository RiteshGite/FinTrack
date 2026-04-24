const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');

/**
 * @desc    Get all transactions for a user with filtering and pagination
 * @route   GET /api/transactions
 * @access  Private
 */
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, sortBy, order = 'desc', page = 1, limit = 20 } = req.query;

    // Build query
    const query = { userId: req.userId };

    if (type) query.type = type;
    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Sorting
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;
    } else {
      sortOptions = { date: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const transactions = await Transaction.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(`Get Transactions Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transactions'
    });
  }
};

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
exports.createTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    const transaction = new Transaction({
      userId: req.userId,
      type,
      category,
      amount,
      description,
      date: date || Date.now()
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error(`Create Transaction Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error creating transaction'
    });
  }
};

/**
 * @desc    Get a single transaction
 * @route   GET /api/transactions/:id
 * @access  Private
 */
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this transaction'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(`Get Transaction Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transaction'
    });
  }
};

/**
 * @desc    Update a transaction
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
exports.updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction'
      });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error(`Update Transaction Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error updating transaction'
    });
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction'
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error(`Delete Transaction Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting transaction'
    });
  }
};

/**
 * @desc    Get monthly stats (income, expense, balance)
 * @route   GET /api/transactions/stats/monthly
 * @access  Private
 */
exports.getMonthlyStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          income: 1,
          expense: 1,
          balance: { $subtract: ['$income', '$expense'] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || { income: 0, expense: 0, balance: 0 }
    });
  } catch (error) {
    console.error(`Monthly Stats Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching monthly stats'
    });
  }
};

/**
 * @desc    Get stats by category for current month
 * @route   GET /api/transactions/stats/category
 * @access  Private
 */
exports.getCategoryStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(`Category Stats Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching category stats'
    });
  }
};

/**
 * @desc    Export transactions as CSV
 * @route   GET /api/transactions/export
 * @access  Private
 */
exports.exportTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });

    const fields = [
      { label: 'Date', value: (row) => new Date(row.date).toLocaleDateString() },
      { label: 'Type', value: 'type' },
      { label: 'Category', value: 'category' },
      { label: 'Amount', value: 'amount' },
      { label: 'Description', value: 'description' }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (error) {
    console.error(`Export Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error exporting transactions'
    });
  }
};

/**
 * @desc    Get all user categories
 * @route   GET /api/transactions/categories
 * @access  Private
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.userId });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error(`Get Categories Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
};

/**
 * @desc    Create a new user category
 * @route   POST /api/transactions/categories
 * @access  Private
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name and type are required'
      });
    }

    // Check if category already exists for this user and type
    const existingCategory = await Category.findOne({ userId: req.userId, name: name.toLowerCase(), type });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const category = new Category({
      name: name.toLowerCase(),
      type,
      userId: req.userId
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error(`Create Category Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error creating category'
    });
  }
};
