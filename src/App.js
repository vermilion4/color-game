import { useState, useEffect } from 'react';
import ColorBox from './components/ColorBox';
import ColorOptions from './components/ColorOptions';
import ResultModal from './components/ResultModal';
import './App.css';

function App() {
  const [targetColor, setTargetColor] = useState('');
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [shake, setShake] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Generate a random color in hex format
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Generate new set of colors for the game
  const generateColors = () => {
    const colors = [];
    for (let i = 0; i < 6; i++) {
      colors.push(generateRandomColor());
    }
    const targetIndex = Math.floor(Math.random() * 6);
    setTargetColor(colors[targetIndex]);
    setColorOptions(colors);
    setShowColor(false);
    setButtonsDisabled(false);
    setShake(false);
    setShowInstructions(true);
    setTimeout(() => setShowInstructions(false), 3000);
  };

  // Handle color guess
  const handleColorGuess = (color) => {
    const correct = color === targetColor;
    setButtonsDisabled(true);
    
    if (correct) {
      setShowColor(true);
      // Wait for flip animation to show color
      setTimeout(() => {
        setIsCorrectGuess(true);
        setShowModal(true);
        setScore(prevScore => prevScore + 1);
      }, 1500);

      // First hide the color (flip back)
      setTimeout(() => {
        setShowModal(false);
        setShowColor(false);
      }, 3000);

      // Then generate new colors after flip back animation
      setTimeout(() => {
        generateColors();
      }, 4200); // 3000 + 1200 (flip animation time)
    } else {
      setShake(true);
      
      // Wait for shake animation before showing modal
      setTimeout(() => {
        setIsCorrectGuess(false);
        setShowModal(true);
      }, 800);
      
      // Add wrong class to the button for shake animation
      const buttons = document.querySelectorAll('.color-button');
      buttons.forEach(button => {
        if (button.style.backgroundColor === color) {
          button.classList.add('wrong');
          setTimeout(() => button.classList.remove('wrong'), 500);
        }
      });
      
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
    setShowColor(false);
    setButtonsDisabled(false);
    generateColors();
  };

  // Initialize game
  useEffect(() => {
    generateColors();
  }, []);

  return (
    <div className="App">
      <div className="game-container">
        <header>
          <div className="header-content">
            <h1>Color Game</h1>
            <div className="header-controls">
              <div className="score-container">
                <p className="score-label">Score</p>
                <p data-testid="score" className="score">
                  {score}
                </p>
              </div>
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

        <div className="instructions">
          <p data-testid="gameInstructions" className="instruction-text">
            <span className="instruction-step">1</span> Look at the mystery card with "?"
            <br />
            <span className="instruction-step">2</span> Click the color you think is hiding behind it
            <br />
            <span className="instruction-step">3</span> Try to get the highest score!
          </p>
        </div>

        <main className="game-content">
          <section className="target-section">
            <ColorBox 
              color={targetColor} 
              showColor={showColor} 
              shake={shake}
            />
          </section>

          <section className="options-section">
            <ColorOptions 
              colors={colorOptions} 
              onGuess={handleColorGuess}
              disabled={buttonsDisabled} 
            />
          </section>
        </main>

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
