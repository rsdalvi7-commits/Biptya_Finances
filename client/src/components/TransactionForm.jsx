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
    <div className="bg-[#FBF7EE] rounded-2xl p-6 border border-[#DDD0B8] shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {editingTransaction ? (
            <div className="w-8 h-8 rounded-lg bg-[#EED9F7] text-[#581C87] flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#EED9F7] text-[#581C87] flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
          )}
          <h2 className="text-xl font-bold text-[#260E36]">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
        </div>

        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-[#5B4469] hover:text-[#260E36] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFE7D6] border border-[#DDD0B8] transition font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            Cancel Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[#F5E1E6] border border-[#E8D0D6] text-[#831843] text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type selector (Income / Expense toggle) */}
        <div>
          <label className="block text-xs font-bold text-[#5B4469] uppercase tracking-wider mb-1.5">
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
                  ? 'bg-[#F5E1E6] border-[#BE123C] text-[#831843] ring-2 ring-[#BE123C]/20'
                  : 'bg-[#EFE7D6] border-[#DDD0B8] text-[#5B4469] hover:bg-[#E8DEC8]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#BE123C]" />
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
                  ? 'bg-[#EED9F7] border-[#7E22CE] text-[#581C87] ring-2 ring-[#7E22CE]/20'
                  : 'bg-[#EFE7D6] border-[#DDD0B8] text-[#5B4469] hover:bg-[#E8DEC8]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#7E22CE]" />
              Income
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#5B4469] uppercase tracking-wider mb-1.5">
            Title / Description
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E22CE]">
              <FileText className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grocery Store, Monthly Salary, Coffee"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-[#EFE7D6] border border-[#DDD0B8] rounded-xl text-[#260E36] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:bg-[#FAF5EB] transition placeholder-[#8A7397]"
            />
          </div>
        </div>

        {/* Amount & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#5B4469] uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E22CE]">
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
                className="w-full pl-10 pr-4 py-2.5 bg-[#EFE7D6] border border-[#DDD0B8] rounded-xl text-[#260E36] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:bg-[#FAF5EB] transition placeholder-[#8A7397]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B4469] uppercase tracking-wider mb-1.5">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E22CE]">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#EFE7D6] border border-[#DDD0B8] rounded-xl text-[#260E36] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:bg-[#FAF5EB] transition cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-[#5B4469] uppercase tracking-wider mb-1.5">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E22CE]">
              <Tag className="w-4 h-4" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-[#EFE7D6] border border-[#DDD0B8] rounded-xl text-[#260E36] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:bg-[#FAF5EB] transition appearance-none cursor-pointer font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#5B4469]">
              ▼
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 font-bold rounded-xl text-[#FAF5EB] shadow-md transition flex items-center justify-center gap-2 bg-[#581C87] hover:bg-[#4A154B] focus:ring-2 focus:ring-[#7E22CE] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#FAF5EB]" />
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
