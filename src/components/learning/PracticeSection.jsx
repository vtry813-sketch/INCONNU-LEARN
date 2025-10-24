import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import QuizComponent from './QuizComponent';

const PracticeSection = ({ exercises, onComplete }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completed, setCompleted] = useState([]);

  const exercise = exercises[currentExercise];

  const handleExerciseComplete = (score) => {
    const newCompleted = [...completed, { exerciseId: exercise.id, score }];
    setCompleted(newCompleted);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      const totalScore = newCompleted.reduce((sum, comp) => sum + comp.score, 0);
      const averageScore = Math.round(totalScore / exercises.length);
      onComplete(averageScore);
    }
  };

  return (
    <div className="practice-section">
      <div className="exercise-progress">
        <span>Exercise {currentExercise + 1} of {exercises.length}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="exercise-content">
        <h3>{exercise.title}</h3>
        <p>{exercise.description}</p>
        
        {exercise.type === 'coding' ? (
          <CodeEditor 
            exercise={exercise}
            onComplete={handleExerciseComplete}
          />
        ) : (
          <QuizComponent 
            quiz={exercise}
            onComplete={handleExerciseComplete}
          />
        )}
      </div>
    </div>
  );
};

export default PracticeSection;
