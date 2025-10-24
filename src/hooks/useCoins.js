import { useContext } from 'react';
import { CoinContext } from '../contexts/CoinContext';

export const useCoins = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error('useCoins must be used within an CoinProvider');
  }
  return context;
};
