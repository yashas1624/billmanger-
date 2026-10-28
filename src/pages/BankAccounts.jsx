/** Bank Accounts */
import React from 'react';
import { Link } from '../App';
import { SectionHeader, Card, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';
import { BANK_ACCOUNTS } from '../data/mockData';

export default function BankAccounts() {
  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <button
        onClick={() => {}}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-paytm hover:underline"
      >
        <Icon name="arrowLeft" size="16" /> Back to settings
      </button>

      <SectionHeader title="Bank Accounts" subtitle="Manage linked bank accounts" />

      <div className="space-y-3">
        {BANK_ACCOUNTS.map((acc) => (
          <Card key={acc.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray800">{acc.bank}</h4>
                <p className="text-xs text-gray500">{acc.accountNumber} • {acc.ifsc}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray800">{acc.isPrimary ? 'Primary' : 'Secondary'}</p>
                <p className="text-xs text-gray500">{acc.type}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Set Primary</Button>
              <Button variant="outline" size="sm">Remove</Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button className="w-full py-3 rounded-xl border-2 border-dashed border-gray300 text-gray500 hover:border-paytm hover:text-paytm transition">
          <Icon name="bank" size="20" className="mr-2" />
          Add Bank Account
        </Button>
      </div>
    </div>
  );
}
