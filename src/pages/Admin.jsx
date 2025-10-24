import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/api';
import '../styles/pages/admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [coinForm, setCoinForm] = useState({
    userId: '',
    amount: '',
    note: ''
  });

  useEffect(() => {
    if (user && user.email === 'inconnuboytech@gmail.com') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, usersData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers()
      ]);
      setDashboardData(dashboard);
      setUsers(usersData.users);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoins = async (e) => {
    e.preventDefault();
    try {
      await adminService.addCoins(coinForm.userId, parseInt(coinForm.amount), coinForm.note);
      alert('Coins added successfully!');
      setCoinForm({ userId: '', amount: '', note: '' });
      loadDashboardData(); // Refresh data
    } catch (error) {
      alert('Error adding coins: ' + error.message);
    }
  };

  if (!user || user.email !== 'inconnuboytech@gmail.com') {
    return (
      <div className="admin">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You must be an administrator to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin">
        <div className="container">
          <div className="loading">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        {/* Admin Tabs */}
        <div className="admin-tabs">
          <nav className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button 
              className={`tab-btn ${activeTab === 'coins' ? 'active' : ''}`}
              onClick={() => setActiveTab('coins')}
            >
              Manage Coins
            </button>
          </nav>

          <div className="tab-content">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && dashboardData && (
              <div className="dashboard-tab">
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <div className="stat-number">{dashboardData.stats.totalUsers}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Total Transactions</h3>
                    <div className="stat-number">{dashboardData.stats.totalTransactions}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Total Coins</h3>
                    <div className="stat-number">
                      {dashboardData.stats.totalCoins.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="recent-users">
                  <h3>Recent Users</h3>
                  <div className="users-list">
                    {dashboardData.recentUsers.map(user => (
                      <div key={user._id} className="user-item">
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                        <div className="user-stats">
                          <span className="coins">{user.coins} coins</span>
                          <span className="join-date">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="users-tab">
                <div className="users-list">
                  {users.map(user => (
                    <div key={user._id} className="user-card">
                      <div className="user-main">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                          <span className="user-id">ID: {user._id}</span>
                        </div>
                      </div>
                      <div className="user-stats">
                        <div className="stat">
                          <span className="label">Coins</span>
                          <span className="value">{user.coins}</span>
                        </div>
                        <div className="stat">
                          <span className="label">Level</span>
                          <span className="value">{user.currentLevel}</span>
                        </div>
                        <div className="stat">
                          <span className="label">Referrals</span>
                          <span className="value">{user.referrals || 0}</span>
                        </div>
                      </div>
                      <div className="user-actions">
                        <button 
                          className="btn btn-outline"
                          onClick={() => {
                            setCoinForm(prev => ({ ...prev, userId: user._id }));
                            setActiveTab('coins');
                          }}
                        >
                          Add Coins
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coins Tab */}
            {activeTab === 'coins' && (
              <div className="coins-tab">
                <div className="add-coins-form">
                  <h3>Add Coins to User</h3>
                  <form onSubmit={handleAddCoins}>
                    <div className="form-group">
                      <label>User ID</label>
                      <input
                        type="text"
                        value={coinForm.userId}
                        onChange={(e) => setCoinForm(prev => ({ ...prev, userId: e.target.value }))}
                        required
                        placeholder="Enter user ID"
                      />
                    </div>
                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        type="number"
                        value={coinForm.amount}
                        onChange={(e) => setCoinForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                        min="1"
                        placeholder="Enter coin amount"
                      />
                    </div>
                    <div className="form-group">
                      <label>Note (Optional)</label>
                      <input
                        type="text"
                        value={coinForm.note}
                        onChange={(e) => setCoinForm(prev => ({ ...prev, note: e.target.value }))}
                        placeholder="Add a note for this transaction"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Add Coins
                    </button>
                  </form>
                </div>

                <div className="admin-info">
                  <h4>Admin Account Information</h4>
                  <div className="info-card">
                    <p><strong>Email:</strong> inconnuboytech@gmail.com</p>
                    <p><strong>Coins:</strong> 9,999,999,999 (Unlimited)</p>
                    <p><strong>Access Level:</strong> Super Administrator</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
