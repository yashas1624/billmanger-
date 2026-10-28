/** Postpaid Bills */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectionHeader, Card, Button, Input } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

export default function Postpaid() {
  const { payBill, addNotification } = useApp();
  const [operator, setOperator] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handlePay = (e) => {
    e.preventDefault();
    if (!operator || !number || !amount) return;
    payBill(operator, Number(amount), number);
    addNotification({ title: 'Postpaid Bill Paid', message: `₹${amount} paid to ${operator}`, variant: 'success' });
  };

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <SectionHeader title="Postpaid Bills" subtitle="Pay mobile postpaid & broadband bills" />

      <Card>
        <form onSubmit={handlePay} className="space-y-4">
          <Input
            label="Operator"
            placeholder="Airtel, Jio, Vi, BSNL"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
          />
          <Input
            label="Mobile / Account Number"
            placeholder="Enter number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <Input
            label="Amount (₹)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            type="submit"
            disabled={!operator || !number || !amount}
            className={`w-full py-3.5 rounded-xl font-semibold text-lg transition shadow-sm ${!operator || !number || !amount ? 'bg-gray200 text-gray400 cursor-not-allowed' : 'bg-paytm text-white hover:bg-paylm-dark'}`}
          >
            Pay Bill
          </button>
        </form>
      </Card>
    </div>
  );
}
