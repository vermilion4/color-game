import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import ColorOptions from "./components/ColorOptions/ColorOptions";
import "./App.css";

function App() {
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [shake, setShake] = useState(false);

  //   const colors = [
  //     '#FF0000',    // Red
  //     '#0000FF',    // Blue
  //     '#00FF00',    // Green
  //     '#FFFF00',    // Yellow
  //     '#800080',    // Purple
  //     '#FFA500',    // Orange
  //     '#008080',    // Teal
  //     '#FFC0CB',    // Pink
  //     '#A52A2A',    // Brown
  //     '#00FFFF'     // Cyan
  // ];

  // randomly select a target color from predefined list
  // function selectTargetColor() {
  //   const randomIndex = Math.floor(Math.random() * colors.length);
  //   return colors[randomIndex];
  // }

  // generate colors
  // const generateColors = () => {
  //   const target = selectTargetColor();
  //   // add 5 other colors randomly selected from the colors array
  //   const remainingOptions = colors.filter(color => color !== target);
  //   const randomOptions = remainingOptions.sort(() => Math.random() - 0.5).slice(0, 5);
  //   const finalOptions = [...randomOptions, target];

  //   // Shuffle the colors
  //   const shuffled = [...finalOptions].sort(() => Math.random() - 0.5);
  //   setTargetColor(target);
  //   setColorOptions(shuffled);
  //   setButtonsDisabled(false);
  //   setShake(false);
  // };

  // generate base color
  const generateBaseColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // Generate similar colors based on the target color
  const generateSimilarColors = (baseColor) => {
    const colors = [];
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Generate 5 similar colors with more noticeable variations
    for (let i = 0; i < 5; i++) {
      const variation = 30;
      let newR = Math.min(
        255,
        Math.max(0, r + Math.floor(Math.random() * variation * 2) - variation),
      );
      let newG = Math.min(
        255,
        Math.max(0, g + Math.floor(Math.random() * variation * 2) - variation),
      );
      let newB = Math.min(
        255,
        Math.max(0, b + Math.floor(Math.random() * variation * 2) - variation),
      );

      // Ensure at least one channel has a minimum difference
      const minDiff = 30;
      const channel = Math.floor(Math.random() * 3);
      if (channel === 0) {
        newR = Math.min(
          255,
          Math.max(0, r + (Math.random() < 0.5 ? -minDiff : minDiff)),
        );
      } else if (channel === 1) {
        newG = Math.min(
          255,
          Math.max(0, g + (Math.random() < 0.5 ? -minDiff : minDiff)),
        );
      } else {
        newB = Math.min(
          255,
          Math.max(0, b + (Math.random() < 0.5 ? -minDiff : minDiff)),
        );
      }

      const hex = `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
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
      origin: { y: 0.6 },
    });
  };

  // color guess handler
  const handleColorGuess = (color) => {
    const correct = color === targetColor;
    setButtonsDisabled(true);

    if (correct) {
      throwConfetti();
      setGameStatus("Correct!");
      setScore((prevScore) => prevScore + 1);

      setTimeout(() => {
        setGameStatus("");
        generateColors();
      }, 2000);
      return;
    }
    setShake(true);
    setGameStatus("Wrong! Try again");

    setTimeout(() => {
      setGameStatus("");
      setButtonsDisabled(false);
      setShake(false);
    }, 2000);
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
          <p className="instruction-text" data-testid="gameInstructions">
            Look at the target color with the label "Match this color" and
            choose its exact match from the color options
          </p>
          <div className="instruction-tip">Tip: Take your time!</div>
        </div>

        {/* game status */}
        <div
          data-testid="gameStatus"
          className={`game-status ${gameStatus ? (gameStatus.toLowerCase().includes("correct") ? "correct" : "wrong") : ""}`}
        >
          {gameStatus}
        </div>

        <main className="game-content">
          <section className="target-section">
            <div className="target-wrapper">
              <div
                data-testid="colorBox"
                className={`target-color ${shake ? "shake" : ""}`}
                style={{ backgroundColor: targetColor }}
              >
                <span className="target-label">Match this color</span>
              </div>
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
      </div>
    </div>
  );
}

export default App;
