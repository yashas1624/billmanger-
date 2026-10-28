/** Add Money — Wallet Top-up */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../App';
import { validateAmount } from '../utils/validators';
import { SectionHeader, Button, Input, Card } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

const AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AddMoney() {
  const { addMoney, addNotification } = useApp();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!amount) return;
    const newBalance = addMoney(Number(amount), method === 'upi' ? 'UPI' : 'Debit/Credit Card');
    addNotification({
      title: 'Money Added',
      message: `₹${amount} added to your wallet`,
      variant: 'success',
    });
  };

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <button
        onClick={() => {}}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-paytm hover:underline"
      >
        <Icon name="arrowLeft" size="16" /> Back to wallet
      </button>

      <Card>
        <h3 className="text-lg font-bold text-gray800 mb-6">Add Money to Wallet</h3>

        <div>
          <label className="block text-xs font-semibold text-gray500 mb-2">Amount (₹)</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(String(a))}
                className={`py-3 rounded-xl border text-sm font-medium transition ${amount === String(a) ? 'border-paytm bg-paytm-light/20 text-paytm' : 'border-gray200 bg-gray50 text-gray700 hover:border-paytm/30'}`}
              >
                {a}
              </button>
            ))}
          </div>
          <Input
            type="number"
            placeholder="Custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-4"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray500 mb-2">Payment method</label>
          <div className="grid grid-cols-2 gap-3">
            {['upi', 'card'].map((m) => (
              <label key={m} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition">
                <input
                  type="radio"
                  name="method"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="w-4 h-4 text-paytm"
                />
                <div>
                  <div className="text-xs font-medium text-gray800 capitalize">{m === 'upi' ? 'UPI' : 'Debit/Credit Card'}</div>
                  <div className="text-[10px] text-gray500">{m === 'upi' ? 'Pay with any UPI app' : 'Save your card securely'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!amount}
          className={`mt-5 w-full py-3.5 rounded-xl font-semibold text-lg transition shadow-sm ${!amount ? 'bg-gray200 text-gray400 cursor-not-allowed' : 'bg-paytm text-white hover:bg-paylm-dark'}`}
        >
          Add Money
        </button>
      </Card>
    </div>
  );
}
