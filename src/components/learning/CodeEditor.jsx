import React, { useState } from 'react';

const CodeEditor = ({ exercise, onComplete }) => {
  const [code, setCode] = useState(exercise.initialCode || '');
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const runCode = () => {
    try {
      // Simple code execution for demonstration
      // In production, this would use a secure code execution service
      const result = eval(code);
      setOutput(String(result));
      
      // Check if solution matches expected output
      const isSolutionCorrect = exercise.testCases.every(testCase => {
        try {
          return eval(testCase.code) === testCase.expected;
        } catch {
          return false;
        }
      });
      
      setIsCorrect(isSolutionCorrect);
      
      if (isSolutionCorrect) {
        onComplete(100); // Perfect score for correct solution
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsCorrect(false);
    }
  };

  const resetCode = () => {
    setCode(exercise.initialCode || '');
    setOutput('');
    setIsCorrect(null);
  };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <h4>Code Exercise</h4>
        <div className="editor-actions">
          <button onClick={resetCode} className="btn btn-outline">
            Reset
          </button>
          <button onClick={runCode} className="btn btn-primary">
            Run Code
          </button>
        </div>
      </div>
      
      <textarea
        className="code-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your JavaScript code here..."
        rows={15}
      />
      
      <div className="output-section">
        <h5>Output:</h5>
        <pre className="output">{output || 'Run your code to see output...'}</pre>
        
        {isCorrect !== null && (
          <div className={`result ${isCorrect ? 'success' : 'error'}`}>
            {isCorrect ? '✅ Correct solution!' : '❌ Try again!'}
          </div>
        )}
      </div>
      
      <div className="exercise-hint">
        <strong>Hint:</strong> {exercise.hint}
      </div>
    </div>
  );
};

export default CodeEditor;
