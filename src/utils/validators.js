/**
 * Validators — Form validation
 */
export const validateUPI = (upiId) => {
  if (!upiId || !upiId.trim()) {
    return { valid: false, message: 'UPI ID is required' };
  }
  const upiRegex = /^[a-zA-Z0-9.\-]{2,256}@[a-zA-Z]{2,64}$/;
  if (!upiRegex.test(upiId.trim())) {
    return { valid: false, message: 'Invalid UPI ID format' };
  }
  return { valid: true };
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { valid: false, message: 'Mobile number is required' };
  }
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return { valid: false, message: 'Invalid mobile number' };
  }
  return { valid: true };
};

export const validateAmount = (amount, min = 1) => {
  const num = Number(amount);
  if (!num || isNaN(num)) {
    return { valid: false, message: 'Enter a valid amount' };
  }
  if (num < min) {
    return { valid: false, message: `Minimum amount is ₹${min}` };
  }
  return { valid: true };
};

export const validateOTP = (otp) => {
  if (!otp || otp.length !== 6) {
    return { valid: false, message: 'Enter 6-digit OTP' };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  return { valid: true };
};

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Invalid email address' };
  }
  return { valid: true };
};
