import React from 'react';
import { useUser } from '../../contexts/UserContext';

const UserProfile = () => {
  const { userData } = useUser();

  if (!userData) return null;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar">
          {userData.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h3>{userData.name}</h3>
          <p>{userData.email}</p>
          <span className="member-since">
            Member since {new Date(userData.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat">
          <span className="stat-value">{userData.level || 1}</span>
          <span className="stat-label">Current Level</span>
        </div>
        <div className="stat">
          <span className="stat-value">{userData.coins}</span>
          <span className="stat-label">Coins</span>
        </div>
        <div className="stat">
          <span className="stat-value">{userData.referrals || 0}</span>
          <span className="stat-label">Referrals</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
