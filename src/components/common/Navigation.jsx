import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <Link to="/" className={isActive('/') ? 'active' : ''}>
        Home
      </Link>
      <Link to="/learning-path" className={isActive('/learning-path') ? 'active' : ''}>
        Learning Path
      </Link>
      {user && (
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          Dashboard
        </Link>
      )}
      <Link to="/referral" className={isActive('/referral') ? 'active' : ''}>
        Referral
      </Link>
      <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
        Contact
      </Link>
    </nav>
  );
};

export default Navigation;
