import React from 'react';
import { useBills } from '../context/BillContext';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function Toast() {
  const { toast, undo, hasUndo } = useBills();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-xs sm:text-sm font-semibold">{toast}</span>

      {hasUndo && (
        <button
          onClick={undo}
          className="ml-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Undo</span>
        </button>
      )}
    </div>
  );
}
