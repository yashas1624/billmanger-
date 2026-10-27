import React, { useState } from 'react';
import { Link, usePage } from '../App';
import { SearchIcon, HelpIcon, MenuIcon } from './icons';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'send', label: 'Send', icon: 'send' },
  { id: 'qr', label: 'QR', icon: 'qr' },
  { id: 'offers', label: 'Offers', icon: 'offers' },
  { id: 'more', label: 'More', icon: 'more' },
];

const IconByName = ({ name, className }) => {
  const ICONS = {
    home: (props) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    send: (props) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    qr: (props) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <rect x="8" y="8" width="3" height="3" />
        <rect x="16" y="8" width="3" height="3" />
        <rect x="8" y="16" width="3" height="3" />
      </svg>
    ),
    offers: (props) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    more: (props) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  };
  const Comp = ICONS[name];
  return <Comp className={className} />;
};

export default function Layout({ children }) {
  const { page, setPage } = usePage();
  const [menuOpen, setMenuOpen] = useState(false);

  const active = page;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-white/60 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full text-paytm hover:bg-paytm-light transition"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="18" />
              <input
                type="text"
                placeholder="Search bills, recharge & more"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-paytm transition"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition" aria-label="Help & support">
            <HelpIcon />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-paytm flex items-center justify-center text-white font-bold text-xs shadow-sm">
              YS
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute left-4 right-4 top-14 bg-white rounded-xl border border-gray-100 shadow-xl p-3 z-30 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => { setPage('home'); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </button>
          <button
            onClick={() => { setPage('send'); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send Money
          </button>
          <button
            onClick={() => { setPage('recharge'); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
            Recharge & Bills
          </button>
          <button
            onClick={() => { setPage('offers'); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Offers & Cashback
          </button>
          <button
            onClick={() => { setPage('more'); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            Profile & Settings
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto overscroll-behavior-contain">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="sticky bottom-0 z-30 h-14 border-t border-gray-200 bg-white/95 backdrop-blur-md flex items-center justify-around px-2 gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center justify-center gap-1 p-1.5 rounded-full transition ${
                isActive
                  ? 'bg-paytm text-white'
                  : 'text-gray-400 hover:text-paytm hover:bg-gray-50'
              }`}
              aria-pressed={isActive}
            >
              <IconByName name={item.icon} className={`${isActive ? 'text-white' : 'text-gray-400'} w-5 h-5`} />
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-bold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
