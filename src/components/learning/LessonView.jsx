import React, { useState } from 'react';
import TheorySection from './TheorySection';
import PracticeSection from './PracticeSection';
import { useUser } from '../../contexts/UserContext';

const LessonView = ({ level, lesson }) => {
  const [activeTab, setActiveTab] = useState('theory');
  const { updateProgress } = useUser();

  const handleLessonComplete = async (score) => {
    try {
      await updateProgress(level._id, score);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="lesson-view">
      <div className="lesson-header">
        <h2>{lesson.title}</h2>
        <p>{lesson.description}</p>
      </div>
      
      <div className="lesson-tabs">
        <button 
          className={`tab ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          Theory
        </button>
        <button 
          className={`tab ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          Practice
        </button>
      </div>
      
      <div className="lesson-content">
        {activeTab === 'theory' ? (
          <TheorySection content={lesson.theory} />
        ) : (
          <PracticeSection 
            exercises={lesson.exercises}
            onComplete={handleLessonComplete}
          />
        )}
      </div>
    </div>
  );
};

export default LessonView;
