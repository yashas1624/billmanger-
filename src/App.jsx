import React from 'react';
import { BillProvider, useBills } from './context/BillContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Insights from './pages/Insights';
import CalendarView from './components/dashboard/CalendarView';
import AddBillModal from './components/bills/AddBillModal';
import BillDetailModal from './components/bills/BillDetailModal';
import Toast from './components/Toast';

function AppContent() {
  const { activeTab } = useBills();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && <Home />}
        {activeTab === 'insights' && <Insights />}
        {activeTab === 'calendar' && (
          <div className="space-y-6 pb-12">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Monthly Schedule & Calendar
              </h2>
              <p className="text-xs text-slate-500">
                Visual timeline of upcoming bill due dates and obligations
              </p>
            </div>
            <CalendarView />
          </div>
        )}
      </main>

      {/* Interactive Modals & Drawers */}
      <AddBillModal />
      <BillDetailModal />

      {/* Undoable Feedback Toast */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BillProvider>
      <AppContent />
    </BillProvider>
  );
}
