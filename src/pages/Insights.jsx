import React, { useState } from 'react';
import { useBills } from '../context/BillContext';
import { 
  PieChart as PieIcon, 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  Tv, 
  Activity, 
  ArrowUpRight, 
  CheckCircle, 
  Flame,
  CreditCard,
  DollarSign
} from 'lucide-react';

export default function Insights() {
  const { bills } = useBills();
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' | 'quarterly' | 'annual'

  // Total spending
  const totalSpend = bills.reduce((sum, b) => sum + Number(b.amount || 0), 0);

  // Group by Category
  const categoryTotals = bills.reduce((acc, bill) => {
    const cat = bill.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(bill.amount || 0);
    return acc;
  }, {});

  const categoryColors = {
    Housing: 'bg-blue-500',
    Utilities: 'bg-amber-500',
    Subscriptions: 'bg-purple-500',
    Insurance: 'bg-cyan-500',
    Health: 'bg-emerald-500',
    Credit: 'bg-rose-500',
    Other: 'bg-slate-500',
  };

  const categorySorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // Recurring Subscriptions ("Zombie Hunter")
  const subscriptions = bills.filter(b => b.category === 'Subscriptions' || b.category === 'Health');
  const monthlySubscriptionTotal = subscriptions.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const annualSubscriptionRunRate = monthlySubscriptionTotal * 12;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Analytics & Spending Intelligence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Insights on recurring obligations, category distribution, and run-rates
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          {['monthly', 'annual'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                timeframe === t
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t} View
            </button>
          ))}
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Monthly Spend
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums text-slate-900 dark:text-white">
              ${totalSpend.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> 3.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Compared to $2,225.00 last month</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Subscriptions Run-Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums text-purple-600 dark:text-purple-400">
              ${annualSubscriptionRunRate.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-500">/ yr</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across {subscriptions.length} active recurring plans</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Average Commitment / Bill
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums text-slate-900 dark:text-white">
              ${(totalSpend / Math.max(1, bills.length)).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-500">avg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{bills.length} managed obligations</p>
        </div>
      </div>

      {/* Category Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Visual Bars */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-500" />
              <span>Outflows by Category</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              100% Allocated
            </span>
          </div>

          {/* Segmented Stacked Bar */}
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
            {categorySorted.map(([cat, amount]) => {
              const pct = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
              const colorClass = categoryColors[cat] || 'bg-slate-400';
              return (
                <div
                  key={cat}
                  style={{ width: `${pct}%` }}
                  className={`h-full ${colorClass} transition-all duration-500`}
                  title={`${cat}: $${amount.toFixed(2)} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          {/* Category List with Individual Progress */}
          <div className="space-y-3 pt-2">
            {categorySorted.map(([cat, amount]) => {
              const pct = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
              const colorClass = categoryColors[cat] || 'bg-slate-400';

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                      <span>{cat}</span>
                    </div>
                    <div className="tabular-nums">
                      <span className="text-slate-900 dark:text-white font-black">${amount.toFixed(2)}</span>
                      <span className="text-slate-400 font-normal ml-2">({pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colorClass} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zombie Subscription Detector */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                  🧟
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Zombie Subscription Hunter
                  </h3>
                  <p className="text-[11px] text-slate-500">Unused or rising charges</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300">
                2 Alerts
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                  <span>Equinox Fitness Club</span>
                  <span className="tabular-nums">$180.00 / mo</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  ⚠️ 0 gym check-ins detected this month. Potential savings: <strong>$2,160 / yr</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>Netflix Premium 4K</span>
                  <span className="tabular-nums">$22.99 / mo</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Plan rate increased by $3.00 last month. Consider splitting or switching tier.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
            <strong>Pro Tip:</strong> Pausing 1 subscription lowers your annual commitments by an average of $260.
          </div>
        </div>

      </div>

    </div>
  );
}
