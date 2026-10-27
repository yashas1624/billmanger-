import React, { useState } from 'react';
import { Link } from '../App';
import SectionHeader from '../components/SectionHeader';
import { BILLERS } from '../data/mockData';

const ICON_BY_BILLER = {
  mobile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" /><line x1="10" y1="13" x2="14" y2="13" />
    </svg>
  ),
  dth: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="14" rx="2" ry="2" /><circle cx="12" cy="11" r="2" />
    </svg>
  ),
  electricity: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  water: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-4a7 7 0 0 0-7-7Z" /><path d="M9 12l3 3 5-5" />
    </svg>
  ),
  gas: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="3" width="8" height="14" rx="2" ry="2" /><path d="M12 17v-4M10 15h4M12 11v4" />
    </svg>
  ),
  broadband: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h.01" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M10.2 6.7a4.6 4.6 0 0 1 3.6 0" />
    </svg>
  ),
  landline: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 5-5 5-5 5s-5 0-5-5 5-5 5-5 5 0 5 5z" />
    </svg>
  ),
  creditcard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="7" y2="10" /><line x1="1" y1="14" x2="14" y2="14" />
    </svg>
  ),
  fastag: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" /><polyline points="10 13 14 9 18 15" />
    </svg>
  ),
};

export default function Recharge() {
  const [biller, setBiller] = useState(null);
  const [provider, setProvider] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');

  const providers = biller ? BILLERS.find((b) => b.id === biller).items : [];

  const handleProceed = (e) => {
    e.preventDefault();
    if (!provider || !account || !amount) return;
    alert(`Proceeding to pay ₹${amount} for ${provider} (${account})`);
  };

  return (
    <div className="px-4 pb-24 max-w-xl mx-auto">
      <SectionHeader title="Recharge &amp; Bills" subtitle="Pay utilities, recharge &amp; more" />

      {biller ? (
        <form onSubmit={handleProceed} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-1">
            <Link to="recharge">
              <button className="text-xs font-medium text-gray-600 hover:text-paytm">← Back</button>
            </Link>
            <span className="text-xs font-bold text-paytm uppercase tracking-wider">{biller.charAt(0).toUpperCase() + biller.slice(1)}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Service provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-paytm/20 transition"
            >
              <option value="">Select provider</option>
              {providers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Account / mobile number</label>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Enter number"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-paytm/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-paytm/20 focus:border-paytm transition"
            />
          </div>

          <button
            type="submit"
            disabled={!provider || !account || !amount}
            className={`w-full py-3.5 rounded-xl font-semibold text-lg transition shadow-sm ${
              !provider || !account || !amount
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-paytm text-white hover:bg-paytm-dark'
            }`}
          >
            Pay Now
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {BILLERS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBiller(b.id)}
              className="flex flex-col items-center gap-2 p-3.5 rounded-2xl border border-gray-100 bg-white hover:border-paytm/40 hover:bg-paytm-light/30 transition shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-paytm-light flex items-center justify-center text-paytm">
                {ICON_BY_BILLER[b.id]}
              </div>
              <span className="text-xs font-bold text-gray-800 leading-tight text-center">{b.label}</span>
              <span className="text-[10px] text-gray-400">{b.items.length} providers</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
