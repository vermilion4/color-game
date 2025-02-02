import React, { useState, useEffect } from 'react';
import './ColorBox.css';

const ColorBox = ({ color, showColor, shake }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (showColor) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  }, [showColor]);

  return (
    <div className="color-box-container" data-testid="colorBox">
      <div className={`color-box-flipper ${isFlipped ? 'flipped' : ''} ${shake ? 'shake' : ''}`}>
        <div className="color-box-front">
          <span>?</span>
        </div>
        <div 
          className="color-box-back"
          style={{ backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

export default ColorBox; 