import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import LessonView from '../components/learning/LessonView';
import '../styles/pages/level-detail.css';

const LevelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userData, unlockLevel } = useUser();
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLesson, setActiveLesson] = useState(0);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        const response = await fetch(`/api/levels/${id}`);
        if (response.ok) {
          const data = await response.json();
          setLevel(data.level);
        } else {
          throw new Error('Level not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLevel();
    }
  }, [id, user]);

  const handleUnlockLevel = async () => {
    try {
      await unlockLevel(id);
      // Refresh level data
      const response = await fetch(`/api/levels/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLevel(data.level);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="level-detail">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please sign in to access this level.</p>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="level-detail">
        <div className="container">
          <div className="loading">Loading level...</div>
        </div>
      </div>
    );
  }

  if (error || !level) {
    return (
      <div className="level-detail">
        <div className="container">
          <div className="error-message">
            {error || 'Level not found'}
            <Link to="/learning-path" className="btn btn-outline">
              Back to Learning Path
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isUnlocked = userData?.unlockedLevels?.includes(level.levelNumber);
  const canAfford = userData?.coins >= level.coinsRequired;

  if (!isUnlocked) {
    return (
      <div className="level-detail">
        <div className="container">
          <div className="level-locked">
            <div className="lock-icon">🔒</div>
            <h2>Level {level.levelNumber} is Locked</h2>
            <p>{level.title}</p>
            <div className="unlock-requirements">
              <p>This level requires {level.coinsRequired} coins to unlock.</p>
              <div className="user-balance">
                Your balance: <strong>{userData?.coins || 0} coins</strong>
              </div>
            </div>
            <div className="unlock-actions">
              {canAfford ? (
                <button onClick={handleUnlockLevel} className="btn btn-primary">
                  Unlock for {level.coinsRequired} coins
                </button>
              ) : (
                <div className="insufficient-coins">
                  <p>You need {level.coinsRequired - (userData?.coins || 0)} more coins</p>
                  <Link to="/referral" className="btn btn-secondary">
                    Earn Coins
                  </Link>
                </div>
              )}
              <Link to="/learning-path" className="btn btn-outline">
                Back to Learning Path
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson = level.lessons[activeLesson];

  return (
    <div className="level-detail">
      <div className="container">
        {/* Level Header */}
        <div className="level-header">
          <div className="level-info">
            <div className="level-breadcrumb">
              <Link to="/learning-path">Learning Path</Link>
              <span> / </span>
              <span>Level {level.levelNumber}</span>
            </div>
            <h1>{level.title}</h1>
            <p>{level.description}</p>
            <div className="level-meta">
              <span className={`difficulty difficulty-${level.difficulty}`}>
                {level.difficulty}
              </span>
              <span className="coins-reward">
                <img src="/icons/coin.svg" alt="Coins" />
                +{level.coinsReward} coins upon completion
              </span>
            </div>
          </div>
          <div className="level-actions">
            <Link to="/learning-path" className="btn btn-outline">
              Back to Path
            </Link>
          </div>
        </div>

        {/* Lessons Navigation */}
        <div className="lessons-nav">
          {level.lessons.map((lesson, index) => (
            <button
              key={index}
              className={`lesson-tab ${activeLesson === index ? 'active' : ''}`}
              onClick={() => setActiveLesson(index)}
            >
              <span className="lesson-number">Lesson {index + 1}</span>
              <span className="lesson-title">{lesson.title}</span>
            </button>
          ))}
        </div>

        {/* Lesson Content */}
        <div className="lesson-content">
          <LessonView 
            level={level}
            lesson={currentLesson}
          />
        </div>

        {/* Lesson Navigation */}
        <div className="lesson-navigation">
          {activeLesson > 0 && (
            <button 
              className="btn btn-outline"
              onClick={() => setActiveLesson(activeLesson - 1)}
            >
              Previous Lesson
            </button>
          )}
          {activeLesson < level.lessons.length - 1 && (
            <button 
              className="btn btn-primary"
              onClick={() => setActiveLesson(activeLesson + 1)}
            >
              Next Lesson
            </button>
          )}
          {activeLesson === level.lessons.length - 1 && (
            <button className="btn btn-success">
              Complete Level
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelDetail;
