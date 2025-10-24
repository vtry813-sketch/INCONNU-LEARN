import React, { useState } from 'react';

const QuizComponent = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const question = quiz.questions[currentQuestion];

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      calculateScore(newAnswers);
    }
  };

  const calculateScore = (userAnswers) => {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    onComplete(score);
  };

  if (showResult) {
    const correctCount = answers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;
    
    return (
      <div className="quiz-result">
        <h3>Quiz Complete!</h3>
        <div className="score">
          You got {correctCount} out of {quiz.questions.length} correct!
        </div>
        <div className="score-percentage">
          Score: {Math.round((correctCount / quiz.questions.length) * 100)}%
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-component">
      <div className="quiz-progress">
        Question {currentQuestion + 1} of {quiz.questions.length}
      </div>
      
      <div className="question">
        <h4>{question.question}</h4>
        
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
