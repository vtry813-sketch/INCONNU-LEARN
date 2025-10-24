import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const LevelCard = ({ level, userProgress }) => {
  const { userData, unlockLevel } = useUser();
  const progress = userProgress.find(p => p.levelId === level._id);
  const isUnlocked = level.levelNumber <= 10 || progress?.unlocked;
  const isCompleted = progress?.completed;
  const canAfford = userData?.coins >= level.coinsRequired;

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (canAfford) {
      try {
        await unlockLevel(level._id);
      } catch (error) {
        console.error('Error unlocking level:', error);
      }
    }
  };

  return (
    <div className={`level-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}>
      <div className="level-header">
        <div className="level-number">Level {level.levelNumber}</div>
        {isCompleted && <div className="level-badge">Completed</div>}
        {!isUnlocked && <div className="level-badge locked">Locked</div>}
      </div>
      
      <h3 className="level-title">{level.title}</h3>
      <p className="level-description">{level.description}</p>
      
      <div className="level-difficulty">
        <span className={`difficulty-${level.difficulty}`}>
          {level.difficulty}
        </span>
      </div>
      
      <div className="level-reward">
        <img src="/icons/coin.svg" alt="Coins" />
        <span>+{level.coinsReward} coins</span>
      </div>
      
      <div className="level-actions">
        {isUnlocked ? (
          <Link 
            to={`/level/${level._id}`} 
            className="btn btn-primary"
          >
            {isCompleted ? 'Review' : 'Start Learning'}
          </Link>
        ) : (
          <button 
            className={`btn ${canAfford ? 'btn-primary' : 'btn-disabled'}`}
            onClick={handleUnlock}
            disabled={!canAfford}
          >
            {canAfford ? (
              `Unlock for ${level.coinsRequired} coins`
            ) : (
              `Need ${level.coinsRequired} coins`
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default LevelCard;
