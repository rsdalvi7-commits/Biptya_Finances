import React, { useState } from 'react';
import { Edit2, Trash2, Search, Filter, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';

const categoryBadgeStyles = {
  Food: 'bg-[#F2DFCE] text-[#7C2D12] border-[#E5CAAD]',
  Rent: 'bg-[#EED9F7] text-[#581C87] border-[#DFBFEE]',
  Salary: 'bg-[#DFECE1] text-[#14532D] border-[#C4DFC8]',
  Entertainment: 'bg-[#F5DDEB] text-[#831843] border-[#E8BED6]',
  Utilities: 'bg-[#DDE9F5] text-[#1E3A8A] border-[#BFD5EB]',
  Other: 'bg-[#E8DEC8] text-[#4A3B2C] border-[#D4C4A8]',
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
    <div className="bg-[#FBF7EE] rounded-2xl border border-[#DDD0B8] shadow-xs overflow-hidden">
      {/* Header and Filters */}
      <div className="p-6 border-b border-[#EFE7D6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#260E36]">Transaction History</h2>
            <p className="text-xs text-[#5B4469] mt-0.5">
              Showing {filteredTransactions.length} of {transactions.length} records
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E22CE] pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#EFE7D6] border border-[#DDD0B8] rounded-xl text-xs text-[#260E36] placeholder-[#8A7397] focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:bg-[#FAF5EB] transition"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#5B4469] flex items-center gap-1 mr-1 font-semibold">
            <Filter className="w-3.5 h-3.5 text-[#7E22CE]" /> Filter:
          </span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-lg font-bold border transition ${
              selectedType === 'all'
                ? 'bg-[#581C87] text-[#FAF5EB] border-[#4A154B]'
                : 'bg-[#EFE7D6] text-[#5B4469] border-[#DDD0B8] hover:bg-[#E8DEC8]'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setSelectedType('income')}
            className={`px-3 py-1 rounded-lg font-bold border transition ${
              selectedType === 'income'
                ? 'bg-[#581C87] text-[#FAF5EB] border-[#3B0764]'
                : 'bg-[#EFE7D6] text-[#5B4469] border-[#DDD0B8] hover:bg-[#E8DEC8]'
            }`}
          >
            Income Only
          </button>
          <button
            onClick={() => setSelectedType('expense')}
            className={`px-3 py-1 rounded-lg font-bold border transition ${
              selectedType === 'expense'
                ? 'bg-[#831843] text-[#FAF5EB] border-[#701A75]'
                : 'bg-[#EFE7D6] text-[#5B4469] border-[#DDD0B8] hover:bg-[#E8DEC8]'
            }`}
          >
            Expenses Only
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-auto px-3 py-1 bg-[#EFE7D6] border border-[#DDD0B8] rounded-lg text-[#260E36] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:bg-[#FAF5EB] cursor-pointer"
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
          <div className="w-12 h-12 rounded-2xl bg-[#EFE7D6] text-[#7E22CE] flex items-center justify-center mx-auto mb-3 border border-[#DDD0B8]">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#260E36]">No transactions found</h3>
          <p className="text-xs text-[#5B4469] mt-1 max-w-xs mx-auto">
            {transactions.length === 0
              ? 'Start tracking your spending by adding your first transaction above.'
              : 'No transactions match your current search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDD0B8] bg-[#EFE7D6] text-[11px] uppercase tracking-wider text-[#5B4469] font-bold">
                <th className="py-3 px-6">Transaction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE7D6] text-sm">
              {filteredTransactions.map((t) => {
                const isIncome = t.type === 'income';
                return (
                  <tr
                    key={t._id}
                    className="hover:bg-[#F3EBDD] transition-colors group"
                  >
                    {/* Title + Type icon */}
                    <td className="py-4 px-6 font-semibold text-[#260E36]">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isIncome
                              ? 'bg-[#EED9F7] text-[#581C87]'
                              : 'bg-[#F5E1E6] text-[#831843]'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-bold text-[#260E36] line-clamp-1">
                          {t.title}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          categoryBadgeStyles[t.category] || categoryBadgeStyles.Other
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-[#5B4469] text-xs font-semibold whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>

                    {/* Amount */}
                    <td
                      className={`py-4 px-4 text-right font-extrabold whitespace-nowrap ${
                        isIncome ? 'text-[#581C87]' : 'text-[#831843]'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(t)}
                          className="p-1.5 rounded-lg text-[#5B4469] hover:text-[#581C87] hover:bg-[#EED9F7] transition"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(t._id)}
                          disabled={isDeletingId === t._id}
                          className="p-1.5 rounded-lg text-[#5B4469] hover:text-[#831843] hover:bg-[#F5E1E6] transition disabled:opacity-50"
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
