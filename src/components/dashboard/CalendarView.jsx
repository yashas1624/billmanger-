import React, { useState } from 'react';
import { useBills } from '../../context/BillContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, Clock, AlertCircle } from 'lucide-react';

export default function CalendarView() {
  const { bills, setSelectedBillId, markAsPaid } = useBills();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group bills by due date string "YYYY-MM-DD"
  const billsByDate = bills.reduce((acc, bill) => {
    const key = bill.dueDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(bill);
    return acc;
  }, {});

  const selectedDayBills = billsByDate[selectedDate] || [];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-slate-500">Tap a day to inspect scheduled outflows</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Empty cells before 1st of month */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-16 rounded-xl bg-slate-50/40 dark:bg-slate-900/20" />
        ))}

        {/* Days of Month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          const dayBills = billsByDate[dateStr] || [];
          const hasOverdue = dayBills.some(b => b.status === 'overdue');
          const hasDueSoon = dayBills.some(b => b.status === 'due_soon');
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`min-h-[64px] p-1.5 rounded-xl text-left border flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                  : 'border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${
                  isToday 
                    ? 'w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center'
                    : isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {dayNum}
                </span>

                {dayBills.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-400">
                    {dayBills.length}
                  </span>
                )}
              </div>

              {/* Status Indicator Dots */}
              <div className="flex flex-wrap gap-1 mt-1">
                {dayBills.slice(0, 3).map((b, idx) => (
                  <span 
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      b.status === 'paid'
                        ? 'bg-emerald-500'
                        : b.status === 'overdue'
                        ? 'bg-rose-500 ring-1 ring-rose-300'
                        : b.status === 'due_soon'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    title={`${b.title}: $${b.amount}`}
                  />
                ))}
                {dayBills.length > 3 && (
                  <span className="text-[9px] font-bold text-slate-400">+{dayBills.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Outflow Panel */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700/60">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Bills Due on {selectedDate}
        </h4>

        {selectedDayBills.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
            No bills scheduled for this date.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedDayBills.map(bill => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800"
              >
                <div 
                  onClick={() => setSelectedBillId(bill.id)}
                  className="cursor-pointer space-y-0.5"
                >
                  <p className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-500">
                    {bill.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {bill.vendor} • {bill.category}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                    {bill.currency}{Number(bill.amount).toFixed(2)}
                  </span>

                  {bill.status !== 'paid' ? (
                    <button
                      onClick={() => markAsPaid(bill.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3 h-3" />
                      <span>Pay</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
