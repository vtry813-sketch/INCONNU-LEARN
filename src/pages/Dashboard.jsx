import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import UserProfile from '../components/dashboard/UserProfile';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import CoinBalance from '../components/dashboard/CoinBalance';
import ReferralSystem from '../components/dashboard/ReferralSystem';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { userData, loading } = useUser();

  if (!user) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please sign in to access your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {userData?.name}!</h1>
          <p>Continue your JavaScript learning journey</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <ProgressTracker />
            <ReferralSystem />
          </div>
          
          <div className="dashboard-sidebar">
            <UserProfile />
            <CoinBalance />
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <a href="/learning-path" className="action-btn">
              <span className="icon">📚</span>
              <span>Continue Learning</span>
            </a>
            <a href="/referral" className="action-btn">
              <span className="icon">👥</span>
              <span>Invite Friends</span>
            </a>
            <a href="/wallet" className="action-btn">
              <span className="icon">💰</span>
              <span>Manage Coins</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
