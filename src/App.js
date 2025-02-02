import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ColorOptions from './components/ColorOptions/ColorOptions';
import ResultModal from './components/ResultModal/ResultModal';
import './App.css';

function App() {
  const [targetColor, setTargetColor] = useState('');
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [shake, setShake] = useState(false);

  // generate base color
  const generateBaseColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  };

  // Generate similar colors based on the target color
  const generateSimilarColors = (baseColor) => {
    const colors = [];
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1,3), 16);
    const g = parseInt(baseColor.slice(3,5), 16);
    const b = parseInt(baseColor.slice(5,7), 16);
    
    // Generate 5 similar colors with more noticeable variations
    for (let i = 0; i < 5; i++) {
      const variation = 30;
      let newR = Math.min(255, Math.max(0, r + Math.floor(Math.random() * variation * 2) - variation));
      let newG = Math.min(255, Math.max(0, g + Math.floor(Math.random() * variation * 2) - variation));
      let newB = Math.min(255, Math.max(0, b + Math.floor(Math.random() * variation * 2) - variation));
      
      // Ensure at least one channel has a minimum difference
      const minDiff = 20;
      const channel = Math.floor(Math.random() * 3);
      if (channel === 0) {
        newR = Math.min(255, Math.max(0, r + (Math.random() < 0.5 ? -minDiff : minDiff)));
      } else if (channel === 1) {
        newG = Math.min(255, Math.max(0, g + (Math.random() < 0.5 ? -minDiff : minDiff)));
      } else {
        newB = Math.min(255, Math.max(0, b + (Math.random() < 0.5 ? -minDiff : minDiff)));
      }
      
      const hex = `#${newR.toString(16).padStart(2,'0')}${newG.toString(16).padStart(2,'0')}${newB.toString(16).padStart(2,'0')}`;
      colors.push(hex);
    }
    return colors;
  };

  // generate colors
  const generateColors = () => {
    const baseColor = generateBaseColor();
    const similarColors = generateSimilarColors(baseColor);
    similarColors.push(baseColor);
    
    // Shuffle the colors
    const shuffled = [...similarColors].sort(() => Math.random() - 0.5);
    setTargetColor(baseColor);
    setColorOptions(shuffled);
    setButtonsDisabled(false);
    setShake(false);
  };

  const throwConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // color guess handler
  const handleColorGuess = (color) => {
    const correct = color === targetColor;
    setButtonsDisabled(true);
    
    if (correct) {
      throwConfetti();
      
      // Show modal after confetti
      setTimeout(() => {
        setIsCorrectGuess(true);
        setShowModal(true);
        setScore(prevScore => prevScore + 1);
      }, 500);
      
      setTimeout(() => {
        setShowModal(false);
        generateColors();
      }, 2000);
    } else {
      setShake(true);
      
      // Wait for shake animation to complete before showing modal
      setTimeout(() => {
        setIsCorrectGuess(false);
        setShowModal(true);
      }, 700);
      
      setTimeout(() => {
        setShowModal(false);
        setButtonsDisabled(false);
        setShake(false);
      }, 2000);
    }
  };

  // Start new game
  const handleNewGame = () => {
    setScore(0);
    setButtonsDisabled(false);
    generateColors();
  };

  // Initialize game
  useEffect(() => {
    generateColors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="game-container">
        <header>
          <div className="header-content">
            <h1>Color Match</h1>
            <div className="header-controls">
              {/* score */}
              <div className="score-container">
                <p className="score-label">Score</p>
                <p data-testid="score" className="score">
                  {score}
                </p>
              </div>
              {/* new game button */}
              <button 
                data-testid="newGameButton"
                onClick={handleNewGame}
                className="new-game-button"
              >
                New Game
              </button>
            </div>
          </div>
        </header>

        {/* instructions panel */}
        <div className="instructions">
          <p data-testid="gameInstructions" className="instruction-text">
            <span className="instruction-step">1</span> Look at the target color with the label "Match this color"
            <br />
            <span className="instruction-step">2</span> Find its exact match from the similar color options
            <br />
            <span className="instruction-step">3</span> Train your eye to spot subtle differences!
          </p>
          <div className="instruction-tip">
            Tip: Take your time! The colors are very similar.
          </div>
        </div>

        <main className="game-content">
          {/* target color */}
          <section className="target-section">
            <div data-testid="colorBox" className={`target-color ${shake ? 'shake' : ''}`} style={{ backgroundColor: targetColor }}>
              <span className="target-label">Match this color</span>
            </div>
          </section>

          {/* 6 color options */}
          <section className="options-section">
            <ColorOptions 
              colors={colorOptions} 
              onGuess={handleColorGuess}
              disabled={buttonsDisabled} 
            />
          </section>
        </main>

        {/* result modal - correct or wrong */}
        <ResultModal 
          isCorrect={isCorrectGuess}
          isVisible={showModal}
          score={score}
        />
      </div>
    </div>
  );
}

export default App;
