import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const CoinBalance = () => {
  const { userData } = useUser();

  if (!userData) return null;

  return (
    <div className="coin-balance-card">
      <div className="coin-header">
        <img src="/icons/coin.svg" alt="Coins" />
        <h3>Your Coins</h3>
      </div>
      
      <div className="coin-amount">
        <span className="amount">{userData.coins}</span>
        <span className="label">Available Coins</span>
      </div>
      
      <div className="coin-actions">
        <Link to="/wallet" className="btn btn-primary">
          Transfer Coins
        </Link>
        <Link to="/referral" className="btn btn-outline">
          Earn More
        </Link>
      </div>
      
      <div className="coin-info">
        <p>Use coins to unlock advanced levels and accelerate your learning journey.</p>
      </div>
    </div>
  );
};

export default CoinBalance;
