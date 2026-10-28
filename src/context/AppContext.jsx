/**
 * App Context — Global State Management
 * Mimics Paytm's wallet, user, and transaction state
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { WALLET_INITIAL, USER_INITIAL, TRANSACTIONS_INITIAL, CONTACTS_INITIAL } from '../data/mockData';

const initialState = {
  user: USER_INITIAL,
  wallet: WALLET_INITIAL,
  transactions: TRANSACTIONS_INITIAL,
  contacts: CONTACTS_INITIAL,
  notifications: [],
  isAuthenticated: true,
  kycStatus: 'verified',
  upiId: 'yashas.s@paytm',
  bankAccounts: [],
  paymentMethods: [],
  theme: 'light',
  language: 'en',
};

const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_WALLET':
      return { ...state, wallet: action.payload };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        wallet: { ...state.wallet, balance: action.payload.newBalance },
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [{ id: Date.now(), read: false, timestamp: Date.now(), ...action.payload }, ...state.notifications],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n)),
      };
    case 'ADD_BANK_ACCOUNT':
      return { ...state, bankAccounts: [...state.bankAccounts, action.payload] };
    case 'ADD_PAYMENT_METHOD':
      return { ...state, paymentMethods: [...state.paymentMethods, action.payload] };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addMoney = useCallback((amount, method) => {
    const newBalance = state.wallet.balance + amount;
    const tx = {
      id: `tx_${Date.now()}`,
      type: 'credit',
      amount,
      status: 'Success',
      date: new Date().toISOString(),
      title: 'Money Added',
      subtitle: `Wallet top-up via ${method}`,
      newBalance,
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    return newBalance;
  }, [state.wallet.balance]);

  const sendMoney = useCallback((to, amount, note, type = 'debit') => {
    const newBalance = state.wallet.balance - amount;
    const tx = {
      id: `tx_${Date.now()}`,
      type,
      amount,
      status: 'Success',
      date: new Date().toISOString(),
      title: type === 'debit' ? 'UPI Payment' : 'Money Received',
      subtitle: note || (type === 'debit' ? `Sent to ${to}` : `Received from ${to}`),
      newBalance,
      to,
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    return newBalance;
  }, [state.wallet.balance]);

  const payBill = useCallback((biller, amount, account) => {
    const newBalance = state.wallet.balance - amount;
    const tx = {
      id: `tx_${Date.now()}`,
      type: 'debit',
      amount,
      status: 'Success',
      date: new Date().toISOString(),
      title: `${biller} Bill Payment`,
      subtitle: `Account: ${account}`,
      newBalance,
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    return newBalance;
  }, [state.wallet.balance]);

  const addNotification = useCallback((notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const value = {
    ...state,
    addMoney,
    sendMoney,
    payBill,
    addNotification,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
