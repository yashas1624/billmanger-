/**
 * Wallet Card — Paytm balance display with gradient design
 */
import React from 'react';
import { Link } from '../../App';
import { formatINR } from '../../utils/formatters';
import { Icon } from '../common/Icons';

export default function WalletCard({ balance, onAddMoney }) {
  return (
    <section className="px-4 pt-4 pb-6">
      {/* Wallet Balance Card */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-paytm via-paytm-dark to-[#002d66] p-6 text-white shadow-lg shadow-paytm">
        {/* Decorative ambient glows */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-white/5 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white/90 text-sm font-medium tracking-wide uppercase">Paytm Wallet</p>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <h2 className="mt-0.5 text-4xl md:text-5xl font-bold tracking-tight">
              {formatINR(balance)}
            </h2>
            <p className="mt-1 text-xs text-white/80">
              Linked: HDFC Bank •••• 1234 • UPI: yashas.s@paytm
            </p>
          </div>
          <div className="flex items-end gap-2">
            <Link to="add-money">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all active:scale-95 shadow-sm">
                <Icon name="money" size="18" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Quick Actions Grid — 4 columns with icon + label
 */
export function QuickActions({ actions, onAction }) {
  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction?.(action.id)}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-paytm/30 hover:shadow-sm transition-all active:scale-95 text-left w-full"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 text-paytm shadow-sm">
              <Icon name={action.icon} size="20" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
