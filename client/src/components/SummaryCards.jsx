import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, IndianRupee } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const SummaryCards = ({ transactions = [] }) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const currentBalance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Current Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/10 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-indigo-100">Current Balance</span>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold tracking-tight">
            {formatCurrency(currentBalance)}
          </h3>
        </div>
        <div className="mt-4 pt-3 border-t border-indigo-500/30 flex items-center justify-between text-xs text-indigo-100">
          <span>Net status</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full ${
              currentBalance >= 0
                ? 'bg-emerald-400/20 text-emerald-200'
                : 'bg-rose-400/20 text-rose-200'
            }`}
          >
            {currentBalance >= 0 ? 'Surplus' : 'Deficit'}
          </span>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">Total Income</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(totalIncome)}
          </h3>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Income transactions</span>
          <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {transactions.filter((t) => t.type === 'income').length} entries
          </span>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">Total Expenses</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(totalExpenses)}
          </h3>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Expense transactions</span>
          <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
            {transactions.filter((t) => t.type === 'expense').length} entries
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
