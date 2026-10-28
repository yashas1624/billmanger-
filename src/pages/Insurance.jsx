/** Insurance */
import React from 'react';
import { SectionHeader, Card, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

const INSURANCE = [
  { id: 'health', label: 'Health Insurance', icon: 'shield', color: '#00b86b', desc: 'Coverage from ₹3 lakhs', price: '₹499/year' },
  { id: 'vehicle', label: 'Vehicle Insurance', icon: 'car', color: '#005bbb', desc: 'Bike & car insurance', price: '₹299/year' },
  { id: 'travel', label: 'Travel Insurance', icon: 'ticket', color: '#ff9500', desc: 'Domestic & international', price: '₹199/trip' },
  { id: 'mobile', label: 'Mobile Insurance', icon: 'mobile', color: '#8e44ad', desc: 'Screen & damage protection', price: '₹99/year' },
];

export default function Insurance() {
  return (
    <div className="px-4 pb-24">
      <SectionHeader title="Insurance" subtitle="Protect what matters most" />

      <div className="grid grid-cols-2 gap-3 px-4">
        {INSURANCE.map((ins) => (
          <Card key={ins.id} className="p-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray50 text-paytm shadow-sm mb-3">
              <Icon name={ins.icon} size="24" />
            </div>
            <h4 className="text-sm font-bold text-gray800 mb-1">{ins.label}</h4>
            <p className="text-xs text-gray500 mb-3">{ins.desc}</p>
            <div className="text-xs font-bold text-gray700 mb-3">{ins.price}</div>
            <Button size="sm" className="w-full">Get Quote</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
