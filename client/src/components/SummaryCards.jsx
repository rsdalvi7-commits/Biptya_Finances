/**
 * SUMMARY:
 * This component calculates and displays the 3 high-level financial summary cards:
 * 1. Current Balance : (Total Income - Total Expenses) in Rupees (₹) with a Surplus/Deficit status pill.
 * 2. Total Income    : Sum of all income transactions with entry counter.
 * 3. Total Expenses  : Sum of all expense transactions with entry counter.
 *
 * Uses the Indian numbering system format (₹ Lakhs / Crores) and the Cream & Purple theme.
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

// Format numeric values into Indian Rupees (e.g. ₹5,000.00 or ₹1,50,000.00)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const SummaryCards = ({ transactions = [] }) => {
  // 1. Calculate sum of all transactions where type is 'income'
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // 2. Calculate sum of all transactions where type is 'expense'
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // 3. Current net balance = Income minus Expenses
  const currentBalance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* ========================================================
          CARD 1: CURRENT BALANCE (Regal Purple Gradient Card)
          ======================================================== */}
      <div className="bg-gradient-to-br from-[#4A154B] via-[#581C87] to-[#3B0764] rounded-2xl p-6 text-[#FAF5EB] shadow-xl shadow-[#581C87]/20 flex flex-col justify-between relative overflow-hidden border border-[#3B0764]">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-[#EED9F7]/10 blur-xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#E9D5FF] tracking-wide uppercase">
              Current Balance
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EB]/15 flex items-center justify-center text-[#FAF5EB]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold tracking-tight text-[#FAF5EB]">
            {formatCurrency(currentBalance)}
          </h3>
        </div>
        <div className="mt-4 pt-3 border-t border-[#7E22CE]/40 flex items-center justify-between text-xs text-[#E9D5FF]">
          <span>Net status</span>
          <span
            className={`font-semibold px-2.5 py-0.5 rounded-full border ${
              currentBalance >= 0
                ? 'bg-[#2E1045] text-[#D8B4FE] border-[#7E22CE]'
                : 'bg-[#4C0519] text-[#FECDD3] border-[#9F1239]'
            }`}
          >
            {currentBalance >= 0 ? 'Surplus' : 'Deficit'}
          </span>
        </div>
      </div>

      {/* ========================================================
          CARD 2: TOTAL INCOME (Warm Cream Card)
          ======================================================== */}
      <div className="bg-[#FBF7EE] rounded-2xl p-6 border border-[#DDD0B8] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#5B4469] tracking-wide uppercase">
              Total Income
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EED9F7] text-[#581C87] flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#260E36] tracking-tight">
            {formatCurrency(totalIncome)}
          </h3>
        </div>
        <div className="mt-4 pt-3 border-t border-[#EFE7D6] flex items-center justify-between text-xs text-[#5B4469]">
          <span>Income transactions</span>
          <span className="font-semibold text-[#581C87] bg-[#EED9F7] border border-[#DFBFEE] px-2.5 py-0.5 rounded-full">
            {transactions.filter((t) => t.type === 'income').length} entries
          </span>
        </div>
      </div>

      {/* ========================================================
          CARD 3: TOTAL EXPENSES (Warm Cream Card)
          ======================================================== */}
      <div className="bg-[#FBF7EE] rounded-2xl p-6 border border-[#DDD0B8] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#5B4469] tracking-wide uppercase">
              Total Expenses
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#F5E1E6] text-[#831843] flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#260E36] tracking-tight">
            {formatCurrency(totalExpenses)}
          </h3>
        </div>
        <div className="mt-4 pt-3 border-t border-[#EFE7D6] flex items-center justify-between text-xs text-[#5B4469]">
          <span>Expense transactions</span>
          <span className="font-semibold text-[#831843] bg-[#F5E1E6] border border-[#E8D0D6] px-2.5 py-0.5 rounded-full">
            {transactions.filter((t) => t.type === 'expense').length} entries
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
