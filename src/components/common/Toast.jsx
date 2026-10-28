/**
 * Toast Notification System
 */
import React, { useState, useCallback, useEffect } from 'react';

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 4000;

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { id, ...toast };
    setToasts((prev) => {
      const next = [...prev, newToast].slice(-TOAST_LIMIT);
      return next;
    });
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!toast.timer && toast.duration !== 0) {
        const timer = setTimeout(() => removeToast(toast.id), toast.duration || TOAST_REMOVE_DELAY);
        setToasts((prev) =>
          prev.map((t) => (t.id === toast.id ? { ...t, timer } : t))
        );
      }
    });
  }, [toasts, removeToast]);

  const variantStyles = {
    success: 'bg-success text-white border-success/30',
    error: 'bg-danger text-white border-danger/30',
    info: 'bg-paylm text-white border-paylm/30',
    warning: 'bg-warning text-white border-warning/30',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg slide-in-from-right transition-all duration-300 ${
            variantStyles[toast.variant || 'info']
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current" />
          <div className="text-sm font-medium">{toast.title}</div>
          {toast.message && <div className="text-xs opacity-90">{toast.message}</div>}
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto opacity-50 hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, message, variant = 'info', duration }) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { id, title, message, variant, duration };
    setToasts((prev) => [...prev.slice(-2), newToast]);

    if (duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration || TOAST_REMOVE_DELAY);
    }

    return id;
  };

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toast, dismiss, toasts };
};
