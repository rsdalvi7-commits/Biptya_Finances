import React, { useState } from 'react';
import { Edit2, Trash2, Search, Filter, ArrowUpRight, ArrowDownRight, Tag, Calendar, AlertCircle } from 'lucide-react';

const categoryBadgeStyles = {
  Food: 'bg-orange-50 text-orange-700 border-orange-200',
  Rent: 'bg-purple-50 text-purple-700 border-purple-200',
  Salary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Entertainment: 'bg-pink-50 text-pink-700 border-pink-200',
  Utilities: 'bg-blue-50 text-blue-700 border-blue-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TransactionList = ({ transactions = [], onEdit, onDelete, isDeletingId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header and Filters */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredTransactions.length} of {transactions.length} records
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setSelectedType('income')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedType === 'income'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Income Only
          </button>
          <button
            onClick={() => setSelectedType('expense')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedType === 'expense'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Expenses Only
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-auto px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Transactions List / Table */}
      {filteredTransactions.length === 0 ? (
        <div className="py-16 px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">No transactions found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {transactions.length === 0
              ? 'Start tracking your spending by adding your first transaction above.'
              : 'No transactions match your current search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <th className="py-3 px-6">Transaction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTransactions.map((t) => {
                const isIncome = t.type === 'income';
                return (
                  <tr
                    key={t._id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Title + Type icon */}
                    <td className="py-4 px-6 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-900 line-clamp-1">
                          {t.title}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          categoryBadgeStyles[t.category] || categoryBadgeStyles.Other
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>

                    {/* Amount */}
                    <td
                      className={`py-4 px-4 text-right font-bold whitespace-nowrap ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(t._id)}
                          disabled={isDeletingId === t._id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionList;

