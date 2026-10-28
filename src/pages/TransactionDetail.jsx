/** Transaction Detail */
import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../App';
import { formatINR, formatDate } from '../utils/formatters';
import { Icon } from '../components/common/Icons';
import { Card, Button } from '../components/common/UI';

export default function TxDetail({ txId }) {
  const { transactions } = useApp();
  const tx = transactions.find((t) => t.id === txId);
  const isCredit = tx?.type === 'credit';

  if (!tx) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="text-gray500">Transaction not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <button
        onClick={() => {}}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-paytm hover:underline"
      >
        <Icon name="arrowLeft" size="16" /> Back to transactions
      </button>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${isCredit ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
            <svg className={`w-6 h-6 ${isCredit ? 'text-success' : 'text-danger'}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              {isCredit ? <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> : (
                <>
                  <polyline points="8 17 12 21 16 17" />
                  <line x1="12" y1="21" x2="12" y2="9" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </>
              )}
            </svg>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tx.status === 'Success' ? 'bg-success-light text-success' : 'bg-gray100 text-gray600'}`}>
            {tx.status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray800 mb-1">{tx.title}</h3>
        <p className="text-sm text-gray500 mb-5">{tx.subtitle}</p>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray600">
            <span>Amount</span>
            <span className={`font-bold ${isCredit ? 'text-success' : 'text-gray800'}`}>
              {isCredit ? '+' : '-'} ₹{Math.abs(tx.amount).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-gray600">
            <span>Date & time</span>
            <span>{formatDate(tx.date)}</span>
          </div>
          <div className="flex justify-between text-gray600">
            <span>Type</span>
            <span className="font-medium capitalize">{tx.type}</span>
          </div>
          <div className="flex justify-between text-gray600">
            <span>Status</span>
            <span>{tx.status}</span>
          </div>
          {tx.reference && (
            <div className="flex justify-between text-gray600">
              <span>Reference ID</span>
              <span className="text-mono text-xs">{tx.reference}</span>
            </div>
          )}
          {tx.upiId && (
            <div className="flex justify-between text-gray600">
              <span>UPI ID</span>
              <span className="text-mono text-xs text-paytm">{tx.upiId}</span>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Link to="transactions">
            <button className="py-2.5 rounded-xl border border-gray200 text-gray700 font-medium hover:bg-gray50 transition">Done</button>
          </Link>
          <Link to="send">
            <button className="py-2.5 rounded-xl bg-paytm text-white font-medium hover:bg-paylm-dark transition">Send Money</button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
