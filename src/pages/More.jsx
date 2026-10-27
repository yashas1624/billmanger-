import React from 'react';
import { Link } from '../App';
import { USER } from '../data/mockData';

const SETTINGS = [
  { label: 'Profile & KYC', icon: 'user' },
  { label: 'Payment Methods', icon: 'card' },
  { label: 'Bank Accounts', icon: 'bank' },
  { label: 'Notification Preferences', icon: 'bell' },
  { label: 'Help & Support', icon: 'help' },
  { label: 'Terms & Privacy', icon: 'document' },
];

export default function More() {
  return (
    <div className="px-4 pb-24 max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-paytm flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {USER.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">{USER.name}</h3>
            <p className="text-xs text-gray-500">{USER.mobile}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">UPI ID: <span className="font-mono text-paytm-dark">{USER.upiId}</span></p>
        <Link to="home">
          <button className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Edit Profile</button>
        </button>
      </div>

      <h3 className="text-sm font-bold text-gray-800 mb-3">Settings</h3>
      <div className="space-y-0">
        {SETTINGS.map((s, i) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-50 last:border-0">
            <Link to="home">
              <button className="w-full py-3.5 px-4 flex items-center justify-between text-left text-gray-700 font-medium hover:bg-gray-50 transition">
                <span className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    {s.icon === 'user' && <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />}
                    {s.icon === 'card' && <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="7" y2="10" /><line x1="1" y1="14" x2="14" y2="14" />}
                    {s.icon === 'bank' && <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><path d="M3 9h18" /><path d="M3 15h18" />}
                    {s.icon === 'bell' && <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />}
                    {s.icon === 'help' && <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12" y2="17" />}
                    {s.icon === 'document' && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />}
                  </svg>
                  {s.label}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="home">
          <button className="text-xs font-medium text-paytm-dark hover:underline">Sign out</button>
        </button>
      </div>
    </div>
  );
}
