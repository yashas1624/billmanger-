import React, { useState } from 'react';
import { Link } from '../App';

const AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AddMoney() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!amount) return;
    alert(`₹${amount} will be added to your wallet via ${method}.`);
  };

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <button
        onClick={() => {}}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-paytm hover:underline"
      >
        ← Back to wallet
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Add Money to Wallet</h3>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Amount (₹)</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(String(a))}
                className={`py-3 rounded-xl border text-sm font-medium transition ${
                  amount === String(a)
                    ? 'border-paytm bg-paytm-light/20 text-paytm'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-paytm/30'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Custom amount"
            className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-paytm/20 transition mb-4"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-600 mb-2">Payment method</label>
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
                  <div className="text-xs font-medium text-gray-800 capitalize">{m === 'upi' ? 'UPI' : 'Debit/Credit Card'}</div>
                  <div className="text-[10px] text-gray-500">
                    {m === 'upi' ? 'Pay with any UPI app' : 'Save your card securely'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!amount}
          className={`mt-5 w-full py-3.5 rounded-xl font-semibold text-lg transition shadow-sm ${
            !amount ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-paytm text-white hover:bg-paytm-dark'
          }`}
        >
          Add Money
        </button>
      </div>
    </div>
  );
}
