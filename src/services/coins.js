import api from './api';

export const coinService = {
  transfer: async (recipientEmail, amount, note = '') => {
    const response = await api.post('/coins/transfer', {
      recipientEmail,
      amount: parseInt(amount),
      note
    });
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get('/coins/balance');
    return response.data;
  },

  getTransactionHistory: async () => {
    const response = await api.get('/coins/transactions');
    return response.data;
  },

  addReferralCoins: async (referralCode) => {
    const response = await api.post('/coins/add-referral', { referralCode });
    return response.data;
  },

  // Utility function to format coin amounts
  formatCoins: (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toString();
  }
};
