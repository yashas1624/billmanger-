import React from 'react';

export default function OfferCard({ offer }) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <img src={offer.image} alt={offer.title} className="w-full h-20 object-cover rounded-xl bg-gray-100" />
      <div>
        <span className="text-[10px] font-bold text-paytm tracking-wide uppercase">{offer.tag}</span>
        <h4 className="mt-0.5 text-sm font-bold text-gray-800 leading-snug">{offer.title}</h4>
        <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{offer.subtitle}</p>
      </div>
    </div>
  );
}
