/** Payment Methods */
import React from 'react';
import { SectionHeader, Card } from '../components/common/UI';
import { Icon } from '../components/common/Icons';
import { PAYMENT_METHODS } from '../data/mockData';

export default function PaymentMethods() {
  return (
    <div className="px-4 pb-24 max-w-md mx-auto">
      <SectionHeader title="Payment Methods" subtitle="Manage your payment options" />

      <div className="space-y-3">
        {PAYMENT_METHODS.map((pm) => (
          <Card key={pm.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray50 text-paytm shadow-sm">
                  <Icon name={pm.icon} size="20" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray800">{pm.label}</h4>
                  <p className="text-xs text-gray500">{pm.isDefault ? 'Default payment method' : 'Add to use'}</p>
                </div>
              </div>
              {pm.isDefault && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-success-light text-success">Default</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card className="p-4">
          <h4 className="text-sm font-bold text-gray800 mb-3">Add New Payment Method</h4>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 cursor-pointer hover:bg-gray50 transition">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-paytm-light text-paytm mb-2">
                <Icon name="card" size="18" />
              </div>
              <p className="text-xs font-medium text-gray800">Debit/Credit Card</p>
            </Card>
            <Card className="p-3 cursor-pointer hover:bg-gray50 transition">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-paytm-light text-paytm mb-2">
                <Icon name="bank" size="18" />
              </div>
              <p className="text-xs font-medium text-gray800">Net Banking</p>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}
