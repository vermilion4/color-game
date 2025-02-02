import React from 'react';
import './ResultModal.css';

const ResultModal = ({ isCorrect, isVisible, score }) => {
  if (!isVisible) return null;

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`modal-content ${isCorrect ? 'correct' : 'wrong'}`}>
        <div className="modal-icon">
          {isCorrect ? '🎉' : '😅'}
        </div>
        <h2>{isCorrect ? 'Correct!' : 'Wrong!'}</h2>
        {isCorrect && <p>Current Score: {score}</p>}
        <p>{isCorrect ? 'Great job! Get ready for the next color...' : 'Try again!'}</p>
      </div>
    </div>
  );
};

export default ResultModal; 