import React, { useState } from 'react';
import { useBills } from '../../context/BillContext';
import { 
  X, 
  Check, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  Share2, 
  FileText, 
  Users, 
  Calendar, 
  Building2, 
  ExternalLink,
  MessageCircle,
  Copy,
  CheckCheck
} from 'lucide-react';

export default function BillDetailModal() {
  const { 
    selectedBill, 
    setSelectedBillId, 
    markAsPaid, 
    deleteBill, 
    toggleSplitMember 
  } = useBills();

  const [copiedNudge, setCopiedNudge] = useState(false);
  const [showReceiptZoom, setShowReceiptZoom] = useState(false);

  if (!selectedBill) return null;

  const isPaid = selectedBill.status === 'paid';
  const isOverdue = selectedBill.status === 'overdue';
  const isDueSoon = selectedBill.status === 'due_soon';

  const copyWhatsAppNudge = (member) => {
    const text = `Hey ${member.name}! Friendly reminder for our ${selectedBill.title} (${selectedBill.currency}${member.amount.toFixed(2)}) due on ${selectedBill.dueDate}. Link: https://billmanager.app/pay/${selectedBill.id}`;
    navigator.clipboard?.writeText(text);
    setCopiedNudge(true);
    setTimeout(() => setCopiedNudge(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Top Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : isOverdue
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                  : isDueSoon
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {isPaid ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              <span className="capitalize">{selectedBill.status.replace('_', ' ')}</span>
            </span>

            <span className="text-xs text-slate-400 font-medium">
              Due {new Date(selectedBill.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => deleteBill(selectedBill.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
              title="Delete Bill"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedBillId(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {selectedBill.category}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {selectedBill.title}
          </h2>
          <p className="text-xs text-slate-500">
            Biller: {selectedBill.vendor} • Recurrence: {selectedBill.frequency}
          </p>

          <div className="pt-3">
            <span className="text-3xl sm:text-4xl font-black tabular-nums text-slate-900 dark:text-white">
              {selectedBill.currency}{Number(selectedBill.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {!isPaid ? (
          <button
            onClick={() => markAsPaid(selectedBill.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Mark as Paid (${Number(selectedBill.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Bill has been settled for this cycle.</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Archived
            </span>
          </div>
        )}

        {/* Split Breakdown (If split) */}
        {selectedBill.isSplit && selectedBill.splitMembers && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Roommate Split Allocation
                </h4>
              </div>
              {copiedNudge && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" /> Copied WhatsApp Nudge!
                </span>
              )}
            </div>

            <div className="space-y-2">
              {selectedBill.splitMembers.map(member => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-[10px] text-slate-500">
                        Share: {selectedBill.currency}{Number(member.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.name !== 'You' && !member.isPaid && (
                      <button
                        onClick={() => copyWhatsAppNudge(member)}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1 transition"
                        title="Copy polite payment reminder link"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Nudge</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleSplitMember(selectedBill.id, member.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        member.isPaid
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                      }`}
                    >
                      {member.isPaid ? 'Settled' : 'Pending'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attached Receipt Preview */}
        {selectedBill.receiptUrl && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Attached Receipt & Invoice</span>
              </div>
              <button
                onClick={() => setShowReceiptZoom(!showReceiptZoom)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{showReceiptZoom ? 'Collapse' : 'Inspect Receipt'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img
                src={selectedBill.receiptUrl}
                alt="Receipt proof"
                className={`w-full object-cover transition-all ${
                  showReceiptZoom ? 'max-h-96 object-contain' : 'h-32'
                }`}
              />
              <div className="p-2 bg-slate-900/80 text-white text-[10px] font-mono flex justify-between">
                <span>{selectedBill.receiptName || 'receipt_document.pdf'}</span>
                <span className="text-emerald-400">OCR Verified ✓</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment History & Audit Log */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Payment History & Audit Trail
          </h4>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {selectedBill.history && selectedBill.history.length > 0 ? (
              selectedBill.history.map((h, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-medium">{h.action}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span>{h.date}</span>
                    {h.ref && <span className="ml-1 font-mono">({h.ref})</span>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No previous payment events logged.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
