import React, { useState, useEffect, useCallback } from 'react';
import { useBills } from '../context/BillContext';
import { api } from '../services/api';
import { 
  Database, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  Clock, 
  User, 
  Layers, 
  Plus, 
  Trash2, 
  Search
} from 'lucide-react';

export default function DBSheet() {
  const { 
    bills, 
    backendConnected, 
    refreshBills, 
    markAsPaid, 
    deleteBill, 
    setIsAddModalOpen,
    runSchedulerWorker,
    isWorkerRunning
  } = useBills();

  const [activeTable, setActiveTable] = useState('bills'); // 'bills' | 'users'
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editReminderDays, setEditReminderDays] = useState(3);
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workerResult, setWorkerResult] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await api.getUsers();
      if (data?.users) {
        setUsers(data.users);
      }
    } catch {
      // Fallback local users
      setUsers([
        {
          id: 'user-default',
          name: 'Alex Chen',
          email: 'alex.chen@example.com',
          pushToken: 'ExponentPushToken[mock_token_user_1]',
          reminderDaysBefore: 3,
          createdAt: new Date().toISOString()
        },
        {
          id: 'user-2',
          name: 'Maya Lin',
          email: 'maya.lin@example.com',
          pushToken: null,
          reminderDaysBefore: 5,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRunWorker = async () => {
    try {
      const res = await api.runWorkerReminders();
      if (res?.result) {
        setWorkerResult(res.result);
      }
      await runSchedulerWorker();
      await fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveUserPref = async (userId) => {
    try {
      await api.updateUserPreferences(userId, { reminderDaysBefore: Number(editReminderDays) });
      setEditingUserId(null);
      await fetchUsers();
    } catch (e) {
      alert(`Failed to update preferences: ${e.message}`);
    }
  };

  // Filter bills
  const filteredBills = bills.filter(b => {
    const normStatus = (b.status || '').toUpperCase();
    if (statusFilter !== 'all' && normStatus !== statusFilter.toUpperCase()) {
      return false;
    }
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.vendor && b.vendor.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Live Database Sheet
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  backendConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                }`}>
                  {backendConnected ? '● Backend API Connected' : '○ Local Cache / Offline'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect and execute operations directly across database entities (Bills, Users, Schedulers).
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => { refreshBills(); fetchUsers(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleRunWorker}
            disabled={isWorkerRunning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isWorkerRunning ? 'animate-spin' : ''}`} />
            <span>{isWorkerRunning ? 'Running Worker...' : 'Run Daily Worker'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bill</span>
          </button>
        </div>
      </div>

      {/* Worker Run Banner if executed */}
      {workerResult && (
        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>
              <strong>Worker Run Summary ({workerResult.evaluatedDate}):</strong>{' '}
              {workerResult.reminders?.sentCount || 0} reminders dispatched,{' '}
              {workerResult.overdue?.overdueUpdatedCount || 0} overdue statuses updated.
            </span>
          </div>
          <button 
            onClick={() => setWorkerResult(null)}
            className="text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-bold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table Navigation & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Table Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTable('bills')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTable === 'bills'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bills Table</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">
              {bills.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTable('users')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTable === 'users'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Users & Preferences</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">
              {users.length}
            </span>
          </button>
        </div>

        {/* Search & Status Filters for Bills */}
        {activeTable === 'bills' && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter rows..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">PENDING</option>
              <option value="paid">PAID</option>
              <option value="overdue">OVERDUE</option>
            </select>
          </div>
        )}
      </div>

      {/* SPREADSHEET TABLE: BILLS */}
      {activeTable === 'bills' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title / Vendor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Reminder Sent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Recurring</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-slate-400">
                      No records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((b) => {
                    const isPaid = (b.status || '').toLowerCase() === 'paid';
                    const isOverdue = (b.status || '').toLowerCase() === 'overdue';
                    const isPending = !isPaid && !isOverdue;
                    const isRecurring = Boolean(b.isRecurring || (b.frequency && b.frequency.toLowerCase() !== 'one-time'));

                    return (
                      <tr 
                        key={b.id} 
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group"
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {b.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{b.title}</div>
                          {b.vendor && (
                            <div className="text-[11px] text-slate-400">{b.vendor}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                            {b.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {b.currency || '$'}{Number(b.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                          {b.dueDate ? String(b.dueDate).split('T')[0] : '—'}
                        </td>
                        <td className="py-3 px-4">
                          {b.reminderSent ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold">
                              <Clock className="w-3 h-3" /> Unsent
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isPaid && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                              PAID
                            </span>
                          )}
                          {isOverdue && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                              OVERDUE
                            </span>
                          )}
                          {isPending && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] font-medium ${isRecurring ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                            {isRecurring ? `Recurring (${b.frequency || 'Monthly'})` : 'One-time'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isPaid && (
                              <button
                                onClick={() => markAsPaid(b.id)}
                                title="Mark as PAID (resets reminderSent if recurring)"
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[11px] transition"
                              >
                                Pay
                              </button>
                            )}
                            <button
                              onClick={() => deleteBill(b.id)}
                              title="Delete row"
                              className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SPREADSHEET TABLE: USERS & PREFERENCES */}
      {activeTable === 'users' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Push Token</th>
                  <th className="py-3 px-4">Reminder Horizon</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      {loadingUsers ? 'Loading users...' : 'No user records found.'}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isEditing = editingUserId === u.id;

                    return (
                      <tr 
                        key={u.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {u.id}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {u.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                          {u.email}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400 max-w-[200px] truncate">
                          {u.pushToken || 'None registered'}
                        </td>
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                max="30"
                                value={editReminderDays}
                                onChange={(e) => setEditReminderDays(e.target.value)}
                                className="w-16 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                              />
                              <span className="text-slate-500">days</span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                              <Clock className="w-3 h-3" /> {u.reminderDaysBefore ?? 3} days before due
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSaveUserPref(u.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingUserId(u.id);
                                setEditReminderDays(u.reminderDaysBefore ?? 3);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition"
                            >
                              Edit Days
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
