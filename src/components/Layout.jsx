/**
 * Layout — Top bar, bottom navigation, mobile menu
 * Paytm-style app shell with glassmorphism and smooth transitions
 */
import React, { useState } from 'react';
import { Link, usePage } from '../App';
import { Icon } from './common/Icons';
import { Button } from './common/UI';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'send', label: 'Send', icon: 'send' },
  { id: 'qr', label: 'QR', icon: 'scan' },
  { id: 'offers', label: 'Offers', icon: 'tag' },
  { id: 'more', label: 'More', icon: 'more' },
];

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'send', label: 'Send Money', icon: 'send' },
  { id: 'receive', label: 'Receive Money', icon: 'receive' },
  { id: 'recharge', label: 'Recharge & Bills', icon: 'recharge' },
  { id: 'postpaid', label: 'Postpaid Bills', icon: 'postpaid' },
  { id: 'offers', label: 'Offers & Cashback', icon: 'tag' },
  { id: 'qr', label: 'QR Scanner', icon: 'scan' },
  { id: 'investments', label: 'Investments', icon: 'invest' },
  { id: 'insurance', label: 'Insurance', icon: 'shield' },
  { id: 'travel', label: 'Travel', icon: 'ticket' },
  { id: 'movies', label: 'Movies & Events', icon: 'movie' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'more', label: 'Profile & Settings', icon: 'more' },
];

export default function Layout({ children }) {
  const { page, setPage } = usePage();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = page;

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-white/60 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-xl text-paytm hover:bg-paytm-light transition"
            aria-label="Open menu"
          >
            <Icon name="menu" size="24" />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon name="search" size="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bills, recharge & more"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-paytm/50 focus:border-paytm transition"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" aria-label="Notifications">
            <Icon name="bell" size="20" />
          </Button>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-paytm flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-paytm">
              YS
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-4 right-4 top-14 bg-white rounded-2xl border border-gray-100 shadow-xl p-3 z-30 animate-in fade-in slide-in-from-top-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
            >
              <Icon name={item.icon} size="18" className={`w-5 h-5 ${active === item.id ? 'text-paytm' : 'text-gray-500'}`} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-y-auto overscroll-behavior-contain">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-30 h-16 border-t border-gray-200 bg-white/95 backdrop-blur-md flex items-center justify-around px-2 gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-paytm text-white shadow-paytm' : 'text-gray-400 hover:text-paytm hover:bg-gray-50'
              }`}
              aria-pressed={isActive}
            >
              <Icon name={item.icon} className={`${isActive ? 'text-white' : 'text-gray-400'} w-5 h-5`} />
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
