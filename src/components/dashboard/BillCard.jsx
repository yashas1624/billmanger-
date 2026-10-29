import React from 'react';
import { useBills } from '../../context/BillContext';
import { 
  Check, 
  Clock, 
  AlertCircle, 
  Users, 
  FileText, 
  ChevronRight,
  Zap,
  Home,
  Tv,
  Shield,
  Activity,
  CreditCard,
  Tag
} from 'lucide-react';

const CATEGORY_MAP = {
  Housing: { icon: Home, bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400' },
  Utilities: { icon: Zap, bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400' },
  Subscriptions: { icon: Tv, bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400' },
  Insurance: { icon: Shield, bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-600 dark:text-cyan-400' },
  Health: { icon: Activity, bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400' },
  Credit: { icon: CreditCard, bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-600 dark:text-rose-400' },
};

export default function BillCard({ bill }) {
  const { markAsPaid, setSelectedBillId } = useBills();

  const catMeta = CATEGORY_MAP[bill.category] || { 
    icon: Tag, 
    bg: 'bg-slate-100 dark:bg-slate-800', 
    text: 'text-slate-600 dark:text-slate-400' 
  };
  const Icon = catMeta.icon;

  const isPaid = bill.status === 'paid';
  const isOverdue = bill.status === 'overdue';
  const isDueSoon = bill.status === 'due_soon';

  const getStatusBadge = () => {
    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
          <Check className="w-3 h-3 stroke-[3]" />
          <span>Paid</span>
        </span>
      );
    }
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
          <AlertCircle className="w-3 h-3" />
          <span>Overdue</span>
        </span>
      );
    }
    if (isDueSoon) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
          <Clock className="w-3 h-3" />
          <span>Due Soon</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <span>Upcoming</span>
      </span>
    );
  };

  const paidSplits = bill.splitMembers ? bill.splitMembers.filter(m => m.isPaid).length : 0;
  const totalSplits = bill.splitMembers ? bill.splitMembers.length : 0;

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        isPaid
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/60 opacity-80 hover:opacity-100'
          : isOverdue
          ? 'bg-rose-50/30 dark:bg-rose-950/15 border-rose-200 dark:border-rose-900/60 shadow-xs'
          : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Icon, Title, Vendor, Metadata */}
        <div 
          onClick={() => setSelectedBillId(bill.id)}
          className="flex items-start sm:items-center gap-3.5 cursor-pointer flex-1"
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${catMeta.bg} ${catMeta.text}`}>
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className={`font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${isPaid ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                {bill.title}
              </h4>
              {getStatusBadge()}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{bill.vendor}</span>
              <span>•</span>
              <span>Due {new Date(bill.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{bill.frequency}</span>

              {/* Receipt Tag */}
              {bill.receiptName && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  <FileText className="w-3 h-3 text-emerald-500" />
                  <span>Receipt</span>
                </span>
              )}

              {/* Split Details */}
              {bill.isSplit && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                  <Users className="w-3 h-3" />
                  <span>Split ({paidSplits}/{totalSplits} paid)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Amount & Quick Pay / View Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total</span>
            <span className="text-lg sm:text-xl font-extrabold tabular-nums text-slate-900 dark:text-white">
              {bill.currency}{Number(bill.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isPaid ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAsPaid(bill.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-xs shadow-emerald-600/30 transition-all"
                title="Mark this bill as paid"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden xs:inline">Mark Paid</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
                Settled
              </span>
            )}

            <button
              onClick={() => setSelectedBillId(bill.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              title="View full breakdown"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
