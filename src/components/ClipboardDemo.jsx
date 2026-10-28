import React, { useState } from 'react';
import {
  useClipboard,
  copyUpiId,
  copyTransactionId,
  copyAmount,
  copyMaskedAccount,
  checkClipboardAvailability,
  ClipboardError,
  ClipboardErrorCode,
} from '../utils/clipboard';

export default function ClipboardDemo() {
  const { copy, read, reset, loading, success, error, method } = useClipboard();
  const [availability, setAvailability] = useState(null);
  const [readText, setReadText] = useState('');

  React.useEffect(() => {
    checkClipboardAvailability().then(setAvailability);
  }, []);

  const handleCopyCustom = async () => {
    try {
      await copy('Hello from Paytm Clone! 💰');
    } catch (err) {
      console.error('Copy failed:', err.code, err.message);
    }
  };

  const handleCopyUpi = async () => {
    try {
      const result = await copyUpiId('yashas.s@paytm', 'My UPI');
      alert(result.message);
    } catch (err) {
      console.error('UPI copy failed:', err.code, err.message);
    }
  };

  const handleCopyTx = async () => {
    try {
      const result = await copyTransactionId('TXN_20261028_ABC123XYZ');
      alert(result.message);
    } catch (err) {
      console.error('TX copy failed:', err.code, err.message);
    }
  };

  const handleCopyAmount = async () => {
    try {
      const result = await copyAmount(4825.50);
      alert(result.message);
    } catch (err) {
      console.error('Amount copy failed:', err.code, err.message);
    }
  };

  const handleCopyAccount = async () => {
    try {
      const result = await copyMaskedAccount('50100123456789', 'Bank Account');
      alert(result.message);
    } catch (err) {
      console.error('Account copy failed:', err.code, err.message);
    }
  };

  const handleRead = async () => {
    try {
      const result = await read();
      setReadText(result.text);
    } catch (err) {
      if (err.code === ClipboardErrorCode.EMPTY_CLIPBOARD) {
        setReadText('(clipboard empty)');
      } else {
        console.error('Read failed:', err.code, err.message);
      }
    }
  };

  const statusColor = success ? 'text-success' : error ? 'text-danger' : 'text-gray-500';
  const statusText = loading
    ? 'Copying...'
    : success
    ? `Copied! (via ${method})`
    : error
    ? `Error: ${error.code} — ${error.message}`
    : 'Ready';

  return (
    <div className="px-4 py-4 max-w-xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Clipboard Bridge Demo</h2>

      {/* Availability */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Clipboard Availability</h3>
        {availability ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Available:</span>
              <span className={availability.available ? 'text-success font-medium' : 'text-danger font-medium'}>
                {availability.available ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Method:</span>
              <span className="font-mono text-gray-800">{availability.method}</span>
            </div>
            {availability.permissionState && (
              <div className="flex justify-between">
                <span className="text-gray-600">Permission:</span>
                <span className={`font-medium ${
                  availability.permissionState === 'granted' ? 'text-success' :
                  availability.permissionState === 'denied' ? 'text-danger' : 'text-warning'
                }`}>
                  {availability.permissionState}
                </span>
              </div>
            )}
            {availability.reason && (
              <p className="text-xs text-gray-500">{availability.reason}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Checking...</p>
        )}
      </div>

      {/* Status */}
      <div className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm ${statusColor}`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-current" />
          <span className="text-sm font-medium">{statusText}</span>
        </div>
        {error && error.details && (
          <pre className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-auto">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Paytm-Style Quick Copies</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyUpi}
            disabled={loading}
            className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            📋 Copy UPI ID
          </button>
          <button
            onClick={handleCopyTx}
            disabled={loading}
            className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            🧾 Copy Transaction ID
          </button>
          <button
            onClick={handleCopyAmount}
            disabled={loading}
            className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            💰 Copy Amount
          </button>
          <button
            onClick={handleCopyAccount}
            disabled={loading}
            className="py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            🏦 Copy Account (Masked)
          </button>
        </div>
      </div>

      {/* Custom Copy */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Custom Copy</h3>
        <button
          onClick={handleCopyCustom}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-paytm text-white font-medium hover:bg-paytm-dark transition disabled:opacity-50"
        >
          {loading ? 'Copying...' : 'Copy Custom Text'}
        </button>
      </div>

      {/* Read Clipboard */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Read Clipboard</h3>
          <button
            onClick={handleRead}
            disabled={loading}
            className="py-1.5 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Paste
          </button>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 min-h-[60px] font-mono text-sm text-gray-700 whitespace-pre-wrap">
          {readText || <span className="text-gray-400">Nothing pasted yet</span>}
        </div>
      </div>

      {/* Error Code Reference */}
      <details className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <summary className="font-medium text-gray-700 cursor-pointer">Error Codes Reference</summary>
        <div className="mt-3 space-y-1 text-xs text-gray-600">
          {Object.entries(ClipboardErrorCode).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-mono text-paytm">{value}</span>
              <span>{key.replace(/_/g, ' ').toLowerCase()}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}