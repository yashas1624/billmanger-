/**
 * Formatters — INR currency, phone, UPI, dates
 */
export const formatINR = (amount, options = {}) => {
  const { showSymbol = true, minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;
  // Ensure minimum <= maximum to avoid RangeError
  const minDigits = Math.min(minimumFractionDigits, maximumFractionDigits);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: minDigits,
    maximumFractionDigits,
    currencyDisplay: showSymbol ? 'symbol' : 'code',
  }).format(amount);
};

export const formatAmount = (amount, options = {}) => {
  const { showSymbol = false, minimumFractionDigits = 0, maximumFractionDigits = 0 } = options;
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits,
    ...(showSymbol ? { style: 'currency', currency: 'INR', currencyDisplay: 'symbol' } : {}),
  }).format(amount);
};

export const formatPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5)}`;
  }
  return phone;
};

export const formatUPI = (upiId) => {
  return upiId;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

export const maskAccountNumber = (accountNumber, visible = 4) => {
  const str = String(accountNumber);
  if (str.length <= visible) return str;
  return '*'.repeat(str.length - visible) + str.slice(-visible);
};

export const maskUPI = (upiId) => {
  const [user, domain] = upiId.split('@');
  if (!user || !domain) return upiId;
  const maskedUser = user.length > 2 ? user[0] + '*'.repeat(user.length - 2) + user[user.length - 1] : user;
  return `${maskedUser}@${domain}`;
};

export const maskPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 2)}******${digits.slice(-2)}`;
  }
  return phone;
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length = 30) => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};
