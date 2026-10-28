/** Profile & Settings Hub */
import React from 'react';
import { Link } from '../App';
import { SectionHeader, Button, Card } from '../components/common/UI';
import { Icon } from '../components/common/Icons';
import { USER } from '../data/mockData';

const SETTINGS = [
  { label: 'Profile & KYC', icon: 'user', route: 'kyc' },
  { label: 'Bank Accounts', icon: 'bank', route: 'bank-accounts' },
  { label: 'Payment Methods', icon: 'card', route: 'payment-methods' },
  { label: 'Notification Preferences', icon: 'bell', route: 'notifications' },
  { label: 'Help & Support', icon: 'help', route: 'help' },
  { label: 'Terms & Privacy', icon: 'document', route: 'terms' },
];

export default function More() {
  return (
    <div className="px-4 pb-24 max-w-md mx-auto">
      {/* Profile Header */}
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-paytm flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {USER.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray800">{USER.name}</h3>
            <p className="text-xs text-gray500">{USER.mobile}</p>
          </div>
        </div>
        <p className="text-sm text-gray600 mb-3">UPI ID: <span className="font-mono text-paytm-dark">{USER.upiId}</span></p>
        <div className="flex gap-2">
          <Link to="kyc">
            <button className="flex-1 py-2.5 rounded-xl border border-gray200 text-sm font-medium text-gray700 hover:bg-gray50 transition">Edit Profile</button>
          </Link>
          <button className="px-3 py-2.5 rounded-xl border border-gray200 text-gray700 hover:bg-gray50 transition">
            <Icon name="settings" size="18" />
          </button>
        </div>
      </Card>

      {/* Settings */}
      <h3 className="text-sm font-bold text-gray800 mb-3">Settings</h3>
      <div className="space-y-0">
        {SETTINGS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray50 last:border-0">
            <Link to={s.route}>
              <button className="w-full py-3.5 px-4 flex items-center justify-between text-left text-gray700 font-medium hover:bg-gray50 transition">
                <span className="flex items-center gap-2">
                  <Icon name={s.icon} size="18" className="text-gray400 w-5 h-5" />
                  {s.label}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray300"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="home">
          <button className="text-xs font-medium text-paytm-dark hover:underline">Sign out</button>
        </Link>
      </div>
    </div>
  );
}
