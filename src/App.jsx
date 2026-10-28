import React, { createContext, useContext, useState, Children, cloneElement } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import SendMoney from './pages/SendMoney';
import ReceiveMoney from './pages/ReceiveMoney';
import Recharge from './pages/Recharge';
import Postpaid from './pages/Postpaid';
import Transactions from './pages/Transactions';
import TransactionDetail from './pages/TransactionDetail';
import Offers from './pages/Offers';
import AddMoney from './pages/AddMoney';
import More from './pages/More';
import KYC from './pages/KYC';
import BankAccounts from './pages/BankAccounts';
import PaymentMethods from './pages/PaymentMethods';
import Investments from './pages/Investments';
import Insurance from './pages/Insurance';
import Travel from './pages/Travel';
import Movies from './pages/Movies';
import Help from './pages/Help';
import Notifications from './pages/Notifications';
import QRScanner from './pages/QRScanner';
import ClipboardDemo from './components/ClipboardDemo';

/* ------------------------------------------------------------------ */
/*  Client-side page context                                          */
/* ------------------------------------------------------------------ */

const PageContext = createContext(null);

export function usePage() {
  const ctx = useContext(PageContext);
  if (!ctx) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return ctx;
}

export function Link({ to, children }) {
  const { setPage } = usePage();
  const child = Children.only(children);
  return cloneElement(child, {
    onClick: (e) => {
      e.preventDefault();
      setPage(to);
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Routes                                                            */
/* ------------------------------------------------------------------ */

const PAGES = {
  home: Home,
  send: SendMoney,
  receive: ReceiveMoney,
  recharge: Recharge,
  postpaid: Postpaid,
  transactions: Transactions,
  offers: Offers,
  'add-money': AddMoney,
  more: More,
  kyc: KYC,
  'bank-accounts': BankAccounts,
  'payment-methods': PaymentMethods,
  investments: Investments,
  insurance: Insurance,
  travel: Travel,
  movies: Movies,
  help: Help,
  notifications: Notifications,
  qr: QRScanner,
  clipboard: ClipboardDemo,
};

export default function App() {
  const [page, setPage] = useState('home');

  const Comp = page.startsWith('tx/') ? TransactionDetail : PAGES[page] || Home;
  const txId = page.startsWith('tx/') ? page.slice(3) : null;

  return (
    <PageContext.Provider value={{ page, setPage }}>
      <Layout>
        <Comp txId={txId} />
      </Layout>
    </PageContext.Provider>
  );
}
