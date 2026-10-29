import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Edit3, X, Loader2, IndianRupee, Calendar, Tag, FileText } from 'lucide-react';

const CATEGORIES = ['Food', 'Rent', 'Salary', 'Entertainment', 'Utilities', 'Other'];

const TransactionForm = ({ onTransactionSaved, editingTransaction, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Populate form if in edit mode
  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title || '');
      setAmount(editingTransaction.amount ? String(editingTransaction.amount) : '');
      setType(editingTransaction.type || 'expense');
      setCategory(editingTransaction.category || 'Food');
      setDate(
        editingTransaction.date
          ? new Date(editingTransaction.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setError('');
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      amount: numAmount,
      type,
      category,
      date: new Date(date).toISOString(),
    };

    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }

      resetForm();
      if (onTransactionSaved) {
        onTransactionSaved();
      }
      if (editingTransaction && onCancelEdit) {
        onCancelEdit();
      }
    } catch (err) {
      console.error('Failed to save transaction:', err);
      const msg = err.response?.data?.message || 'Error saving transaction. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {editingTransaction ? (
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
          )}
          <h2 className="text-lg font-bold text-slate-900">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
        </div>

        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 transition"
          >
            <X className="w-3.5 h-3.5" />
            Cancel Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type selector (Income / Expense toggle) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Salary') setCategory('Food');
              }}
              className={`py-2 px-3 rounded-xl text-sm font-semibold border transition flex items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                if (category === 'Food') setCategory('Salary');
              }}
              className={`py-2 px-3 rounded-xl text-sm font-semibold border transition flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Income
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Title / Description
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grocery Store, Monthly Salary, Coffee"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Amount & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-2 py-3 px-4 font-semibold rounded-xl text-white shadow-md transition flex items-center justify-center gap-2 ${
            editingTransaction
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 focus:ring-amber-500'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 focus:ring-indigo-500'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{editingTransaction ? 'Updating...' : 'Adding...'}</span>
            </>
          ) : (
            <span>{editingTransaction ? 'Update Transaction' : 'Add Transaction'}</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;

