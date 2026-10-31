/**
 * User Model and Preference Schema Definition
 */

/**
 * Normalizes and validates User fields
 * @param {Object} data 
 * @returns {Object} Validated user object
 */
export function validateAndFormatUser(data = {}) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('name is required and must be a non-empty string');
  }

  if (!data.email || typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email.trim())) {
    errors.push('email is required and must be a valid email address');
  }

  let reminderDaysBefore = 3;
  if (data.reminderDaysBefore !== undefined && data.reminderDaysBefore !== null) {
    const parsedDays = Number(data.reminderDaysBefore);
    if (!Number.isInteger(parsedDays) || parsedDays < 0) {
      errors.push('reminderDaysBefore must be a non-negative integer');
    } else {
      reminderDaysBefore = parsedDays;
    }
  }

  let pushToken = null;
  if (data.pushToken !== undefined && data.pushToken !== null) {
    if (typeof data.pushToken === 'string' && data.pushToken.trim()) {
      pushToken = data.pushToken.trim();
    }
  }

  if (errors.length > 0) {
    const err = new Error(`Validation Error: ${errors.join('; ')}`);
    err.name = 'ValidationError';
    err.details = errors;
    throw err;
  }

  return {
    id: data.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    pushToken,
    reminderDaysBefore,
    createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

