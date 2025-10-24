import React from 'react';

const TheorySection = ({ content }) => {
  return (
    <div className="theory-section">
      <div 
        className="theory-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <div className="theory-tips">
        <h4>💡 Key Points to Remember:</h4>
        <ul>
          {content.keyPoints?.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TheorySection;
