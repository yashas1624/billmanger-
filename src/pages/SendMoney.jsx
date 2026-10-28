/** Send Money — P2P Transfer */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../App';
import { validateUPI, validatePhone, validateAmount } from '../utils/validators';
import { SectionHeader, Button, Input, Card } from '../components/common/UI';
import { Icon } from '../components/common/Icons';
import { CONTACTS } from '../data/mockData';

export default function SendMoney() {
  const { sendMoney, addNotification } = useApp();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const upi = validateUPI(to);
    const phone = validatePhone(to);
    if (!upi.valid && !phone.valid) {
      newErrors.to = 'Enter a valid UPI ID or mobile number';
    }
    const amt = validateAmount(amount);
    if (!amt.valid) newErrors.amount = amt.message;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newBalance = sendMoney(to, amount, note);
    addNotification({ title: 'Payment Sent', message: `₹${amount} sent successfully`, variant: 'success' });
    setSent({ to, amount: Number(amount), note, newBalance });
  };

  const handleContactSelect = (contact) => {
    setTo(contact.upiId || contact.mobile);
  };

  if (sent) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success-light text-success mb-4 shadow-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray800">Payment Sent</h2>
        <p className="mt-1 text-gray500">₹{sent.amount.toLocaleString()} sent to {sent.to}</p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link to="home">
            <button className="px-5 py-2 rounded-lg bg-paytm text-white font-medium hover:bg-paylm-dark transition">Done</button>
          </Link>
          <Link to="send">
            <button className="px-5 py-2 rounded-lg border border-gray200 text-gray700 font-medium hover:bg-gray50 transition">Send Again</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <SectionHeader title="Send Money" subtitle="Transfer to any UPI ID or mobile number" />

      <form onSubmit={handleSend} className="space-y-4 bg-white p-5 rounded-2xl border border-gray100 shadow-sm">
        {/* Recipient */}
        <div>
          <label className="block text-xs font-semibold text-gray500 mb-1">To</label>
          <div className="relative">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="UPI ID, mobile or contact name"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-paytm ${errors.to ? 'border-danger' : 'border-gray200 bg-gray50 text-gray800'}`}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 0 7H4.11a2 2 0 0 1-2-2.27 2 2 0 0 1 2-2 2 2 0 0 1 2 2v2.27a2 2 0 0 1-2 2v3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 0 7H4.11a2 2 0 0 1-2 2v3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 0 7H4.11a2 2 0 0 1 2 2 2 2 0 0 1 2 2v2.27a2 2 0 0 1 2 2" /></svg>
          </div>
          {errors.to && <p className="mt-1 text-xs text-danger">{errors.to}</p>}
        </div>

        {/* Quick contacts */}
        <div>
          <label className="block text-xs font-semibold text-gray500 mb-2">Frequent contacts</label>
          <div className="grid grid-cols-3 gap-2">
            {CONTACTS.filter((c) => c.frequent).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleContactSelect(c)}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-gray100 bg-gray50 hover:border-paylm/30 hover:bg-white transition text-left w-full"
              >
                <div className="w-8 h-8 rounded-full bg-paytm-light flex items-center justify-center text-paytm-dark font-bold text-[10px]">
                  {c.avatar}
                </div>
                <span className="text-[11px] font-medium text-gray700 leading-tight">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-gray500 mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={`w-full pl-4 pr-4 py-3 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-paytm ${errors.amount ? 'border-danger' : 'border-gray200 bg-gray50 text-gray800 text-lg font-bold'}`}
          />
          {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount}</p>}
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-gray500 mb-1">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Dinner bill"
            className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray200 bg-gray50 text-gray800 focus:outline-none focus:ring-2 focus:ring-paytm transition"
          />
        </div>

        <button
          type="submit"
          disabled={!to || !amount}
          className={`w-full py-3.5 rounded-xl font-semibold text-lg transition shadow-sm ${!to || !amount ? 'bg-gray200 text-gray400 cursor-not-allowed' : 'bg-paytm text-white hover:bg-paylm-dark'}`}
        >
          Send Money
        </button>
      </form>
    </div>
  );
}
