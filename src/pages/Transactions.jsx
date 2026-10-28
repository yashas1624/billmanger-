/** Transactions History */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../App';
import { SectionHeader } from '../components/common/UI';
import TransactionItem from '../components/transactions/TransactionItem';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'credit', label: 'Received' },
  { id: 'debit', label: 'Sent & Bills' },
];

export default function Transactions() {
  const { transactions } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <div className="px-4 pb-24">
      <SectionHeader title="Transaction History" subtitle="Track all your payments" />

      <div className="px-4 mb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition ${isActive ? 'bg-paytm text-white shadow-sm' : 'bg-gray100 text-gray600 hover:bg-gray200'}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-0 px-4">
        {filtered.length > 0 ? (
          filtered.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))
        ) : (
          <div className="px-4 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray100 flex items-center justify-center mx-auto mb-3 text-gray300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </div>
            <p className="text-sm font-medium text-gray700">No transactions yet</p>
            <p className="mt-0.5 text-xs text-gray500">Start making payments to see them here.</p>
          </div>
        )}
      </div>

      <div className="px-4 py-6 text-center">
        <Link to="home">
          <button className="text-xs font-medium text-paytm underline underline-offset-4">← Back to Home</button>
        </Link>
      </div>
    </div>
  );
}
