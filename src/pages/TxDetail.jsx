import React from 'react';
import { Link, usePage } from '../App';
import { TRANSACTIONS } from '../data/mockData';

export default function TxDetail({ txId }) {
  const { setPage } = usePage();
  const tx = TRANSACTIONS.find((t) => t.id === txId);
  const isCredit = tx?.type === 'credit';

  if (!tx) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="text-gray-500">Transaction not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <button
        onClick={() => setPage('transactions')}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-paytm hover:underline"
      >
        ← Back to transactions
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${isCredit ? 'bg-success-light' : 'bg-danger-light'}`}>
            <svg
              className={`w-6 h-6 ${isCredit ? 'text-success' : 'text-danger'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isCredit ? (
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              ) : (
                <>
                  <polyline points="8 17 12 21 16 17" />
                  <line x1="12" y1="21" x2="12" y2="9" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </>
              )}
            </svg>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            tx.status === 'Success' ? 'bg-success-light text-success' : 'bg-gray-100 text-gray-600'
          }`}>
            {tx.status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-1">{tx.title}</h3>
        <p className="text-sm text-gray-500 mb-5">{tx.subtitle}</p>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Amount</span>
            <span className={`font-bold ${isCredit ? 'text-success' : 'text-gray-800'}`}>
              {isCredit ? '+' : '-'} ₹{Math.abs(tx.amount).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Date &amp; time</span>
            <span>{tx.date}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Type</span>
            <span className="font-medium capitalize">{tx.type}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Status</span>
            <span>{tx.status}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>UPI ID</span>
            <span className="text-mono text-xs">yashas.s@paytm</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link to="transactions">
          <button className="py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition">Done</button>
        </Link>
        <Link to="send">
          <button className="py-2.5 rounded-xl bg-paytm text-white font-medium hover:bg-paytm-dark transition">Send Money</button>
        </Link>
      </div>
    </div>
  );
}
