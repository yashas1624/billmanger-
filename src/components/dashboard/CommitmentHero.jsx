import React from 'react';
import { useBills } from '../../context/BillContext';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function CommitmentHero() {
  const { bills, setFilter, filter } = useBills();

  const totalAmount = bills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const paidBills = bills.filter(b => b.status === 'paid');
  const paidAmount = paidBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  
  const overdueBills = bills.filter(b => b.status === 'overdue');
  const overdueAmount = overdueBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const dueSoonBills = bills.filter(b => b.status === 'due_soon');
  const dueSoonAmount = dueSoonBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const remainingAmount = Math.max(0, totalAmount - paidAmount);
  const percentagePaid = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl shadow-slate-900/10 border border-slate-800">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Top Header & Month Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Monthly Commitments
            </span>
            <span className="text-xs text-slate-400 font-medium">
              October 2026
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/70 border border-slate-700/60 px-3 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>3.8% lower than last month</span>
          </div>
        </div>

        {/* Big Balance & Percentage Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-6">
          <div className="md:col-span-7">
            <p className="text-sm font-medium text-slate-400 mb-1">
              Total Monthly Obligations
            </p>
            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white">
                ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
              <span className="text-sm font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/40">
                {percentagePaid}% Settled
              </span>
            </div>
          </div>

          {/* Quick Status Pill Filters */}
          <div className="md:col-span-5 flex flex-wrap gap-2 md:justify-end">
            <button
              onClick={() => setFilter(filter === 'overdue' ? 'all' : 'overdue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                overdueBills.length > 0 
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                  : 'bg-slate-800/60 border border-slate-700/50 text-slate-400'
              } ${filter === 'overdue' ? 'ring-2 ring-rose-400' : ''}`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{overdueBills.length} Overdue (${overdueAmount.toFixed(0)})</span>
            </button>

            <button
              onClick={() => setFilter(filter === 'due_soon' ? 'all' : 'due_soon')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                dueSoonBills.length > 0
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-slate-800/60 border border-slate-700/50 text-slate-400'
              } ${filter === 'due_soon' ? 'ring-2 ring-amber-400' : ''}`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{dueSoonBills.length} Due Soon</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, percentagePaid)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>Cleared: <strong className="text-emerald-400 tabular-nums">${paidAmount.toFixed(2)}</strong></span>
            <span>Remaining: <strong className="text-slate-200 tabular-nums">${remainingAmount.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* 3-Pillar Breakdown Cards */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">Paid So Far</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400 tabular-nums">
              ${paidAmount.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">Due in 7 Days</span>
            <span className="text-base sm:text-lg font-bold text-amber-300 tabular-nums">
              ${dueSoonAmount.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">Overdue</span>
            <span className={`text-base sm:text-lg font-bold tabular-nums ${overdueAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              ${overdueAmount.toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
