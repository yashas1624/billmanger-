import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BILLS } from '../data/mockBills';

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

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'insights' | 'calendar'
  const [filter, setFilter] = useState('all'); // 'all' | 'due_soon' | 'overdue' | 'paid' | 'split'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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

  // Save bills to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bm_bills', JSON.stringify(bills));
    } catch (e) {
      console.error('Failed to save bills', e);
    }
  }, [bills]);

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

  const markAsPaid = (id) => {
    const prevBills = [...bills];
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        const isRecurring = Boolean(b.isRecurring || (b.frequency && b.frequency.toLowerCase() !== 'one-time'));
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

    showToast('Bill marked as paid! 🎉', () => {
      setBills(prevBills);
    });
  };

  const addBill = (newBill) => {
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
  };

  const updateBill = (id, updatedFields) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));
    showToast('Bill details updated.');
  };

  const deleteBill = (id) => {
    const prevBills = [...bills];
    const target = bills.find(b => b.id === id);
    setBills(prev => prev.filter(b => b.id !== id));
    if (selectedBillId === id) setSelectedBillId(null);
    showToast(`Deleted ${target?.title || 'bill'}.`, () => {
      setBills(prevBills);
    });
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
