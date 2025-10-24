import React, { createContext, useState, useContext } from 'react';
import { coinService } from '../services/coins';

const CoinContext = createContext();

export const useCoins = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error('useCoins must be used within an CoinProvider');
  }
  return context;
};

export const CoinProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const transferCoins = async (recipientEmail, amount) => {
    try {
      setLoading(true);
      const response = await coinService.transfer(recipientEmail, amount);
      setTransactions(prev => [response.transaction, ...prev]);
      return response;
    } catch (error) {
      console.error('Error transferring coins:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionHistory = async () => {
    try {
      const history = await coinService.getHistory();
      setTransactions(history);
      return history;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  };

  const addReferralCoins = async (referralCode) => {
    try {
      const response = await coinService.addReferralCoins(referralCode);
      return response;
    } catch (error) {
      console.error('Error adding referral coins:', error);
      throw error;
    }
  };

  const value = {
    transactions,
    loading,
    transferCoins,
    getTransactionHistory,
    addReferralCoins
  };

  return (
    <CoinContext.Provider value={value}>
      {children}
    </CoinContext.Provider>
  );
};
