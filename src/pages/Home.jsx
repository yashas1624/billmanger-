import React, { useState } from 'react';
import { useBills } from '../context/BillContext';
import CommitmentHero from '../components/dashboard/CommitmentHero';
import UrgentHorizon from '../components/dashboard/UrgentHorizon';
import BillCard from '../components/dashboard/BillCard';
import CalendarView from '../components/dashboard/CalendarView';
import { 
  Filter, 
  ListFilter, 
  Calendar as CalendarIcon, 
  List, 
  CheckCircle, 
  Plus,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { 
    bills, 
    filter, 
    setFilter, 
    searchQuery, 
    setIsAddModalOpen 
  } = useBills();

  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'calendar'

  // Filter bills by search query and category/status
  const filteredBills = bills.filter(bill => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      bill.title.toLowerCase().includes(q) ||
      bill.vendor.toLowerCase().includes(q) ||
      bill.category.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Filter match
    if (filter === 'all') return true;
    if (filter === 'paid') return bill.status === 'paid';
    if (filter === 'due_soon') return bill.status === 'due_soon';
    if (filter === 'overdue') return bill.status === 'overdue';
    if (filter === 'split') return bill.isSplit === true;
    return true;
  });

  const counts = {
    all: bills.length,
    due_soon: bills.filter(b => b.status === 'due_soon').length,
    overdue: bills.filter(b => b.status === 'overdue').length,
    paid: bills.filter(b => b.status === 'paid').length,
    split: bills.filter(b => b.isSplit).length,
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Monthly Commitment Hero */}
      <CommitmentHero />

      {/* 2. Urgent Horizon (Next 7 Days) */}
      <UrgentHorizon />

      {/* 3. Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            All ({counts.all})
          </button>

          <button
            onClick={() => setFilter('due_soon')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filter === 'due_soon'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 hover:border-amber-300'
            }`}
          >
            Due Soon ({counts.due_soon})
          </button>

          {counts.overdue > 0 && (
            <button
              onClick={() => setFilter('overdue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                filter === 'overdue'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300'
              }`}
            >
              Overdue ({counts.overdue})
            </button>
          )}

          <button
            onClick={() => setFilter('split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filter === 'split'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            Shared Splits ({counts.split})
          </button>

          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              filter === 'paid'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300'
            }`}
          >
            Paid ({counts.paid})
          </button>
        </div>

        {/* View Mode Toggle: Timeline vs Calendar */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>

      </div>

      {/* 4. Main Content Body */}
      {viewMode === 'calendar' ? (
        <CalendarView />
      ) : (
        <div className="space-y-3">
          {filteredBills.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center space-y-3 bg-white/50 dark:bg-slate-800/30">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                All caught up! No bills found.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No bills currently match the active filter or search criteria.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add a Bill</span>
              </button>
            </div>
          ) : (
            filteredBills.map(bill => (
              <BillCard key={bill.id} bill={bill} />
            ))
          )}
        </div>
      )}

    </div>
  );
}
