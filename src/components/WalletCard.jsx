import React from 'react';
import { Link } from '../App';
import { WALLET_BALANCE, USER, QUICK_ACTIONS } from '../data/mockData';

export default function WalletCard() {
  return (
    <section className="px-4 pt-4 pb-6">
      {/* Wallet balance card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-paytm via-paytm-dark to-paytm p-5 text-white shadow-lg shadow-paytm/25">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <p className="text-paytm-light/90 text-sm font-medium tracking-wide uppercase">Paytm Wallet</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight">₹{WALLET_BALANCE.toLocaleString()}</h2>
            <p className="mt-1 text-xs text-paytm-light/80">
              {USER.name} • {USER.mobile}
            </p>
          </div>
          <div className="flex items-end gap-2">
            <Link to="add-money">
              <button className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <p className="mt-5 mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Quick Actions</span>
      </p>
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-paytm/20 transition shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={action.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {action.icon === 'send' && (
                <>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </>
              )}
              {action.icon === 'recharge' && (
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              )}
              {action.icon === 'bank' && (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                </>
              )}
              {action.icon === 'ticket' && (
                <path d="M2 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
              )}
              {action.icon === 'insurance' && (
                <path d="M12 2l4 8v9a6 6 0 0 1-6 6c-3.314 0-6-2.686-6-6V10l4-8z" />
              )}
              {action.icon === 'invest' && (
                <>
                  <path d="M10 20v-6l4-4 4 4v6" />
                  <circle cx="12" cy="10" r="2" />
                </>
              )}
              {action.icon === 'gold' && (
                <path d="M12 2L3 7v6l9 5 9-5V7z" />
              )}
              {action.icon === 'request' && (
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              )}
            </svg>
            <span className="text-[11px] font-medium text-gray-600">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
