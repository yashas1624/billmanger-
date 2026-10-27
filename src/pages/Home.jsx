import React from 'react';
import { Link } from '../App';
import WalletCard from '../components/WalletCard';
import SectionHeader from '../components/SectionHeader';
import TransactionItem from '../components/TransactionItem';
import OfferCard from '../components/OfferCard';
import { TRANSACTIONS, OFFERS } from '../data/mockData';

export default function Home() {
  return (
    <div className="px-4 pb-24">
      <WalletCard />

      <SectionHeader title="Recent Transactions" subtitle="" />

      <div className="space-y-0">
        {TRANSACTIONS.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} />
        ))}
        <div className="px-4 py-3 text-center">
          <Link to="transactions">
            <button className="text-xs font-medium text-paytm underline underline-offset-4">
              View all transactions →
            </button>
          </Link>
        </div>
      </div>

      <SectionHeader title="Offers & Cashback" subtitle="Save on every payment" />

      <div className="grid grid-cols-2 gap-3">
        {OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
