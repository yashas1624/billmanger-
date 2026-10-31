/**
 * Bill Model and Status Enum Definition
 */

export const BillStatus = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE'
});

export const VALID_STATUSES = Object.values(BillStatus);

/**
 * Normalizes and validates Bill fields
 * @param {Object} data 
 * @returns {Object} Validated bill object
 */
export function validateAndFormatBill(data = {}) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('title is required and must be a non-empty string');
  }

  const amount = Number(data.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.push('amount is required and must be a positive number');
  }

  if (!data.dueDate) {
    errors.push('dueDate is required');
  }

  const parsedDueDate = new Date(data.dueDate);
  if (isNaN(parsedDueDate.getTime())) {
    errors.push('dueDate must be a valid date or ISO string');
  }

  // Normalize status to uppercase enum
  let status = BillStatus.PENDING;
  if (data.status !== undefined && data.status !== null) {
    const rawStatus = String(data.status).trim().toUpperCase();
    if (VALID_STATUSES.includes(rawStatus)) {
      status = rawStatus;
    } else {
      errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  const reminderSent = typeof data.reminderSent === 'boolean' ? data.reminderSent : false;
  const isRecurring = typeof data.isRecurring === 'boolean'
    ? data.isRecurring
    : Boolean(data.frequency && data.frequency.toLowerCase() !== 'one-time');

  if (errors.length > 0) {
    const err = new Error(`Validation Error: ${errors.join('; ')}`);
    err.name = 'ValidationError';
    err.details = errors;
    throw err;
  }

  return {
    id: data.id || `bill-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    title: data.title.trim(),
    vendor: data.vendor ? String(data.vendor).trim() : null,
    category: data.category ? String(data.category).trim() : 'General',
    amount: Math.round(amount * 100) / 100,
    currency: data.currency || '$',
    dueDate: parsedDueDate.toISOString(),
    reminderSent,
    status,
    isRecurring,
    frequency: data.frequency || (isRecurring ? 'Monthly' : 'One-time'),
    notes: data.notes || '',
    userId: data.userId || 'default-user-id',
    receiptUrl: data.receiptUrl || null,
    receiptName: data.receiptName || null,
    history: Array.isArray(data.history) ? data.history : [],
    createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
