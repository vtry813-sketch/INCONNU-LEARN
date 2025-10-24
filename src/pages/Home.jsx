import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Master JavaScript from Zero to Pro</h1>
            <p>
              Join INCONNU LEARN and embark on a structured journey through 50 levels 
              of JavaScript mastery. Learn, practice, and become a professional developer.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Continue Learning
                </Link>
              ) : (
                <Link to="/signup" className="btn btn-primary btn-large">
                  Start Learning Free
                </Link>
              )}
              <Link to="/learning-path" className="btn btn-outline btn-large">
                View Learning Path
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/hero-bg.svg" alt="JavaScript Learning" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose INCONNU LEARN?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Structured Learning</h3>
              <p>50 carefully designed levels from absolute beginner to professional developer</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🆓</div>
              <h3>Free Start</h3>
              <p>First 10 levels completely free. No credit card required to start</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Learn by Doing</h3>
              <p>Interactive coding exercises and real-world projects in every level</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🪙</div>
              <h3>Earn & Learn</h3>
              <p>Earn coins through referrals to unlock advanced levels faster</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up Free</h3>
              <p>Create your account and get immediate access to the first 10 levels</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Learn & Practice</h3>
              <p>Complete theory lessons and coding exercises at each level</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Earn Coins</h3>
              <p>Share your referral link to earn coins for unlocking advanced levels</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Become Pro</h3>
              <p>Progress through all 50 levels to become a JavaScript professional</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Start Your JavaScript Journey?</h2>
          <p>Join thousands of learners mastering JavaScript with INCONNU LEARN</p>
          {!user && (
            <Link to="/signup" className="btn btn-primary btn-large">
              Sign Up Free Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
