/**
 * Clipboard Bridge — Secure, cross-browser clipboard utility
 * Mimics Electron's clipboard IPC pattern for web apps
 *
 * Features:
 * - Modern Clipboard API (navigator.clipboard) with Permissions API
 * - Legacy fallback (document.execCommand) for older browsers
 * - User gesture requirement handling
 * - Structured error types for clear debugging
 * - React-friendly async API
 */

// ──────────────────────────────────────────────
// Error Types (mirror Electron's structured errors)
// ──────────────────────────────────────────────

export class ClipboardError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'ClipboardError';
    this.code = code;
    this.details = details;
  }
}

export const ClipboardErrorCode = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  NO_USER_GESTURE: 'NO_USER_GESTURE',
  WRITE_FAILED: 'WRITE_FAILED',
  READ_FAILED: 'READ_FAILED',
  EMPTY_CLIPBOARD: 'EMPTY_CLIPBOARD',
  UNKNOWN: 'UNKNOWN',
};

// ──────────────────────────────────────────────
// Feature Detection
// ──────────────────────────────────────────────

const hasClipboardAPI = () =>
  typeof navigator !== 'undefined' &&
  navigator.clipboard &&
  typeof navigator.clipboard.writeText === 'function';

const hasPermissionsAPI = () =>
  typeof navigator !== 'undefined' &&
  navigator.permissions &&
  typeof navigator.permissions.query === 'function';

const isSecureContext = () =>
  typeof window !== 'undefined' &&
  (window.isSecureContext ||
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname === '::1');

const hasLegacySupport = () =>
  typeof document !== 'undefined' &&
  typeof document.execCommand === 'function';

// ──────────────────────────────────────────────
// Permission State Management
// ──────────────────────────────────────────────

let cachedPermissionState = null;
let permissionCheckPromise = null;

async function getClipboardPermissionState() {
  if (!hasPermissionsAPI()) {
    return 'prompt'; // Unknown, assume prompt needed
  }

  if (cachedPermissionState) {
    return cachedPermissionState;
  }

  if (permissionCheckPromise) {
    return permissionCheckPromise;
  }

  permissionCheckPromise = (async () => {
    try {
      const perm = await navigator.permissions.query({ name: 'clipboard-write' });
      cachedPermissionState = perm.state;

      // Listen for changes
      perm.onchange = () => {
        cachedPermissionState = perm.state;
      };

      return perm.state;
    } catch {
      return 'prompt';
    }
  })();

  return permissionCheckPromise;
}

function resetPermissionCache() {
  cachedPermissionState = null;
  permissionCheckPromise = null;
}

// ──────────────────────────────────────────────
// Core Write Implementation
// ──────────────────────────────────────────────

async function writeTextModern(text) {
  if (!hasClipboardAPI()) {
    throw new ClipboardError(
      'Clipboard API not available',
      ClipboardErrorCode.NOT_SUPPORTED
    );
  }

  if (!isSecureContext()) {
    throw new ClipboardError(
      'Clipboard API requires secure context (HTTPS or localhost)',
      ClipboardErrorCode.NOT_SUPPORTED,
      { protocol: location.protocol, hostname: location.hostname }
    );
  }

  // Check permission state
  const permissionState = await getClipboardPermissionState();

  if (permissionState === 'denied') {
    throw new ClipboardError(
      'Clipboard permission denied. Enable in browser settings.',
      ClipboardErrorCode.PERMISSION_DENIED
    );
  }

  try {
    await navigator.clipboard.writeText(text);
    return { success: true, method: 'modern' };
  } catch (err) {
    // Handle specific error cases
    if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
      resetPermissionCache(); // Invalidate cache
      throw new ClipboardError(
        'Clipboard write blocked — requires user interaction',
        ClipboardErrorCode.NO_USER_GESTURE,
        { originalError: err.message }
      );
    }
    throw new ClipboardError(
      `Failed to write to clipboard: ${err.message}`,
      ClipboardErrorCode.WRITE_FAILED,
      { originalError: err.message }
    );
  }
}

