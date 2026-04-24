import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, loading, customCategories = [], onAddCategory }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const defaultIncomeCategories = ['salary', 'freelance', 'investment', 'gift', 'business', 'bonus', 'other'];
  const defaultExpenseCategories = ['food', 'transport', 'entertainment', 'utilities', 'healthcare', 'shopping', 'education', 'rent', 'subscriptions', 'insurance', 'other'];

  const userCategories = customCategories
    .filter(cat => cat.type === formData.type)
    .map(cat => cat.name);

  const categories = Array.from(new Set([
    ...(formData.type === 'income' ? defaultIncomeCategories : defaultExpenseCategories),
    ...userCategories
  ]));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' && value === 'add_new') {
      setShowAddCategory(true);
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category if type changes
      ...(name === 'type' ? { category: '' } : {})
    }));
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const res = await onAddCategory(newCategoryName, formData.type);
    if (res.success) {
      setFormData(prev => ({ ...prev, category: newCategoryName.toLowerCase() }));
      setNewCategoryName('');
      setShowAddCategory(false);
    } else {
      alert(res.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  return (
    <div className="transaction-form-card">
      <h3>Add New Transaction</h3>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                /> Income
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                /> Expense
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            {showAddCategory ? (
              <div className="add-category-input">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category Name"
                  autoFocus
                />
                <div className="add-category-btns">
                  <button type="button" onClick={handleAddCategory} className="btn-small btn-success">Add</button>
                  <button type="button" onClick={() => setShowAddCategory(false)} className="btn-small btn-danger">Cancel</button>
                </div>
              </div>
            ) : (
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
                <option value="add_new">+ Add Custom Category</option>
              </select>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What was this for?"
            maxLength="200"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .add-category-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .add-category-btns {
          display: flex;
          gap: 0.5rem;
        }
        .btn-small {
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }
        .btn-success { background-color: #10b981; color: white; }
        .btn-danger { background-color: #ef4444; color: white; }
      `}} />
    </div>
  );
};

export default TransactionForm;
