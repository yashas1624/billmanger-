/** Home — Paytm Dashboard */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../App';
import WalletCard, { QuickActions } from '../components/wallet/WalletCard';
import { SectionHeader } from '../components/common/UI';
import TransactionItem, { TransactionList } from '../components/transactions/TransactionItem';
import OfferCard from '../components/offers/OfferCard';
import { Icon } from '../components/common/Icons';
import { OFFERS, QUICK_ACTIONS } from '../data/mockData';

export default function Home() {
  const { wallet, transactions, addNotification } = useApp();
  const [filter, setFilter] = useState('all');

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'credit', label: 'Received' },
    { id: 'debit', label: 'Sent & Bills' },
  ];

  const filteredTx = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

  const handleQuickAction = (id) => {
    if (id === 'scan') {
      addNotification({ title: 'Scanner', message: 'QR scanner opened', variant: 'info' });
    }
  };

  return (
    <div className="px-4 pb-24">
      {/* Wallet */}
      <WalletCard balance={wallet.balance} />

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <QuickActions actions={QUICK_ACTIONS} onAction={handleQuickAction} />

      {/* Recent Transactions */}
      <SectionHeader title="Recent Transactions" />

      {/* Filter chips */}
      <div className="px-4 mb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition ${isActive ? 'bg-paytm text-white shadow-sm' : 'bg-gray100 text-gray600 hover:bg-gray200'}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Transaction List */}
      <TransactionList transactions={filteredTx.slice(0, 5)} />

      <div className="px-4 py-4 text-center">
        <Link to="transactions">
          <button className="text-xs font-medium text-paytm underline underline-offset-4">View all transactions →</button>
        </Link>
      </div>

      {/* Offers */}
      <SectionHeader title="Offers & Cashback" subtitle="Save on every payment" />

      <div className="grid grid-cols-2 gap-3 px-4">
        {OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
