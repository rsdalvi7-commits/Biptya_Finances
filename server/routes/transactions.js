/**
 * SUMMARY:
 * This file handles all CRUD (Create, Read, Update, Delete) operations for transactions:
 * 1. GET    /api/transactions     : Fetches all transactions belonging to the logged-in user (sorted newest first).
 * 2. POST   /api/transactions     : Adds a new transaction record linked to the user's ID.
 * 3. PUT    /api/transactions/:id : Updates an existing transaction (only if the user owns it).
 * 4. DELETE /api/transactions/:id : Deletes a transaction (only if the user owns it).
 *
 * All routes here are protected with the 'auth' middleware, so `req.user.id` is always available.
 */

import express from 'express';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes in this file (user must be logged in)
router.use(auth);

// ==========================================
// 1. GET ALL TRANSACTIONS
// GET /api/transactions
// ==========================================
router.get('/', async (req, res) => {
  try {
    // Find only transactions that belong to this user (userId: req.user.id)
    // Sort by date descending (newest transactions first)
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json(transactions);
  } catch (err) {
    console.error('Fetch transactions error:', err);
    return res.status(500).json({ message: 'Server error fetching transactions' });
  }
});

// ==========================================
// 2. CREATE A NEW TRANSACTION
// POST /api/transactions
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    // Check that all required fields are present
    if (!title || amount === undefined || !type || !category) {
      return res.status(400).json({ message: 'Title, amount, type, and category are required' });
    }

    // Ensure amount is a positive number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Validate type ('income' or 'expense')
    const validTypes = ['income', 'expense'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
    }

    // Validate category against allowed list
    const validCategories = ['Food', 'Rent', 'Salary', 'Entertainment', 'Utilities', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${validCategories.join(', ')}` });
    }

    // Create new transaction document tied to current user's ID
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

// ==========================================
// 3. UPDATE AN EXISTING TRANSACTION
// PUT /api/transactions/:id
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    // Find transaction by its ID AND ensure it belongs to the logged-in user
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    // Update only the fields that were provided
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

// ==========================================
// 4. DELETE A TRANSACTION
// DELETE /api/transactions/:id
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    // Delete transaction matching ID and confirming current user ownership
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
