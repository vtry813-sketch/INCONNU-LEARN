export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateName = (name) => {
  return name.length >= 2 && name.length <= 50;
};

export const validateCoinAmount = (amount, maxAmount) => {
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, error: 'Amount must be a positive number' };
  }
  
  if (amount > maxAmount) {
    return { isValid: false, error: `Amount cannot exceed ${maxAmount} coins` };
  }
  
  return { isValid: true, error: '' };
};
