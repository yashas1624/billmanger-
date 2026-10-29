import React from 'react';
import { useBills } from '../../context/BillContext';
import { 
  Clock, 
  AlertTriangle, 
  Check, 
  ChevronRight, 
  Flame,
  Zap,
  Tv,
  Home,
  Shield,
  Activity,
  CreditCard,
  FileText
} from 'lucide-react';

const CATEGORY_ICONS = {
  Housing: Home,
  Utilities: Zap,
  Subscriptions: Tv,
  Insurance: Shield,
  Health: Activity,
  Credit: CreditCard,
};

export default function UrgentHorizon() {
  const { bills, markAsPaid, setSelectedBillId } = useBills();

  // Urgent bills: status is 'due_soon' or 'overdue'
  const urgentBills = bills.filter(b => b.status === 'due_soon' || b.status === 'overdue');

  if (urgentBills.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              You're all caught up for the next 7 days!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No bills require immediate attention. Enjoy your peace of mind.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getDaysDiff = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Urgent Horizon <span className="text-xs text-slate-500 font-normal">Next 7 Days</span>
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {urgentBills.length} need action
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {urgentBills.map(bill => {
          const days = getDaysDiff(bill.dueDate);
          const isOverdue = bill.status === 'overdue' || days < 0;
          const CategoryIcon = CATEGORY_ICONS[bill.category] || FileText;

          return (
            <div
              key={bill.id}
              className={`snap-start min-w-[280px] sm:min-w-[310px] p-4 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                isOverdue
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-amber-400/60'
              }`}
            >
              <div>
                {/* Header: Urgency Badge & Category Icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isOverdue
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                    }`}
                  >
                    {isOverdue ? (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        <span>Past Due by {Math.abs(days)}d</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>{days === 0 ? 'Due Today' : `Due in ${days} day${days > 1 ? 's' : ''}`}</span>
                      </>
                    )}
                  </span>

                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bill Title & Vendor */}
                <h4 
                  onClick={() => setSelectedBillId(bill.id)}
                  className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  {bill.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {bill.vendor} • {bill.category}
                </p>
              </div>

              {/* Bottom: Amount & Quick Pay Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Amount</span>
                  <span className="text-lg font-black tabular-nums text-slate-900 dark:text-white">
                    {bill.currency}{Number(bill.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => markAsPaid(bill.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/30 active:scale-95 transition"
                    title="Mark this bill as paid"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Pay</span>
                  </button>

                  <button
                    onClick={() => setSelectedBillId(bill.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition"
                    title="View bill breakdown"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