function writeTextLegacy(text) {
  if (!hasLegacySupport()) {
    throw new ClipboardError(
      'Legacy clipboard not supported',
      ClipboardErrorCode.NOT_SUPPORTED
    );
  }

  // Create a temporary textarea
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!successful) {
      throw new Error('execCommand returned false');
    }

    return { success: true, method: 'legacy' };
  } catch (err) {
    document.body.removeChild(textarea);
    throw new ClipboardError(
      `Legacy clipboard write failed: ${err.message}`,
      ClipboardErrorCode.WRITE_FAILED,
      { originalError: err.message }
    );
  }
}

// ──────────────────────────────────────────────
// Core Read Implementation
// ──────────────────────────────────────────────

async function readTextModern() {
  if (!hasClipboardAPI()) {
    throw new ClipboardError(
      'Clipboard API not available',
      ClipboardErrorCode.NOT_SUPPORTED
    );
  }

  if (!isSecureContext()) {
    throw new ClipboardError(
      'Clipboard API requires secure context',
      ClipboardErrorCode.NOT_SUPPORTED
    );
  }

  const permissionState = await getClipboardPermissionState();

  if (permissionState === 'denied') {
    throw new ClipboardError(
      'Clipboard read permission denied',
      ClipboardErrorCode.PERMISSION_DENIED
    );
  }

  try {
    const text = await navigator.clipboard.readText();
    if (!text) {
      throw new ClipboardError(
        'Clipboard is empty',
        ClipboardErrorCode.EMPTY_CLIPBOARD
      );
    }
    return { text, method: 'modern' };
  } catch (err) {
    if (err instanceof ClipboardError) throw err;
    if (err.name === 'NotAllowedError') {
      resetPermissionCache();
      throw new ClipboardError(
        'Clipboard read blocked — requires user interaction',
        ClipboardErrorCode.NO_USER_GESTURE,
        { originalError: err.message }
      );
    }
    throw new ClipboardError(
      `Failed to read from clipboard: ${err.message}`,
      ClipboardErrorCode.READ_FAILED,
      { originalError: err.message }
    );
  }
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────

/**
 * Write text to clipboard
 * @param {string} text - Text to copy
 * @param {Object} options - Options
 * @param {boolean} options.fallback - Allow legacy fallback (default: true)
 * @returns {Promise<{success: boolean, method: 'modern'|'legacy'}>}
 */
export async function copyToClipboard(text, options = {}) {
  const { fallback = true } = options;

  if (typeof text !== 'string') {
    throw new ClipboardError(
      'Text must be a string',
      ClipboardErrorCode.UNKNOWN,
      { receivedType: typeof text }
    );
  }

  if (!text.trim()) {
    throw new ClipboardError(
      'Cannot copy empty string',
      ClipboardErrorCode.UNKNOWN
    );
  }

  // Try modern API first
  if (hasClipboardAPI() && isSecureContext()) {
    try {
      return await writeTextModern(text);
    } catch (err) {
      if (err instanceof ClipboardError) {
        // If permission denied or not supported, try fallback
        if (
          err.code === ClipboardErrorCode.PERMISSION_DENIED ||
          err.code === ClipboardErrorCode.NOT_SUPPORTED
        ) {
          if (fallback && hasLegacySupport()) {
            return writeTextLegacy(text);
          }
        }
        // For NO_USER_GESTURE, don't fallback — user must interact
        if (err.code === ClipboardErrorCode.NO_USER_GESTURE) {
          throw err;
        }
      }
      // Other errors, try fallback if enabled
      if (fallback && hasLegacySupport()) {
        return writeTextLegacy(text);
      }
      throw err;
    }
  }

  // Fallback to legacy
  if (fallback && hasLegacySupport()) {
    return writeTextLegacy(text);
  }

  throw new ClipboardError(
    'No clipboard method available',
    ClipboardErrorCode.NOT_SUPPORTED
  );
}

/**
 * Read text from clipboard
 * @returns {Promise<{text: string, method: 'modern'}>}
 */
export async function readFromClipboard() {
  if (hasClipboardAPI() && isSecureContext()) {
    return readTextModern();
  }

  throw new ClipboardError(
    'Clipboard read not supported — requires modern browser with HTTPS',
    ClipboardErrorCode.NOT_SUPPORTED
  );
}

/**
 * Check if clipboard write is available
 * @returns {Promise<{available: boolean, method: 'modern'|'legacy'|'none', reason?: string}>}
 */
export async function checkClipboardAvailability() {
  if (hasClipboardAPI() && isSecureContext()) {
    const permissionState = await getClipboardPermissionState();
    return {
      available: true,
      method: 'modern',
      permissionState,
    };
  }

  if (hasLegacySupport()) {
    return {
      available: true,
      method: 'legacy',
      reason: 'Using legacy execCommand fallback',
    };
  }

  return {
    available: false,
    method: 'none',
    reason: 'No clipboard API available',
  };
}

/**
 * Request clipboard permission (shows browser prompt if needed)
 * @returns {Promise<'granted'|'denied'|'prompt'>}
 */
export async function requestClipboardPermission() {
  if (!hasPermissionsAPI()) {
    return 'prompt';
  }

  try {
    const perm = await navigator.permissions.request({ name: 'clipboard-write' });
    cachedPermissionState = perm.state;
    return perm.state;
  } catch {
    return 'prompt';
  }
}

/**
 * Copy with user gesture enforcement — wraps action in event handler
 * Usage: <button onClick={() => copyWithGesture('text')}>Copy</button>
 * @param {string} text
 * @param {Object} options
 */
export function createCopyHandler(text, options = {}) {
  return async (event) => {
    // Ensure this is a real user gesture
    if (event && !event.isTrusted) {
      throw new ClipboardError(
        'Copy requires trusted user gesture',
        ClipboardErrorCode.NO_USER_GESTURE
      );
    }
    return copyToClipboard(text, options);
  };
}

// ──────────────────────────────────────────────
// React Hook
// ──────────────────────────────────────────────

import { useState, useCallback } from 'react';

export function useClipboard() {
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const copy = useCallback(async (text, options) => {
    setStatus({ loading: true, success: false, error: null });
    try {
      const result = await copyToClipboard(text, options);
      setStatus({ loading: false, success: true, error: null, method: result.method });
      return result;
    } catch (err) {
      const error = err instanceof ClipboardError ? err : new ClipboardError(err.message, ClipboardErrorCode.UNKNOWN);
      setStatus({ loading: false, success: false, error });
      throw error;
    }
  }, []);

  const read = useCallback(async () => {
    setStatus({ loading: true, success: false, error: null });
    try {
      const result = await readFromClipboard();
      setStatus({ loading: false, success: true, error: null, method: result.method });
      return result;
    } catch (err) {
      const error = err instanceof ClipboardError ? err : new ClipboardError(err.message, ClipboardErrorCode.UNKNOWN);
      setStatus({ loading: false, success: false, error });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus({ loading: false, success: false, error: null });
  }, []);

  return { copy, read, reset, ...status };
}

// ──────────────────────────────────────────────
// Paytm-specific Helpers
// ──────────────────────────────────────────────

/**
 * Copy UPI ID with formatted label
 */
export async function copyUpiId(upiId, label = 'UPI ID') {
  return copyToClipboard(upiId).then((result) => ({
    ...result,
    message: `${label} copied: ${upiId}`,
  }));
}

/**
 * Copy transaction ID
 */
export async function copyTransactionId(txId) {
  return copyToClipboard(txId).then((result) => ({
    ...result,
    message: `Transaction ID copied: ${txId}`,
  }));
}

/**
 * Copy amount with currency symbol
 */
export async function copyAmount(amount, currency = '₹') {
  const formatted = `${currency}${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  return copyToClipboard(formatted).then((result) => ({
    ...result,
    message: `Amount copied: ${formatted}`,
  }));
}

/**
 * Copy bank account details (masked)
 */
export function maskAccountNumber(accountNumber, visibleDigits = 4) {
  const str = String(accountNumber);
  if (str.length <= visibleDigits) return str;
  const masked = '*'.repeat(str.length - visibleDigits) + str.slice(-visibleDigits);
  return masked;
}

export async function copyMaskedAccount(accountNumber, label = 'Account') {
  const masked = maskAccountNumber(accountNumber);
  return copyToClipboard(masked).then((result) => ({
    ...result,
    message: `${label} copied (masked): ${masked}`,
  }));
}

// ──────────────────────────────────────────────
// Export all
// ──────────────────────────────────────────────

export default {
  copyToClipboard,
  readFromClipboard,
  checkClipboardAvailability,
  requestClipboardPermission,
  createCopyHandler,
  useClipboard,
  copyUpiId,
  copyTransactionId,
  copyAmount,
  copyMaskedAccount,
  maskAccountNumber,
  ClipboardError,
  ClipboardErrorCode,
};