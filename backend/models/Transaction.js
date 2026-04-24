const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify transaction type (income or expense)']
  },
  category: {
    type: String,
    enum: [
      'salary', 'freelance', 'investment', 'gift', 'business', 'bonus',
      'food', 'transport', 'entertainment', 'utilities', 'healthcare',
      'shopping', 'education', 'rent', 'subscriptions', 'insurance', 'other'
    ],
    required: [true, 'Please specify a category']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount must be positive']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for optimization
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
