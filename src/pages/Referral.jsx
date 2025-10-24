import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import '../styles/pages/referral.css';

const Referral = () => {
  const { user } = useAuth();
  const { userData } = useUser();
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    coinsEarned: 0,
    potentialEarnings: 0
  });

  useEffect(() => {
    if (userData) {
      setReferralStats({
        totalReferrals: userData.referrals || 0,
        coinsEarned: (userData.referrals || 0) * 50,
        potentialEarnings: ((userData.referrals || 0) + 10) * 50
      });
    }
  }, [userData]);

  const referralLink = userData 
    ? `${window.location.origin}/signup?ref=${userData.referralCode}`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnSocialMedia = (platform) => {
    const text = `Join me on INCONNU LEARN and master JavaScript! Use my referral link to get bonus coins: ${referralLink}`;
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (!user) {
    return (
      <div className="referral-page">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please sign in to access the referral program.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="referral-page">
      <div className="container">
        <div className="referral-header">
          <h1>Referral Program</h1>
          <p>Invite friends and earn coins to unlock more levels</p>
        </div>

        {/* Stats Overview */}
        <div className="referral-stats-overview">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-number">{referralStats.totalReferrals}</span>
              <span className="stat-label">Total Referrals</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🪙</div>
            <div className="stat-info">
              <span className="stat-number">{referralStats.coinsEarned}</span>
              <span className="stat-label">Coins Earned</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <span className="stat-number">{referralStats.potentialEarnings}</span>
              <span className="stat-label">Potential Earnings</span>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="referral-link-section">
          <div className="section-header">
            <h2>Your Referral Link</h2>
            <p>Share this link with your friends to earn 50 coins for each signup</p>
          </div>
          
          <div className="referral-link-container">
            <div className="link-display">
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
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="quick-share">
            <h3>Share Quickly</h3>
            <div className="share-buttons">
              <button 
                onClick={() => shareOnSocialMedia('whatsapp')}
                className="btn btn-whatsapp"
              >
                WhatsApp
              </button>
              <button 
                onClick={() => shareOnSocialMedia('telegram')}
                className="btn btn-telegram"
              >
                Telegram
              </button>
              <button 
                onClick={() => shareOnSocialMedia('twitter')}
                className="btn btn-twitter"
              >
                Twitter
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Share Your Link</h3>
                <p>Share your unique referral link with friends, family, or on social media</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>They Sign Up</h3>
                <p>Your friends sign up using your link and start learning JavaScript</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>You Both Earn</h3>
                <p>You get 50 coins, and they get 25 bonus coins to start their journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <h2>Why Refer Friends?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🚀</div>
              <h3>Unlock Levels Faster</h3>
              <p>Earn coins to unlock advanced levels and accelerate your learning progress</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">👨‍👩‍👧‍👦</div>
              <h3>Learn Together</h3>
              <p>Build a learning community and help others start their coding journey</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💫</div>
              <h3>Unlimited Potential</h3>
              <p>No limits on how many friends you can refer. The more you share, the more you earn!</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How many coins do I get per referral?</h3>
              <p>You receive 50 coins for each friend who signs up using your referral link.</p>
            </div>
            <div className="faq-item">
              <h3>Do my friends get anything?</h3>
              <p>Yes! Your friends receive 25 bonus coins when they sign up with your link.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a limit to how many people I can refer?</h3>
              <p>No, there's no limit! You can refer as many people as you want.</p>
            </div>
            <div className="faq-item">
              <h3>When do I receive my coins?</h3>
              <p>Coins are added to your account immediately after your friend completes registration.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="referral-cta">
          <h2>Start Earning Coins Today!</h2>
          <p>Share your link and help others discover the joy of learning JavaScript</p>
          <div className="cta-buttons">
            <button onClick={copyToClipboard} className="btn btn-primary btn-large">
              Copy Your Referral Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
