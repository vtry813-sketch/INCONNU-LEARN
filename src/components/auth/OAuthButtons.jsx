import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const OAuthButtons = () => {
  const { githubLogin } = useAuth();

  return (
    <div className="oauth-buttons">
      <button 
        type="button" 
        className="btn btn-github"
        onClick={githubLogin}
      >
        <img src="/icons/github.svg" alt="GitHub" />
        Continue with GitHub
      </button>
    </div>
  );
};

export default OAuthButtons;
