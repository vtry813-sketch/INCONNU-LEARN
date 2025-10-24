import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';

const ReferralSystem = () => {
  const { userData } = useUser();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/signup?ref=${userData?.referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!userData) return null;

  return (
    <div className="referral-card">
      <h3>Referral Program</h3>
      <p>Share your link and earn coins when friends sign up!</p>
      
      <div className="referral-stats">
        <div className="stat">
          <span className="number">{userData.referrals || 0}</span>
          <span className="label">Total Referrals</span>
        </div>
        <div className="stat">
          <span className="number">{(userData.referrals || 0) * 50}</span>
          <span className="label">Coins Earned</span>
        </div>
      </div>
      
      <div className="referral-link">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="link-input"
        />
        <button 
          onClick={copyToClipboard}
          className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <div className="referral-benefits">
        <h4>How it works:</h4>
        <ul>
          <li>Share your referral link with friends</li>
          <li>Get 50 coins when they sign up</li>
          <li>They get 25 bonus coins too!</li>
          <li>Unlock levels faster with more coins</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralSystem;
