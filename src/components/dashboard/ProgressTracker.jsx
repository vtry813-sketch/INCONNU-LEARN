import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ProgressTracker = () => {
  const { progress, userData } = useUser();

  const calculateProgress = () => {
    const completedLevels = progress.filter(p => p.completed).length;
    return Math.round((completedLevels / 50) * 100);
  };

  const overallProgress = calculateProgress();

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h3>Learning Progress</h3>
        <span>{overallProgress}% Complete</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${overallProgress}%` }}
        ></div>
      </div>
      
      <div className="progress-details">
        <div className="progress-item">
          <span className="label">Current Level:</span>
          <span className="value">Level {userData?.currentLevel || 1}</span>
        </div>
        <div className="progress-item">
          <span className="label">Levels Completed:</span>
          <span className="value">
            {progress.filter(p => p.completed).length} / 50
          </span>
        </div>
        <div className="progress-item">
          <span className="label">Next Level Cost:</span>
          <span className="value">
            {userData?.currentLevel && userData.currentLevel < 10 
              ? 'Free' 
              : `${(userData?.currentLevel || 1) * 10} coins`
            }
          </span>
        </div>
      </div>
      
      <Link to="/learning-path" className="btn btn-outline full-width">
        Continue Learning
      </Link>
    </div>
  );
};

export default ProgressTracker;
