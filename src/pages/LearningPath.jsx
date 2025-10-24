import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useLevels } from '../hooks/useLevels';
import LevelCard from '../components/learning/LevelCard';
import '../styles/pages/learning-path.css';

const LearningPath = () => {
  const { user } = useAuth();
  const { userData, progress } = useUser();
  const { levels, loading, error } = useLevels();
  const [filter, setFilter] = useState('all');

  if (!user) {
    return (
      <div className="learning-path">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please sign in to access the learning path.</p>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredLevels = levels.filter(level => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return userData?.unlockedLevels?.includes(level.levelNumber);
    if (filter === 'completed') return progress.find(p => p.levelId === level._id)?.completed;
    return true;
  });

  const getDifficultyStats = () => {
    const stats = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      expert: 0
    };
    
    levels.forEach(level => {
      if (stats[level.difficulty] !== undefined) {
        stats[level.difficulty]++;
      }
    });
    
    return stats;
  };

  const difficultyStats = getDifficultyStats();

  return (
    <div className="learning-path">
      <div className="container">
        <div className="learning-path-header">
          <h1>JavaScript Learning Path</h1>
          <p>Progress through 50 levels to become a JavaScript expert</p>
        </div>

        {/* Stats Overview */}
        <div className="path-stats">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <span className="stat-number">{levels.length}</span>
              <span className="stat-label">Total Levels</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔓</div>
            <div className="stat-info">
              <span className="stat-number">
                {userData?.unlockedLevels?.length || 10}
              </span>
              <span className="stat-label">Unlocked Levels</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-number">
                {progress.filter(p => p.completed).length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🪙</div>
            <div className="stat-info">
              <span className="stat-number">{userData?.coins || 0}</span>
              <span className="stat-label">Available Coins</span>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="difficulty-breakdown">
          <h3>Difficulty Distribution</h3>
          <div className="difficulty-bars">
            <div className="difficulty-bar beginner">
              <span className="label">Beginner</span>
              <div className="bar">
                <div 
                  className="fill" 
                  style={{ width: `${(difficultyStats.beginner / levels.length) * 100}%` }}
                ></div>
              </div>
              <span className="count">{difficultyStats.beginner}</span>
            </div>
            <div className="difficulty-bar intermediate">
              <span className="label">Intermediate</span>
              <div className="bar">
                <div 
                  className="fill" 
                  style={{ width: `${(difficultyStats.intermediate / levels.length) * 100}%` }}
                ></div>
              </div>
              <span className="count">{difficultyStats.intermediate}</span>
            </div>
            <div className="difficulty-bar advanced">
              <span className="label">Advanced</span>
              <div className="bar">
                <div 
                  className="fill" 
                  style={{ width: `${(difficultyStats.advanced / levels.length) * 100}%` }}
                ></div>
              </div>
              <span className="count">{difficultyStats.advanced}</span>
            </div>
            <div className="difficulty-bar expert">
              <span className="label">Expert</span>
              <div className="bar">
                <div 
                  className="fill" 
                  style={{ width: `${(difficultyStats.expert / levels.length) * 100}%` }}
                ></div>
              </div>
              <span className="count">{difficultyStats.expert}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="path-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Levels
          </button>
          <button 
            className={`filter-btn ${filter === 'unlocked' ? 'active' : ''}`}
            onClick={() => setFilter('unlocked')}
          >
            Unlocked
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Levels Grid */}
        {loading ? (
          <div className="loading">Loading learning path...</div>
        ) : error ? (
          <div className="error-message">
            Error loading levels: {error}
          </div>
        ) : (
          <div className="levels-grid">
            {filteredLevels.map(level => (
              <LevelCard 
                key={level._id || level.id}
                level={level}
                userProgress={progress}
              />
            ))}
          </div>
        )}

        {/* Need More Coins Section */}
        {userData?.coins < 100 && (
          <div className="coins-cta">
            <div className="coins-cta-content">
              <h3>Need more coins to unlock levels?</h3>
              <p>Invite friends and earn coins to continue your learning journey</p>
              <Link to="/referral" className="btn btn-primary">
                Earn Coins Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPath;
