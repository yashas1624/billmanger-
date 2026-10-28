/** Receive Money — QR Code & UPI Share */
import React from 'react';
import { Link } from '../App';
import { SectionHeader, Card, Button, Input } from '../components/common/UI';
import { Icon } from '../components/common/Icons';
import { USER } from '../data/mockData';

export default function ReceiveMoney() {
  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <SectionHeader title="Receive Money" subtitle="Share your UPI ID or QR code" />

      <Card className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-white border border-gray200 shadow-sm mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-paytm">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <rect x="8" y="8" width="3" height="3" />
            <rect x="16" y="8" width="3" height="3" />
            <rect x="8" y="16" width="3" height="3" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray800 mb-1">Scan to Pay</h3>
        <p className="text-sm text-gray500 mb-6">Others can scan this QR to send you money</p>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <Input placeholder="Copy UPI ID" value={USER.upiId} readOnly className="flex-1 bg-white" />
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(USER.upiId)}>
              <Icon name="copy" size="16" /> Copy
            </Button>
          </div>
        </Card>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Button variant="outline" className="py-3">
            <Icon name="whatsapp" size="18" className="text-[#25d366]" /> WhatsApp
          </Button>
          <Button variant="outline" className="py-3">
            <Icon name="send" size="18" className="text-paytm" /> SMS
          </Button>
          <Button variant="outline" className="py-3">
            <Icon name="copy" size="18" className="text-gray600" /> Copy
          </Button>
        </div>

        <div className="mt-6">
          <p className="text-xs text-gray400 mb-2">Your UPI ID</p>
          <div className="bg-gray50 p-3 rounded-xl font-mono text-sm text-gray700 border border-gray100">{USER.upiId}</div>
        </div>
      </Card>
    </div>
  );
}
