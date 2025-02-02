import React from 'react';
import './ColorOptions.css';

const ColorOptions = ({ colors, onGuess, disabled }) => {
  return (
    <div className="color-options-container">
      <div className="color-options">
        {colors.map((color, index) => (
          <button
            key={index}
            data-testid="colorOption"
            className="color-button"
            style={{ backgroundColor: color }}
            onClick={() => onGuess(color)}
            disabled={disabled}
          >
            <div className="button-shine"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorOptions; 