import { useState } from 'react';

type SquareValue = '×' | '○' | null;
type WinnerResult = { winner: SquareValue; line: number[] } | null;

interface SquareProps {
  value: SquareValue;
  isHighlight: boolean;
  onSquareClick: () => void;
}

interface BoardProps {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[], index: number) => void;
}

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Square({ value, isHighlight, onSquareClick }: SquareProps) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ backgroundColor: isHighlight ? '#ffeb3b' : undefined }}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares: SquareValue[]): WinnerResult {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = '×';
    } else {
      nextSquares[i] = '○';
    }
    onPlay(nextSquares, i);
  }

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const line = result?.line ?? [];
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every((e) => e !== null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? '×' : '○');
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((y) => (
        <div className="board-row" key={y}>
          {[0, 1, 2].map((x) => {
            const index = y * 3 + x;
            return (
              <Square
                key={index}
                value={squares[index]}
                isHighlight={line.includes(index)}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export function Game() {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null) as SquareValue[],
      move: null as number | null,
    },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAsc, setIsAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares: SquareValue[], i: number) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, move: i },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const baseList = history.map((entry, move) => {
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`;
    } else if (entry.move !== null) {
      const row = Math.floor(entry.move / 3) + 1;
      const col = (entry.move % 3) + 1;
      description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });
  const moves = isAsc ? baseList : baseList.toReversed();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ul>{moves}</ul>
      </div>
      <div className="toggle">
        <button onClick={() => setIsAsc(!isAsc)}>
          {isAsc ? 'asc ↑' : 'desc ↓'}
        </button>
      </div>
    </div>
  );
}
