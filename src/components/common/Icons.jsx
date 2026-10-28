/**
 * Icons — Paytm-style inline SVGs
 */
import React from 'react';

export const Icon = ({ name, size = 24, color = 'currentColor', strokeWidth = 2 }) => {
  const ICONS = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    send: <> <line x1="22" y1="2" x2="11" y2="13" /> <polygon points="22 2 15 22 11 13 2 9 22 2" /> </>,
    receive: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    recharge: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    bank: <> <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /> <path d="M3 9h18" /> <path d="M3 15h18" /> </>,
    ticket: <path d="M2 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />,
    shield: <path d="M12 2l4 8v9a6 6 0 0 1-6 6c-3.314 0-6-2.686-6-6V10l4-8z" />,
    invest: <> <path d="M10 20v-6l4-4 4 4v6" /> <circle cx="12" cy="10" r="2" /> </>,
    gold: <path d="M12 2L3 7v6l9 5 9-5V7z" />,
    request: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    scan: <> <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /> <rect x="8" y="8" width="3" height="3" /> <rect x="16" y="8" width="3" height="3" /> <rect x="8" y="16" width="3" height="3" /> </>,
    movie: <path d="M20 10c0 5-5 5-5 5s-5 0-5-5 5-5 5-5 5 0 5 5z" />,
    postpaid: <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />,
    mobile: <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />,
    dth: <> <rect x="3" y="4" width="18" height="14" rx="2" ry="2" /> <circle cx="12" cy="11" r="2" /> </>,
    electricity: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    water: <path d="M12 2a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-4a7 7 0 0 0-7-7Z" />,
    gas: <> <rect x="8" y="3" width="8" height="14" rx="2" ry="2" /> <path d="M12 17v-4M10 15h4M12 11v4" /> </>,
    wifi: <> <path d="M12 20h.01" /> <path d="M5 12a7 7 0 0 1 14 0" /> <path d="M10.2 6.7a4.6 4.6 0 0 1 3.6 0" /> </>,
    landline: <path d="M20 10c0 5-5 5-5 5s-5 0-5-5 5-5 5-5 5 0 5 5z" />,
    card: <> <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /> <line x1="1" y1="10" x2="7" y2="10" /> <line x1="1" y1="14" x2="14" y2="14" /> </>,
    fastag: <> <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" /> <polyline points="10 13 14 9 18 15" /> </>,
    metro: <> <path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" /> <path d="M7 5h10" /> </>,
    education: <> <path d="M12 3L3 12l2 2v9h9l2-2-9-9z" /> </>,
    user: <> <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" /> </>,
    bell: <> <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /> <path d="M13.73 21a2 2 0 0 1-3.46 0" /> </>,
    settings: <circle cx="12" cy="12" r="3" />,
    help: <> <circle cx="12" cy="12" r="10" /> <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /> <line x1="12" y1="17" x2="12" y2="17" /> </>,
    document: <> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /> <polyline points="14 2 14 8 20 8" /> </>,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />,
    search: <> <circle cx="11" cy="11" r="8" /> <line x1="21" y1="21" x2="16.65" y2="16.65" /> </>,
    menu: <> <line x1="3" y1="12" x2="21" y2="12" /> <line x1="3" y1="6" x2="21" y2="6" /> <line x1="3" y1="18" x2="21" y2="18" /> </>,
    arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
    arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
    check: <polyline points="20 6 9 17 4 12" />,
    copy: <> <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /> <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /> </>,
    qr: <> <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /> <rect x="8" y="8" width="3" height="3" /> <rect x="16" y="8" width="3" height="3" /> <rect x="8" y="16" width="3" height="3" /> </>,
    rupee: <path d="M4 5v1h16v1H4z" />,
    clock: <circle cx="12" cy="12" r="10" />,
    tag: <> <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 17V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2z" /> </>,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    percentage: <path d="M20 4H4M4 20l16-16m2 2l-7.054 7.054a12 12 0 01-5.656 5.656L20 20m-2-2l-7.054-7.054a12 12 0 01-5.656-5.656L4 4" />,
    cashback: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
    wallet: <> <path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" /> <rect x="7" y="7" width="10" height="2" /> </>,
    upi: <> <circle cx="12" cy="12" r="10" /> <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /> <line x1="12" y1="17" x2="12" y2="17" /> </>,
    money: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />,
    history: <> <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> </>,
    success: <polyline points="20 6 9 17 4 12" />,
    failure: <path d="M6 18L18 6M6 6l12 12" />,
    pending: <> <line x1="21" y1="6" x2="3" y2="6" /> <line x1="21" y1="18" x2="3" y2="18" /> </>,
  };

  const d = ICONS[name];
  if (!d) return null;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      {d}
    </svg>
  );
};
