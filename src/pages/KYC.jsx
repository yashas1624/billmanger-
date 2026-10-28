/** KYC & Profile */
import React, { useState } from 'react';
import { Link } from '../App';
import { SectionHeader, Button, Input, Card } from '../components/common/UI';
import { Icon } from '../components/common/Icons';
import { validateName, validateEmail } from '../utils/validators';

export default function KYC() {
  const [name, setName] = useState('Yashas S');
  const [email, setEmail] = useState('yashas.s@example.com');

  const handleSave = (e) => {
    e.preventDefault();
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    if (!nameErr.valid || !emailErr.valid) return;
    alert('Profile updated successfully');
  };

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <button
        onClick={() => {}}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-paytm hover:underline"
      >
        <Icon name="arrowLeft" size="16" /> Back to settings
      </button>

      <SectionHeader title="Profile & KYC" subtitle="Manage your personal details" />

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Mobile Number"
            placeholder="+91 98765 43210"
            readOnly
            className="bg-gray100 text-gray500"
          />

          <div className="pt-4 border-t border-gray100">
            <h4 className="text-xs font-bold text-gray500 uppercase tracking-wider mb-3">KYC Status</h4>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm font-medium text-success">KYC Verified</span>
            </div>
            <p className="mt-1 text-xs text-gray500">Your identity is verified. You can use all Paytm features.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-paytm text-white font-semibold hover:bg-paylm-dark transition"
          >
            Save Changes
          </button>
        </form>
      </Card>
    </div>
  );
}
