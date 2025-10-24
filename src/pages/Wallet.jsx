import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import TransferCoins from '../components/coins/TransferCoins';
import BuyCoins from '../components/coins/BuyCoins';
import TransactionHistory from '../components/coins/TransactionHistory';
import '../styles/pages/wallet.css';

const Wallet = () => {
  const { user } = useAuth();
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState('transfer');

  if (!user) {
    return (
      <div className="wallet">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please sign in to access your wallet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet">
      <div className="container">
        <div className="wallet-header">
          <h1>Your Wallet</h1>
          <p>Manage your coins and transactions</p>
        </div>

        {/* Balance Overview */}
        <div className="balance-overview">
          <div className="balance-card">
            <div className="balance-icon">
              <img src="/icons/coin.svg" alt="Coins" />
            </div>
            <div className="balance-info">
              <span className="balance-label">Available Balance</span>
              <span className="balance-amount">{userData?.coins || 0}</span>
              <span className="balance-unit">coins</span>
            </div>
          </div>
          
          <div className="balance-stats">
            <div className="balance-stat">
              <span className="stat-value">+{userData?.referrals * 50 || 0}</span>
              <span className="stat-label">From Referrals</span>
            </div>
            <div className="balance-stat">
              <span className="stat-value">+25</span>
              <span className="stat-label">Welcome Bonus</span>
            </div>
            <div className="balance-stat">
              <span className="stat-value">Level Rewards</span>
              <span className="stat-label">Complete levels to earn more</span>
            </div>
          </div>
        </div>

        {/* Wallet Tabs */}
        <div className="wallet-tabs">
          <nav className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`}
              onClick={() => setActiveTab('transfer')}
            >
              Transfer Coins
            </button>
            <button 
              className={`tab-btn ${activeTab === 'buy' ? 'active' : ''}`}
              onClick={() => setActiveTab('buy')}
            >
              Buy Coins
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Transaction History
            </button>
          </nav>

          <div className="tab-content">
            {activeTab === 'transfer' && <TransferCoins />}
            {activeTab === 'buy' && <BuyCoins />}
            {activeTab === 'history' && <TransactionHistory />}
          </div>
        </div>

        {/* Coin Usage Tips */}
        <div className="coin-tips">
          <h3>How to Use Your Coins</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🔓</div>
              <h4>Unlock Levels</h4>
              <p>Use coins to unlock advanced levels beyond the free ones</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">👥</div>
              <h4>Transfer to Friends</h4>
              <p>Help your friends by transferring coins to their accounts</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">⚡</div>
              <h4>Accelerate Learning</h4>
              <p>Unlock more content faster to become a pro quickly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
