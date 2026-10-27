import React from 'react';
import { Link } from '../App';
import SectionHeader from '../components/SectionHeader';
import OfferCard from '../components/OfferCard';
import { OFFERS } from '../data/mockData';

export default function Offers() {
  return (
    <div className="px-4 pb-24">
      <SectionHeader title="Offers &amp; Cashback" subtitle="Earn cashback on every payment" />

      <div className="grid grid-cols-2 gap-3">
        {OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      <div className="mt-8 px-4 py-6 rounded-2xl bg-paytm-light/40 border border-paytm/20 text-center">
        <h4 className="text-sm font-bold text-paytm-dark">New to Paytm?</h4>
        <p className="mt-0.5 text-sm text-gray-600">
          Complete your first transaction and get up to ₹100 cashback.
        </p>
      </div>
    </div>
  );
}
