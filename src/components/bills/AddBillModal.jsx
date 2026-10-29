import React, { useState } from 'react';
import { useBills } from '../../context/BillContext';
import { CATEGORIES } from '../../data/mockBills';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  Check, 
  Users, 
  FileText, 
  Calendar, 
  Clock, 
  Tag, 
  Building2,
  AlertCircle
} from 'lucide-react';

export default function AddBillModal() {
  const { isAddModalOpen, setIsAddModalOpen, addBill } = useBills();

  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [frequency, setFrequency] = useState('Monthly');
  const [reminderDays, setReminderDays] = useState(3);
  const [notes, setNotes] = useState('');
  
  // OCR Parsing Simulation State
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [attachedReceipt, setAttachedReceipt] = useState(null);

  // Split States
  const [isSplit, setIsSplit] = useState(false);
  const [roommate1, setRoommate1] = useState('Alex Chen');
  const [roommate2, setRoommate2] = useState('Maya Lin');

  if (!isAddModalOpen) return null;

  // OCR Auto-Parsing Simulation
  const simulateOCRScan = (fileName) => {
    setIsScanningOCR(true);
    setOcrSuccess(false);

    setTimeout(() => {
      setIsScanningOCR(false);
      setOcrSuccess(true);
      setTitle('Metronet Fiber Internet');
      setVendor('Metronet Broadband');
      setAmount('75.00');
      setCategory('Utilities');
      setFrequency('Monthly');
      setAttachedReceipt({
        name: fileName || 'invoice_scan_oct.pdf',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
      });
    }, 1400);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateOCRScan(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const numAmount = parseFloat(amount);
    let splitMembers = [];

    if (isSplit) {
      const share = numAmount / 2;
      splitMembers = [
        { id: 'u1', name: 'You', amount: share, isPaid: true },
        { id: 'u2', name: roommate1 || 'Roommate', amount: share, isPaid: false, avatar: 'RM' }
      ];
    }

    addBill({
      title,
      vendor: vendor || title,
      category,
      amount: numAmount,
      currency: '$',
      dueDate,
      status: 'pending',
      frequency,
      isSplit,
      splitMembers,
      receiptUrl: attachedReceipt?.url || null,
      receiptName: attachedReceipt?.name || null,
      notes,
      reminderDaysBefore: Number(reminderDays)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Create New Bill
            </h2>
            <p className="text-xs text-slate-500">
              Add upcoming obligations and auto-schedule reminders
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OCR Smart Scan Dropzone */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 transition-all hover:border-emerald-500/60">
          {isScanningOCR && (
            <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-xs flex flex-col items-center justify-center z-10">
              <div className="w-full absolute h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-laser" />
              <div className="bg-slate-900/90 text-white px-4 py-2 rounded-xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>AI OCR analyzing invoice fields...</span>
              </div>
            </div>
          )}

          {ocrSuccess ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    ✨ Auto-extracted from {attachedReceipt?.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Vendor, Amount, Category & Recurrence pre-filled.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOcrSuccess(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Drop invoice PDF or receipt snapshot
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Smart OCR auto-detects vendor, total and due dates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition shadow-xs">
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => simulateOCRScan('sample_electric_bill.pdf')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demo Scan</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Amount Hero Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Bill Amount ($) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 text-2xl sm:text-3xl font-black tabular-nums rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Title & Vendor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Bill Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Electric Power"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Vendor / Biller
              </label>
              <input
                type="text"
                placeholder="e.g. Pacific Gas & Electric"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    category === cat.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Recurrence Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="One-time">One-time payment</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
          </div>

          {/* Split Expense Toggle & Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Split this expense with roommates / friends
                </span>
              </div>
              <input
                type="checkbox"
                checked={isSplit}
                onChange={(e) => setIsSplit(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
              />
            </div>

            {isSplit && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                <p className="text-[11px] text-slate-500">
                  Splits equally 50/50. Each person owes: <strong className="text-slate-900 dark:text-white">${amount ? (parseFloat(amount) / 2).toFixed(2) : '0.00'}</strong>
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Roommate Name"
                    value={roommate1}
                    onChange={(e) => setRoommate1(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sticky Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Bill & Set Reminders</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
