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

const CATEGORY_COLORS = {
  Food: '#f97316',
  Rent: '#8b5cf6',
  Salary: '#10b981',
  Entertainment: '#ec4899',
  Utilities: '#3b82f6',
  Other: '#64748b',
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-700">
        <p className="font-semibold">{data.name}</p>
        <p className="text-slate-300">
          {formatCurrency(data.value)}
          {data.payload?.percentage ? ` (${data.payload.percentage}%)` : ''}
        </p>
      </div>
    );
  }
  return null;
};

const ChartsSection = ({ transactions = [] }) => {
  // Aggregate expenses by category
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpenseAmount = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const categoryMap = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount || 0);
  });

  const pieData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
    percentage:
      totalExpenseAmount > 0
        ? Math.round((categoryMap[cat] / totalExpenseAmount) * 100)
        : 0,
  }));

  // Aggregate income vs expense for Bar chart
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const barData = [
    {
      category: 'Income',
      amount: totalIncome,
      color: '#10b981',
    },
    {
      category: 'Expenses',
      amount: totalExpenseAmount,
      color: '#ef4444',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Expenses by Category (Pie Chart) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Expenses by Category</h3>
              <p className="text-xs text-slate-500">Distribution of your spending</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            Total: {formatCurrency(totalExpenseAmount)}
          </span>
        </div>

        {pieData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <Info className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No expense records to display</p>
            <p className="text-xs text-slate-400 mt-0.5">Add expense transactions to see breakdown</p>
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
                      fill={CATEGORY_COLORS[entry.name] || '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-slate-600 font-medium mr-2">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Income vs Expenses (Bar Chart) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Income vs. Expenses</h3>
              <p className="text-xs text-slate-500">Cash flow comparison</p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              totalIncome >= totalExpenseAmount
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            Net: {formatCurrency(totalIncome - totalExpenseAmount)}
          </span>
        </div>

        {totalIncome === 0 && totalExpenseAmount === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <Info className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No transaction data yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Add transactions to compare cash flow</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
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

