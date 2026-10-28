/**
 * Transaction Item — Paytm-style transaction row
 */
import React from 'react';
import { Link } from '../../App';
import { formatINR, formatDate } from '../../utils/formatters';
import { Icon } from '../common/Icons';
import { Badge } from '../common/UI';

const ICON_BY_CATEGORY = {
  Groceries: 'shopping',
  Wallet: 'money',
  Recharge: 'recharge',
  Cashback: 'cashback',
  Bills: 'electricity',
  P2P: 'send',
  Food: 'money',
  Transport: 'metro',
  Shopping: 'tag',
};

const STATUS_CONFIG = {
  Success: { label: 'Completed', variant: 'success', color: 'text-success bg-success-light' },
  Pending: { label: 'Pending', variant: 'warning', color: 'text-warning bg-warning-light' },
  Failed: { label: 'Failed', variant: 'danger', color: 'text-danger bg-danger-light' },
};

export default function TransactionItem({ tx, onPress }) {
  const isCredit = tx.type === 'credit';
  const status = STATUS_CONFIG[tx.status] || STATUS_CONFIG.Success;

  return (
    <Link to={`tx/${tx.id}`}>
      <div className="px-4 py-3.5 flex items-center justify-between bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all active:bg-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isCredit ? 'bg-success-light text-success' : 'bg-gray-100 text-gray-600'}`}>
            <Icon name={ICON_BY_CATEGORY[tx.category] || 'money'} size="18" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 leading-tight">{tx.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{tx.subtitle}</p>
          </div>
        </div>
        <div className="text-right min-w-[80px]">
          <p className={`text-sm font-semibold ${isCredit ? 'text-success' : 'text-gray-800'}`}>
            {isCredit ? '+' : '-'}{' '}
            {formatINR(Math.abs(tx.amount), { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <Badge variant={status.variant} className="mt-1">{status.label}</Badge>
        </div>
      </div>
    </Link>
  );
}

export function TransactionList({ transactions, emptyMessage }) {
  return (
    <div className="space-y-0">
      {transactions.length > 0 ? (
        transactions.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} />
        ))
      ) : (
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-300">
            <Icon name="history" size="32" />
          </div>
          <p className="text-sm font-medium text-gray-700">{emptyMessage || 'No transactions yet'}</p>
          <p className="mt-0.5 text-xs text-gray-500">Start making payments to see them here.</p>
        </div>
      )}
    </div>
  );
}
