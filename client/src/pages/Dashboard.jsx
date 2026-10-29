/**
 * SUMMARY:
 * This is the central Dashboard page component (/dashboard):
 * 1. Data Fetching: Calls GET /api/transactions on load to retrieve the user's records.
 * 2. Layout Integration:
 *    - Navbar: Logo, user profile, logout.
 *    - Feedback Banner: Displays momentary success/error alert messages.
 *    - SummaryCards: Total Income, Total Expenses, and Current Balance in Rupees.
 *    - TransactionForm: Form to create a new transaction or edit an existing one.
 *    - ChartsSection: Pie Chart of category expenses and Bar Chart of income vs expenses.
 *    - TransactionList: Full interactive history table with edit and delete capabilities.
 * 3. State Coordination: Manages edit selection, delete confirmation, and data refreshes.
 */

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ChartsSection from '../components/ChartsSection';
import api from '../api';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  // State variables for transactions, loading, and interactive edits
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Displays a self-dismissing toast/banner notification
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Fetches latest transactions from the backend
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      showFeedback('error', 'Failed to fetch transactions from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch transactions once upon page mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle Edit button click: Populates the form and scrolls up smoothly
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Cancel Edit button click
  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  // Callback triggered after a transaction is saved/updated successfully
  const handleTransactionSaved = () => {
    const isEdit = !!editingTransaction;
    setEditingTransaction(null);
    fetchTransactions();
    showFeedback(
      'success',
      isEdit ? 'Transaction updated successfully!' : 'Transaction added successfully!'
    );
  };

  // Handle Delete button click with confirmation check
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      setIsDeletingId(id);
      await api.delete(`/transactions/${id}`);
      // Remove deleted item from local state immediately
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      showFeedback('success', 'Transaction deleted successfully.');
      if (editingTransaction && editingTransaction._id === id) {
        setEditingTransaction(null);
      }
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      showFeedback('error', 'Failed to delete transaction.');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E4] text-[#260E36] flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Feedback / Alert Banner */}
        {feedback && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold border shadow-xs transition-all ${
              feedback.type === 'success'
                ? 'bg-[#EED9F7] border-[#DFBFEE] text-[#581C87]'
                : 'bg-[#F5E1E6] border-[#E8D0D6] text-[#831843]'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#581C87]" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#831843]" />
            )}
            <span>{feedback.message}</span>
            <button
              onClick={() => setFeedback(null)}
              className="ml-auto text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Title & Quick Refresh Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#260E36] tracking-tight">
              Financial Overview
            </h1>
            <p className="text-[#5B4469] text-sm mt-1 font-medium">
              Track your income, control your expenditures, and optimize your monthly budget.
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EFE7D6] border border-[#DDD0B8] text-[#260E36] hover:bg-[#581C87] hover:text-[#FAF5EB] rounded-xl text-xs font-bold shadow-xs transition self-start sm:self-auto disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Summary Metric Cards (Balance, Income, Expenses) */}
        <SummaryCards transactions={transactions} />

        {/* Two-Column Layout: Form + Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Add/Edit Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm
              onTransactionSaved={handleTransactionSaved}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* Column 2: Visual Charts (Pie + Bar) */}
          <div className="lg:col-span-2">
            <ChartsSection transactions={transactions} />
          </div>
        </div>

        {/* Full-width Transactions History Table */}
        <div className="w-full">
          {loading && transactions.length === 0 ? (
            <div className="bg-[#FBF7EE] rounded-2xl p-12 text-center border border-[#DDD0B8] shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B21A8] mx-auto mb-3" />
              <p className="text-[#4C2860] font-semibold text-base">Loading your transactions...</p>
            </div>
          ) : (
            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeletingId={isDeletingId}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#DDD0B8] bg-[#FBF7EE] py-6 text-center text-xs text-[#5B4469] font-medium">
        <p>© {new Date().getFullYear()} Biptya Finances. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
