import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ChartsSection from '../components/ChartsSection';
import api from '../api';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

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

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    // Smooth scroll to top / form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleTransactionSaved = () => {
    const isEdit = !!editingTransaction;
    setEditingTransaction(null);
    fetchTransactions();
    showFeedback(
      'success',
      isEdit ? 'Transaction updated successfully!' : 'Transaction added successfully!'
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      setIsDeletingId(id);
      await api.delete(`/transactions/${id}`);
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium border shadow-xs transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            )}
            <span>{feedback.message}</span>
            <button
              onClick={() => setFeedback(null)}
              className="ml-auto text-xs font-semibold underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Financial Overview
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track your income, control your expenditures, and optimize your monthly budget.
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold shadow-xs transition self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        <SummaryCards transactions={transactions} />

        {/* Main Grid: Form & Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form Column */}
          <div className="lg:col-span-1">
            <TransactionForm
              onTransactionSaved={handleTransactionSaved}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* Charts Column */}
          <div className="lg:col-span-2">
            <ChartsSection transactions={transactions} />
          </div>
        </div>

        {/* Full-width Transactions Table */}
        <div className="w-full">
          {loading && transactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Loading your transactions...</p>
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
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Biptya Finances. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;

