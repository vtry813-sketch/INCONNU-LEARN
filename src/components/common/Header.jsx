import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import Navigation from './Navigation';
import '../../styles/components/header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { userData } = useUser();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="INCONNU LEARN" />
          <span>INCONNU LEARN</span>
        </Link>

        <Navigation />

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <div 
                className="user-info"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="user-name">{user.name}</span>
                <div className="coin-balance">
                  <img src="/icons/coin.svg" alt="Coins" />
                  <span>{userData?.coins || 0}</span>
                </div>
              </div>
              
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/wallet" onClick={() => setIsMenuOpen(false)}>
                    My Wallet
                  </Link>
                  {user.email === 'inconnuboytech@gmail.com' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up Free</Link>
            </div>
          )}

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
