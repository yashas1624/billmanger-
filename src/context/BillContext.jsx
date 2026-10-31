import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_BILLS } from '../data/mockBills';
import { api } from '../services/api';

const BillContext = createContext(null);

export function BillProvider({ children }) {
  const [bills, setBills] = useState(() => {
    try {
      const saved = localStorage.getItem('bm_bills');
      return saved ? JSON.parse(saved) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('bm_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [backendConnected, setBackendConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'insights' | 'calendar' | 'db-sheet'
  const [filter, setFilter] = useState('all'); // 'all' | 'due_soon' | 'overdue' | 'paid' | 'split'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWorkerRunning, setIsWorkerRunning] = useState(false);
  
  // Toast notifications with Undo capability
  const [toast, setToast] = useState(null);
  const [lastUndoAction, setLastUndoAction] = useState(null);

  // Sync dark mode class with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bm_theme', 'light');
    }
  }, [darkMode]);

  // Save bills to localStorage for offline cache
  useEffect(() => {
    try {
      localStorage.setItem('bm_bills', JSON.stringify(bills));
    } catch (e) {
      console.error('Failed to save bills', e);
    }
  }, [bills]);

  // Load live bills from backend
  const loadBillsFromBackend = useCallback(async () => {
    try {
      const data = await api.getBills();
      if (data && Array.isArray(data.bills)) {
        // Normalize status to lowercase for UI compatibility
        const formattedBills = data.bills.map(b => ({
          ...b,
          status: b.status.toLowerCase()
        }));
        setBills(formattedBills);
        setBackendConnected(true);
      }
    } catch (err) {
      // Backend not running yet or offline; fallback cleanly to local state
      console.log('[BillContext] Backend offline, running in offline fallback mode:', err.message);
      setBackendConnected(false);
    }
  }, []);

  // Poll or check backend connection on mount
  useEffect(() => {
    loadBillsFromBackend();
    const interval = setInterval(loadBillsFromBackend, 15000); // sync every 15s
    return () => clearInterval(interval);
  }, [loadBillsFromBackend]);

  const showToast = (message, undoAction = null) => {
    setToast(message);
    setLastUndoAction(undoAction);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const undo = () => {
    if (lastUndoAction) {
      lastUndoAction();
      setToast('Action undone.');
      setLastUndoAction(null);
    }
  };

  const markAsPaid = async (id) => {
    const prevBills = [...bills];
    const target = bills.find(b => b.id === id);
    const isRecurring = Boolean(target?.isRecurring || (target?.frequency && target?.frequency.toLowerCase() !== 'one-time'));

    // Optimistic UI update
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: 'paid',
          reminderSent: isRecurring ? false : b.reminderSent,
          history: [
            {
              date: new Date().toISOString().split('T')[0],
              action: `Marked as paid (${b.currency}${b.amount.toFixed(2)})`,
              ref: `TX-${Math.floor(10000 + Math.random() * 90000)}`
            },
            ...(b.history || [])
          ]
        };
      }
      return b;
    }));

    // Trigger backend route
    if (backendConnected) {
      try {
        await api.markBillAsPaid(id);
      } catch (e) {
        console.warn('[BillContext] Failed to sync paid status to backend:', e);
      }
    }

    showToast('Bill marked as paid! 🎉', () => {
      setBills(prevBills);
      if (backendConnected && target) {
        api.updateBill(id, { status: target.status, reminderSent: target.reminderSent }).catch(() => {});
      }
    });
  };

  const addBill = async (newBill) => {
    const isRecurring = Boolean(newBill.isRecurring || (newBill.frequency && newBill.frequency.toLowerCase() !== 'one-time'));
    const created = {
      reminderSent: false,
      isRecurring,
      status: 'pending',
      ...newBill,
      id: `bill-${Date.now()}`,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          action: 'Bill created',
          ref: 'System Log'
        }
      ]
    };

    setBills(prev => [created, ...prev]);
    showToast(`Added ${created.title} successfully.`);
    setIsAddModalOpen(false);

    if (backendConnected) {
      try {
        await api.createBill({
          ...created,
          status: 'PENDING'
        });
        loadBillsFromBackend();
      } catch (e) {
        console.warn('[BillContext] Failed to save bill to backend:', e);
      }
    }
  };

  const updateBill = async (id, updatedFields) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));
    showToast('Bill details updated.');

    if (backendConnected) {
      try {
        await api.updateBill(id, updatedFields);
        loadBillsFromBackend();
      } catch (e) {
        console.warn('[BillContext] Failed to update bill on backend:', e);
      }
    }
  };

  const deleteBill = async (id) => {
    const prevBills = [...bills];
    const target = bills.find(b => b.id === id);
    setBills(prev => prev.filter(b => b.id !== id));
    if (selectedBillId === id) setSelectedBillId(null);

    showToast(`Deleted ${target?.title || 'bill'}.`, () => {
      setBills(prevBills);
      if (backendConnected && target) {
        api.createBill(target).catch(() => {});
      }
    });

    if (backendConnected) {
      try {
        await api.deleteBill(id);
      } catch (e) {
        console.warn('[BillContext] Failed to delete bill on backend:', e);
      }
    }
  };

  const toggleSplitMember = (billId, memberId) => {
    setBills(prev => prev.map(b => {
      if (b.id === billId && b.splitMembers) {
        return {
          ...b,
          splitMembers: b.splitMembers.map(m => m.id === memberId ? { ...m, isPaid: !m.isPaid } : m)
        };
      }
      return b;
    }));
  };

  const runSchedulerWorker = async (targetDate = null) => {
    setIsWorkerRunning(true);
    try {
      const response = await api.runWorkerReminders(targetDate);
      if (response?.success && response?.result) {
        const { reminders, overdue } = response.result;
        showToast(`Worker finished: ${reminders.sentCount} reminders sent, ${overdue.overdueUpdatedCount} overdue updated.`);
        await loadBillsFromBackend();
      } else {
        showToast('Background worker executed.');
      }
    } catch (err) {
      showToast(`Worker trigger failed: ${err.message}`);
    } finally {
      setIsWorkerRunning(false);
    }
  };

  const selectedBill = bills.find(b => b.id === selectedBillId) || null;

  return (
    <BillContext.Provider
      value={{
        bills,
        darkMode,
        setDarkMode,
        activeTab,
        setActiveTab,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        selectedBillId,
        setSelectedBillId,
        selectedBill,
        isAddModalOpen,
        setIsAddModalOpen,
        backendConnected,
        refreshBills: loadBillsFromBackend,
        runSchedulerWorker,
        isWorkerRunning,
        markAsPaid,
        addBill,
        updateBill,
        deleteBill,
        toggleSplitMember,
        toast,
        undo,
        hasUndo: !!lastUndoAction,
      }}
    >
      {children}
    </BillContext.Provider>
  );
}

export function useBills() {
  const ctx = useContext(BillContext);
  if (!ctx) throw new Error('useBills must be used within BillProvider');
  return ctx;
}
