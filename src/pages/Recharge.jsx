/** Recharge & Bills */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../App';
import { validateAmount } from '../utils/validators';
import { SectionHeader, Button, Input, Card } from '../components/common/UI';
import { Icon } from '../components/common/Icons';
import { BILLERS } from '../data/mockData';

const ICON_BY_BILLER = {
  mobile: <Icon name="mobile" size="24" className="text-paytm" />,
  postpaid: <Icon name="postpaid" size="24" className="text-paylm" />,
  dth: <Icon name="dth" size="24" className="text-success" />,
  electricity: <Icon name="electricity" size="24" className="text-warning" />,
  water: <Icon name="water" size="24" className="text-paytm" />,
  gas: <Icon name="gas" size="24" className="text-danger" />,
  broadband: <Icon name="wifi" size="24" className="text-purple-500" />,
  landline: <Icon name="landline" size="24" className="text-yellow-500" />,
  creditcard: <Icon name="card" size="24" className="text-danger" />,
  fastag: <Icon name="fastag" size="24" className="text-paytm" />,
  metro: <Icon name="metro" size="24" className="text-success" />,
  education: <Icon name="education" size="24" className="text-warning" />,
};

export default function Recharge() {
  const { payBill, addNotification } = useApp();
  const [biller, setBiller] = useState(null);
  const [provider, setProvider] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [paid, setPaid] = useState(null);

  const billerConfig = biller ? BILLERS.find((b) => b.id === biller) : null;
  const providers = billerConfig?.providers || [];

  const handleProceed = (e) => {
    e.preventDefault();
    if (!provider || !account || !amount) return;
    const newBalance = payBill(biller, Number(amount), account);
    addNotification({
      title: 'Bill Payment Successful',
      message: `₹${amount} paid for ${provider}`,
      variant: 'success',
    });
    setPaid({ biller: billerConfig?.label, provider, amount: Number(amount), newBalance });
  };

  if (paid) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success-light text-success mb-4 shadow-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray800">Payment Successful</h2>
        <p className="mt-1 text-gray500">₹{paid.amount.toLocaleString()} paid to {paid.provider}</p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link to="home">
            <button className="px-5 py-2 rounded-lg bg-paytm text-white font-medium hover:bg-paylm-dark transition">Done</button>
          </Link>
          <Link to="recharge">
            <button className="px-5 py-2 rounded-lg border border-gray200 text-gray700 font-medium hover:bg-gray50 transition">Pay Another Bill</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24 max-w-xl mx-auto">
      <SectionHeader title="Recharge & Bills" subtitle="Pay utilities, recharge & more" />

      {!biller ? (
        <div className="grid grid-cols-3 gap-3">
          {BILLERS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBiller(b.id)}
              className="flex flex-col items-center gap-2 p-3.5 rounded-2xl border border-gray100 bg-white hover:border-paytm/40 hover:bg-paytm-light/30 transition shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-paytm-light flex items-center justify-center text-paytm">
                {ICON_BY_BILLER[b.id]}
              </div>
              <span className="text-xs font-bold text-gray800 leading-tight text-center">{b.label}</span>
              <span className="text-[10px] text-gray400">{b.providers.length} providers</span>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleProceed} className="bg-white p-5 rounded-2xl border border-gray100 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-1">
            <Link to="recharge">
              <button className="text-xs font-medium text-gray600 hover:text-paytm">← Back</button>
            </Link>
            <span className="text-xs font-bold text-paytm uppercase tracking-wider">{billerConfig?.label}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray500 mb-1">Service provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray200 bg-gray50 text-gray800 focus:outline-none focus:ring-2 focus:ring-paytm/20 transition"
            >
              <option value="">Select provider</option>
              {providers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray500 mb-1">Account / mobile number</label>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Enter number"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray200 bg-gray50 text-gray800 focus:outline-none focus:ring-2 focus:ring-paytm/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray500 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray200 bg-gray50 text-gray800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-paytm/20 focus:border-paytm transition"
            />
          </div>

          <button
            type="submit"
            disabled={!provider || !account || !amount}
            className={`w-full py-3.5 rounded-xl font-semibold text-lg transition shadow-sm ${!provider || !account || !amount ? 'bg-gray200 text-gray400 cursor-not-allowed' : 'bg-paytm text-white hover:bg-paylm-dark'}`}
          >
            Pay Now
          </button>
        </form>
      )}
    </div>
  );
}
