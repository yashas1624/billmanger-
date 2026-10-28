/** Help & Support */
import React from 'react';
import { SectionHeader, Card, Button, Input } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

const FAQS = [
  { q: 'How to add money to wallet?', a: 'Go to Home > Add Money, choose amount and payment method.' },
  { q: 'How to send money?', a: 'Tap Send Money, enter UPI ID/mobile, amount, and confirm.' },
  { q: 'How to raise a dispute?', a: 'Go to Transaction History > select transaction > Raise Dispute.' },
  { q: 'Is Paytm KYC mandatory?', a: 'Basic KYC is required for wallet usage above certain limits.' },
];

export default function Help() {
  return (
    <div className="px-4 pb-24 max-w-md mx-auto">
      <SectionHeader title="Help & Support" subtitle="We're here to help" />

      <Card>
        <div className="relative mb-4">
          <Input
            label="Search help"
            placeholder="Search for help topics..."
            className="pl-10"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>

        <h4 className="text-xs font-bold text-gray500 uppercase tracking-wider mb-3">Frequently Asked Questions</h4>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray100 pb-3 last:border-0">
              <p className="text-sm font-medium text-gray800 mb-1">{faq.q}</p>
              <p className="text-xs text-gray500">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray100">
          <h4 className="text-xs font-bold text-gray500 uppercase tracking-wider mb-3">Contact Support</h4>
          <Button className="w-full" variant="outline">
            <Icon name="help" size="18" className="mr-2" /> Chat with Support
          </Button>
          <Button className="w-full mt-2" variant="outline">
            <Icon name="card" size="18" className="mr-2" /> Email Support
          </Button>
        </div>
      </Card>
    </div>
  );
}
