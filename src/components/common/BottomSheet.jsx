/**
 * Bottom Sheet — Paytm-style slide-up panel
 */
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from './UI';

export const BottomSheet = ({ isOpen, onClose, children, header, snapPoints = [250, 500, '85%'] }) => {
  const sheetRef = useRef(null);
  const [currentSnap, setCurrentSnap] = useState(snapPoints[0]);
  const { addNotification } = useApp();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={(e) => e.stopPropagation()}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl flex flex-col border-t border-gray200 transition-all duration-300"
        style={{ bottom: `-${currentSnap === snapPoints[0] ? '100%' : currentSnap === '85%' ? '15%' : '0%'}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray100">
          {header && (
            <div>
              <h3 className="text-base font-bold text-gray800">{header.title}</h3>
              {header.subtitle && <p className="text-xs text-gray500 mt-0.5">{header.subtitle}</p>}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <svg className="w-5 h-5 text-gray400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray100 bg-gray50 rounded-b-3xl">
          <div className="w-full h-1.5 bg-gray200 rounded-full mx-6 mb-2" />
        </div>
      </div>
    </div>
  );
};
