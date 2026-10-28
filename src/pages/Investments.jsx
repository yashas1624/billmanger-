/** Investments */
import React from 'react';
import { SectionHeader, Card, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

const INVESTMENTS = [
  { id: 'gold', label: 'Digital Gold', icon: 'gold', color: '#f1c40f', value: '₹1,250.00', returns: '+8.5%' },
  { id: 'mutual', label: 'Mutual Funds', icon: 'invest', color: '#8e44ad', value: '₹5,000.00', returns: '+12.3%' },
  { id: 'sip', label: 'SIP', icon: 'money', color: '#00b86b', value: '₹500.00/month', returns: 'Active' },
];

export default function Investments() {
  return (
    <div className="px-4 pb-24">
      <SectionHeader title="Investments" subtitle="Grow your money with Paytm" />

      <div className="grid grid-cols-2 gap-3 px-4 mb-8">
        {INVESTMENTS.map((inv) => (
          <Card key={inv.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray50 text-paytm shadow-sm">
                <Icon name={inv.icon} size="20" />
              </div>
              <span className="text-xs font-bold text-gray500">{inv.returns}</span>
            </div>
            <h4 className="text-sm font-bold text-gray800 mb-1">{inv.label}</h4>
            <p className="text-xs text-gray500 mb-3">{inv.value}</p>
            <Button size="sm" className="w-full">Invest Now</Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray800 mb-4">Why invest with Paytm?</h3>
        <ul className="space-y-3 text-sm text-gray600">
          <li className="flex items-center gap-2">
            <Icon name="success" size="16" className="text-success" />
            <span>Start with as little as ₹1</span>
          </li>
          <li className="flex items-center gap-2">
            <Icon name="success" size="16" className="text-success" />
            <span>Zero commission on mutual funds</span>
          </li>
          <li className="flex items-center gap-2">
            <Icon name="success" size="16" className="text-success" />
            <span>24x7 investment tracking</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
