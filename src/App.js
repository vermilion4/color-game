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
    const hue = Math.floor(Math.random() * 360);
    const saturation = 30 + Math.floor(Math.random() * 20); // 30-50%
    const lightness = 45 + Math.floor(Math.random() * 15);  // 45-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Generate similar colors based on the target color
  const generateSimilarColors = (baseColor) => {
    const colors = [];
    const [h, s, l] = baseColor.match(/\d+/g).map(Number);
    
    // Generate 5 similar colors with subtle variations
    for (let i = 0; i < 5; i++) {
      const hueVariation = Math.random() * 15 - 7.5;
      const saturationVariation = Math.random() * 10 - 5;
      const lightnessVariation = Math.random() * 10 - 5;
      
      const newHue = (h + hueVariation + 360) % 360;
      const newSaturation = Math.max(20, Math.min(60, s + saturationVariation));
      const newLightness = Math.max(35, Math.min(70, l + lightnessVariation));
      
      colors.push(`hsl(${newHue}, ${newSaturation}%, ${newLightness}%)`);
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
