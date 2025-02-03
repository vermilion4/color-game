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

  const colors = [
    '#FF0000',    // Red
    '#0000FF',    // Blue
    '#00FF00',    // Green
    '#FFFF00',    // Yellow
    '#800080',    // Purple
    '#FFA500',    // Orange
    '#008080',    // Teal
    '#FFC0CB',    // Pink
    '#A52A2A',    // Brown
    '#00FFFF'     // Cyan
];

  // randomly select a target color from predefined list
  function selectTargetColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  // generate colors
  const generateColors = () => {
    const target = selectTargetColor();
    // add 5 other colors randomly selected from the colors array
    const remainingOptions = colors.filter(color => color !== target);
    const randomOptions = remainingOptions.sort(() => Math.random() - 0.5).slice(0, 5);
    const finalOptions = [...randomOptions, target];
    
    // Shuffle the colors
    const shuffled = [...finalOptions].sort(() => Math.random() - 0.5);
    setTargetColor(target);
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
