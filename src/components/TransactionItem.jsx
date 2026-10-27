import React from 'react';
import { Link } from '../App';

const IconByType = ({ type, color }) => {
  const base = 'w-5 h-5 shrink-0';
  if (type === 'credit') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  }
  return (
    <svg className={base} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 17 12 21 16 17" />
      <line x1="12" y1="21" x2="12" y2="9" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
};

export default function TransactionItem({ tx }) {
  const isCredit = tx.type === 'credit';
  return (
    <Link to={`tx/${tx.id}`}>
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCredit ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
            <IconByType type={tx.type} color={tx.color} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{tx.title}</p>
            <p className="text-xs text-gray-500">{tx.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${isCredit ? 'text-success' : 'text-gray-800'}`}>
            {isCredit ? '+' : '-'}{' '}
            {Math.abs(tx.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-400">{tx.date}</p>
        </div>
      </div>
    </Link>
  );
}
