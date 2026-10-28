/** Notifications */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectionHeader, Card } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

export default function Notifications() {
  const { notifications, markNotificationRead } = useApp();
  const [filter, setFilter] = useState('all');

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
  ];

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="px-4 pb-24 max-w-md mx-auto">
      <SectionHeader title="Notifications" subtitle="Stay updated with Paytm" />

      <div className="flex gap-2 overflow-x-auto px-4 mb-4 scrollbar-hide">
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition ${isActive ? 'bg-paytm text-white' : 'bg-gray100 text-gray600 hover:bg-gray200'}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-0">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <div key={n.id} className="px-4 py-4 flex items-start justify-between bg-white border-b border-gray50 last:border-0 hover:bg-gray50 transition">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray800">{n.title}</p>
                <p className="text-xs text-gray500 mt-1">{n.message}</p>
                <p className="text-[10px] text-gray400 mt-2">{new Date(n.timestamp).toLocaleString()}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-paytm mt-1" />}
            </div>
          ))
        ) : (
          <div className="px-4 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray100 flex items-center justify-center mx-auto mb-3 text-gray300">
              <Icon name="bell" size="32" />
            </div>
            <p className="text-sm font-medium text-gray700">No notifications</p>
            <p className="mt-0.5 text-xs text-gray500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
