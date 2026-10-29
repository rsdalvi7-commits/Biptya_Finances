import express from 'express';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All transaction routes are protected
router.use(auth);

// @route   GET /api/transactions
// @desc    Get all transactions for authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json(transactions);
  } catch (err) {
    console.error('Fetch transactions error:', err);
    return res.status(500).json({ message: 'Server error fetching transactions' });
  }
});

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    if (!title || amount === undefined || !type || !category) {
      return res.status(400).json({ message: 'Title, amount, type, and category are required' });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const validTypes = ['income', 'expense'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
    }

    const validCategories = ['Food', 'Rent', 'Salary', 'Entertainment', 'Utilities', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${validCategories.join(', ')}` });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      title: title.trim(),
      amount: numericAmount,
      type,
      category,
      date: date ? new Date(date) : new Date(),
    });

    const savedTransaction = await transaction.save();
    return res.status(201).json(savedTransaction);
  } catch (err) {
    console.error('Create transaction error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: 'Server error creating transaction' });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    if (title !== undefined) transaction.title = title.trim();
    if (amount !== undefined) {
      const numericAmount = Number(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }
      transaction.amount = numericAmount;
    }
    if (type !== undefined) {
      const validTypes = ['income', 'expense'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
      }
      transaction.type = type;
    }
    if (category !== undefined) {
      const validCategories = ['Food', 'Rent', 'Salary', 'Entertainment', 'Utilities', 'Other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: `Category must be one of: ${validCategories.join(', ')}` });
      }
      transaction.category = category;
    }
    if (date !== undefined) {
      transaction.date = new Date(date);
    }

    const updatedTransaction = await transaction.save();
    return res.json(updatedTransaction);
  } catch (err) {
    console.error('Update transaction error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    return res.status(500).json({ message: 'Server error updating transaction' });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    return res.json({ message: 'Transaction deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('Delete transaction error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    return res.status(500).json({ message: 'Server error deleting transaction' });
  }
});

export default router;

