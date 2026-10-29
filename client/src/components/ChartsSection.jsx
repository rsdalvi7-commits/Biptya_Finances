/**
 * SUMMARY:
 * This component renders two interactive data visualizations using the Recharts library:
 * 1. Expenses by Category (Donut/Pie Chart):
 *    - Calculates total spending per category (Food, Rent, Salary, Entertainment, Utilities, Other).
 *    - Displays percentage share and formatted rupee values.
 * 2. Income vs. Expenses (Bar Chart):
 *    - Directly contrasts Total Inflow vs Total Outflow side-by-side with net cash flow indicator.
 * Both charts include custom interactive tooltips and graceful empty states if no data is recorded.
 */

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Info } from 'lucide-react';

// Color palette mapping each category to a distinct harmonious shade
const CATEGORY_COLORS = {
  Food: '#C2410C',          // Terracotta
  Rent: '#6B21A8',          // Deep purple
  Salary: '#047857',        // Forest green
  Entertainment: '#A21CAF', // Magenta purple
  Utilities: '#1D4ED8',     // Deep royal blue
  Other: '#78350F',         // Warm bronze
};

// Formats numbers into integer rupees for concise chart labels (e.g. ₹5,000)
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

// Custom interactive tooltip that pops up on hover (Deep purple box with cream text)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#3B0764] text-[#FAF5EB] text-xs px-3 py-2 rounded-xl shadow-lg border border-[#581C87]">
        <p className="font-bold">{data.name}</p>
        <p className="text-[#E9D5FF]">
          {formatCurrency(data.value)}
          {data.payload?.percentage ? ` (${data.payload.percentage}%)` : ''}
        </p>
      </div>
    );
  }
  return null;
};

const ChartsSection = ({ transactions = [] }) => {
  // -------------------------------------------------------------
  // 1. DATA PREPARATION: AGGREGATE EXPENSES BY CATEGORY (FOR PIE)
  // -------------------------------------------------------------
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpenseAmount = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // Group sum of amounts by category name
  const categoryMap = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount || 0);
  });

  // Convert map to array format required by Recharts
  const pieData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
    percentage:
      totalExpenseAmount > 0
        ? Math.round((categoryMap[cat] / totalExpenseAmount) * 100)
        : 0,
  }));

  // -------------------------------------------------------------
  // 2. DATA PREPARATION: INCOME VS EXPENSES (FOR BAR CHART)
  // -------------------------------------------------------------
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const barData = [
    {
      category: 'Income',
      amount: totalIncome,
      color: '#6B21A8', // Royal purple bar
    },
    {
      category: 'Expenses',
      amount: totalExpenseAmount,
      color: '#9F1239', // Rich wine bar
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* =========================================================
          CHART 1: PIE CHART (EXPENSES BY CATEGORY)
          ========================================================= */}
      <div className="bg-[#FBF7EE] rounded-2xl p-6 border border-[#DDD0B8] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EED9F7] text-[#581C87] flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#260E36]">Expenses by Category</h3>
              <p className="text-xs text-[#5B4469]">Distribution of your spending</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-[#EFE7D6] text-[#581C87] border border-[#DDD0B8] rounded-full">
            Total: {formatCurrency(totalExpenseAmount)}
          </span>
        </div>

        {/* Empty state if no expense transactions exist */}
        {pieData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-[#5B4469]">
            <Info className="w-8 h-8 mb-2 opacity-60 text-[#7E22CE]" />
            <p className="text-sm font-semibold">No expense records to display</p>
            <p className="text-xs text-[#5B4469] mt-0.5">Add expense transactions to see breakdown</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={CATEGORY_COLORS[entry.name] || '#78350F'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-[#260E36] font-bold mr-2">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* =========================================================
          CHART 2: BAR CHART (INCOME VS EXPENSES)
          ========================================================= */}
      <div className="bg-[#FBF7EE] rounded-2xl p-6 border border-[#DDD0B8] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EED9F7] text-[#581C87] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#260E36]">Income vs. Expenses</h3>
              <p className="text-xs text-[#5B4469]">Cash flow comparison</p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              totalIncome >= totalExpenseAmount
                ? 'bg-[#EED9F7] text-[#581C87] border-[#DFBFEE]'
                : 'bg-[#F5E1E6] text-[#831843] border-[#E8D0D6]'
            }`}
          >
            Net: {formatCurrency(totalIncome - totalExpenseAmount)}
          </span>
        </div>

        {/* Empty state if no transactions exist */}
        {totalIncome === 0 && totalExpenseAmount === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-[#5B4469]">
            <Info className="w-8 h-8 mb-2 opacity-60 text-[#7E22CE]" />
            <p className="text-sm font-semibold">No transaction data yet</p>
            <p className="text-xs text-[#5B4469] mt-0.5">Add transactions to compare cash flow</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE7D6" />
                <XAxis
                  dataKey="category"
                  stroke="#5B4469"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#5B4469"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(238, 217, 247, 0.4)' }}
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;
