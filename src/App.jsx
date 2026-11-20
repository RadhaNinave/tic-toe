import { useState } from "react";

const WIN_PATTERNS = [
  [0, 1, 2], // first row
  [3, 4, 5], // second row
  [6, 7, 8], // third row
  [0, 3, 6], // first column
  [1, 4, 7], // second column
  [2, 5, 8], // third column
  [0, 4, 8], // diagonal
  [2, 4, 6], // diagonal
];

const EMPTY_BOARD = Array(9).fill(null);
const EMPTY_SCORES = { X: 0, O: 0, draws: 0 };

function findWinner(board) {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], cells: [a, b, c] };
    }
  }
  return null;
}

function App() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null); // "X" | "O" | null
  const [isDraw, setIsDraw] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [scores, setScores] = useState(EMPTY_SCORES);

  const gameOver = Boolean(winner) || isDraw;

  const handleCellClick = (index) => {
    if (board[index] || gameOver) return;

    const next = [...board];
    next[index] = turn;
    setBoard(next);

    const result = findWinner(next);
    if (result) {
      setWinner(result.winner);
      setWinningCells(result.cells);
      setScores((prev) => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
      return;
    }

    if (next.every(Boolean)) {
      setIsDraw(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setTurn(turn === "X" ? "O" : "X");
  };

  // Clears only the board, keeps scores
  const restartRound = () => {
    setBoard(EMPTY_BOARD);
    setTurn("X");
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
  };

  // Clears the board and all scores
  const resetAll = () => {
    restartRound();
    setScores(EMPTY_SCORES);
  };

  let status = `Turn: ${turn}`;
  if (winner) status = `Winner: ${winner}`;
  else if (isDraw) status = "It's a Draw!";

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div className="card shadow-sm border-0 game-card">
        <div className="card-body p-4 text-center">
          <h1 className="title mb-2">Tic-Tac-Toe</h1>

          <div className="d-flex justify-content-center gap-2 mb-3">
            <span className="score score-x">X: {scores.X}</span>
            <span className="score score-draw">Draws: {scores.draws}</span>
            <span className="score score-o">O: {scores.O}</span>
          </div>

          <p className="status mb-3">{status}</p>

          <div className="board mb-3">
            {board.map((value, index) => (
              <button
                key={index}
                type="button"
                className={`cell${winningCells.includes(index) ? " win" : ""}`}
                onClick={() => handleCellClick(index)}
                disabled={Boolean(value) || gameOver}
                aria-label={`Cell ${index + 1}${value ? `: ${value}` : ""}`}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="d-flex justify-content-center gap-2">
            <button type="button" className="btn btn-primary btn-sm btn-restart" onClick={restartRound}>
              {winner ? "Play Again" : "Restart Round"}
            </button>
            <button type="button" className="btn btn-link btn-sm text-decoration-none btn-reset" onClick={resetAll}>
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
