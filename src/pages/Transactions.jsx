import React, { useState } from 'react';
import { Link } from '../App';
import SectionHeader from '../components/SectionHeader';
import TransactionItem from '../components/TransactionItem';
import { TRANSACTIONS } from '../data/mockData';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'credit', label: 'Received' },
  { id: 'debit', label: 'Sent & Bills' },
];

export default function Transactions() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter((t) => t.type === filter);

  return (
    <div className="px-4 pb-24">
      <SectionHeader title="Transaction History" subtitle="Track all your payments" />

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition ${
                isActive
                  ? 'bg-paytm text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-0">
        {filtered.length > 0 ? (
          filtered.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))
        ) : (
          <div className="px-4 py-12 text-center">
            <svg width="48" height="48" className="mx-auto text-gray-200 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            <p className="text-sm font-medium text-gray-700">No transactions yet</p>
            <p className="mt-0.5 text-xs text-gray-500">Start sending money or paying bills to see them here.</p>
          </div>
        )}
      </div>

      <div className="px-4 py-6 text-center">
        <Link to="home">
          <button className="text-xs font-medium text-paytm underline underline-offset-4">← Back to Home</button>
        </button>
      </div>
    </div>
  );
}
