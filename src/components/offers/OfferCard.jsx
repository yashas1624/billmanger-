/**
 * Offer Card
 */
import React from 'react';
import { Image } from 'react';

export default function OfferCard({ offer }) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-gray100 shadow-sm">
      <div className="w-full h-20 rounded-xl bg-gray100 overflow-hidden relative">
        <img
          src={offer.image || `https://via.placeholder.com/120x80/${offer.color.replace('#', '')}/ffffff?text=${encodeURIComponent(offer.tag)}`}
          alt={offer.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-bold text-paylm tracking-wide uppercase">
          {offer.tag}
        </span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray800 leading-snug">{offer.title}</h4>
        <p className="mt-0.5 text-xs text-gray500 leading-relaxed">{offer.subtitle}</p>
      </div>
    </div>
  );
}
