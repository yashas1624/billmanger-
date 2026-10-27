import React, { createContext, useContext, useState, Children, cloneElement } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import SendMoney from './pages/SendMoney';
import Recharge from './pages/Recharge';
import Transactions from './pages/Transactions';
import Offers from './pages/Offers';
import TxDetail from './pages/TxDetail';
import AddMoney from './pages/AddMoney';
import More from './pages/More';

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
  recharge: Recharge,
  transactions: Transactions,
  offers: Offers,
  'add-money': AddMoney,
  more: More,
};

export default function App() {
  const [page, setPage] = useState('home');

  const Comp = page.startsWith('tx/') ? TxDetail : PAGES[page] || Home;
  const txId = page.startsWith('tx/') ? page.slice(3) : null;

  return (
    <PageContext.Provider value={{ page, setPage }}>
      <Layout>
        <Comp txId={txId} />
      </Layout>
    </PageContext.Provider>
  );
}
