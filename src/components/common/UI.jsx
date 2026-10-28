/**
 * Common UI Components — Paytm Design System
 * Built with frontend design principles: consistent spacing, elevation,
 * interactive states, and accessible focus management
 */
import React from 'react';
import { Icon } from './Icons';

// ──────────────────────────────────────────────
// Button — Primary, Secondary, Outline, Ghost, Danger
// ──────────────────────────────────────────────

export const Button = ({ children, variant = 'primary', size = 'md', disabled = false, loading = false, fullWidth = false, className = '', onClick, type = 'button', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-paytm text-white hover:bg-paylm-dark active:scale-[0.98] focus:ring-paytm',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-[0.98] focus:ring-gray-400',
    outline: 'border-2 border-paytm text-paytm hover:bg-paylm-light active:scale-[0.98] focus:ring-paytm',
    ghost: 'text-paytm hover:bg-paylm-light active:scale-[0.98] focus:ring-paytm',
    danger: 'bg-danger text-white hover:bg-[#e31b1b] active:scale-[0.98] focus:ring-danger',
    success: 'bg-success text-white hover:bg-[#00a05e] active:scale-[0.98] focus:ring-success',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {loading && (
        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && children}
    </button>
  );
};

// ──────────────────────────────────────────────
// Input — With label, icon, error, and helper text
// ──────────────────────────────────────────────

export const Input = ({ label, placeholder, value, onChange, type = 'text', error, icon, helper, readOnly, className = '' }) => {
  return (
    <div className="space-y-1 w-full">
      {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4">{icon}</div>}
        <input type={type} value={value} onChange={onChange} readOnly={readOnly} placeholder={placeholder} className={`w-full pl-9 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-paytm/50 focus:border-paytm ${error ? 'border-danger focus:ring-danger/50' : 'border-gray-200 bg-gray-50 text-gray-900'} ${readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} ${className}`} />
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        {helper && !error && <p className="mt-1 text-xs text-gray-400">{helper}</p>}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Card — Elevated container with hover support
// ──────────────────────────────────────────────

export const Card = ({ children, className = '', hover = false, padding = 'md', bordered = true }) => {
  const paddingClasses = { sm: 'p-3', md: 'p-4', lg: 'p-6' };
  return (
    <div className={`bg-white rounded-2xl ${bordered ? 'border border-gray-200' : ''} shadow-sm transition-all duration-200 ${hover ? 'hover:shadow-md hover:-translate-y-0.5' : ''} ${paddingClasses[padding]} ${className}`}>{children}</div>
  );
};

// ──────────────────────────────────────────────
// Section Header — With optional action
// ──────────────────────────────────────────────

export const SectionHeader = ({ title, subtitle, action, actionLabel = 'View All' }) => {
  return (
    <div className="px-4 mb-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <Button variant="ghost" size="sm" onClick={action}>{actionLabel}</Button>}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Avatar — With initials fallback
// ──────────────────────────────────────────────

export const Avatar = ({ src, initials, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm', xl: 'w-12 h-12 text-base' };
  return (
    <div className={`rounded-full flex items-center justify-center font-bold bg-paytm-light text-paytm-dark shadow-sm ${sizes[size]} ${className}`}>
      {src ? <img src={src} alt="avatar" className="w-full h-full rounded-full object-cover" /> : initials}
    </div>
  );
};

// ──────────────────────────────────────────────
// Badge — Status indicator
// ──────────────────────────────────────────────

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>
  );
};

// ──────────────────────────────────────────────
// Divider — Section separator
// ──────────────────────────────────────────────

export const Divider = ({ className = '' }) => {
  return <div className={`h-px bg-gray-200 w-full my-4 ${className}`} />;
};
