/**
 * SUMMARY:
 * This file defines the "Transaction" blueprint (Mongoose Schema) for MongoDB.
 * It stores each financial record entered by a user:
 * - userId: Links the transaction to the specific user who owns it (data privacy).
 * - title: Short description (e.g. "Grocery Shopping", "Monthly Salary").
 * - amount: The financial value (must be greater than 0).
 * - type: Either "income" or "expense".
 * - category: One of 6 preset categories (Food, Rent, Salary, Entertainment, Utilities, Other).
 * - date: The date when the transaction occurred (defaults to today).
 */

import mongoose from 'mongoose';

// Define the blueprint for each transaction record document
const transactionSchema = new mongoose.Schema(
  {
    // The ID of the user who owns this transaction (references the User model)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Speeds up queries when searching by userId
    },
    // The description/name of the transaction
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    // The monetary value (must be positive)
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    // Whether money is coming in (income) or going out (expense)
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type',
      },
      required: [true, 'Transaction type is required'],
    },
    // Category classification for charts and filtering
    category: {
      type: String,
      enum: {
        values: ['Food', 'Rent', 'Salary', 'Entertainment', 'Utilities', 'Other'],
        message: '{VALUE} is not a supported category',
      },
      required: [true, 'Category is required'],
    },
    // Date of the transaction
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    // Adds createdAt and updatedAt timestamps automatically
    timestamps: true,
  }
);

// Create the Mongoose model
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
