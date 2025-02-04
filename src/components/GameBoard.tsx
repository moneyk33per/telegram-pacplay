import React, { useState, useEffect } from 'react';
import { PacMan } from './PacMan';
import { Ghost } from './Ghost';
import { Pellet } from './Pellet';

const BOARD_SIZE = 15;
const WALL_LAYOUT = [
  "###############",
  "#P    #    G  #",
  "# ### # ### # #",
  "#     #     # #",
  "# # ##### # # #",
  "# #       # # #",
  "# # ##### # # #",
  "#             #",
  "# # ##### # # #",
  "# #       # # #",
  "# # ##### # # #",
  "#     #     # #",
  "# ### # ### # #",
  "#             #",
  "###############"
];

const INITIAL_PELLETS = WALL_LAYOUT.reduce((pellets, row, y) => {
  row.split('').forEach((cell, x) => {
    if (cell === ' ') {
      pellets.push({ x, y });
    }
  });
  return pellets;
}, [] as { x: number; y: number }[]);

export const GameBoard: React.FC = () => {
  const [pacmanPos, setPacmanPos] = useState({ x: 1, y: 1 });
  const [ghostPos, setGhostPos] = useState({ x: 13, y: 1 });
  const [direction, setDirection] = useState<'right' | 'left' | 'up' | 'down'>('right');
  const [pellets, setPellets] = useState(INITIAL_PELLETS);
  const [score, setScore] = useState(0);

  const isValidMove = (x: number, y: number) => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && WALL_LAYOUT[y][x] !== '#';
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newPos = { ...pacmanPos };
      let newDirection = direction;

      switch (e.key) {
        case 'ArrowRight':
          if (isValidMove(pacmanPos.x + 1, pacmanPos.y)) {
            newPos.x = pacmanPos.x + 1;
            newDirection = 'right';
          }
          break;
        case 'ArrowLeft':
          if (isValidMove(pacmanPos.x - 1, pacmanPos.y)) {
            newPos.x = pacmanPos.x - 1;
            newDirection = 'left';
          }
          break;
        case 'ArrowUp':
          if (isValidMove(pacmanPos.x, pacmanPos.y - 1)) {
            newPos.y = pacmanPos.y - 1;
            newDirection = 'up';
          }
          break;
        case 'ArrowDown':
          if (isValidMove(pacmanPos.x, pacmanPos.y + 1)) {
            newPos.y = pacmanPos.y + 1;
            newDirection = 'down';
          }
          break;
      }

      setPacmanPos(newPos);
      setDirection(newDirection);

      // Check pellet collection
      const pelletIndex = pellets.findIndex(p => p.x === newPos.x && p.y === newPos.y);
      if (pelletIndex !== -1) {
        setPellets(pellets.filter((_, i) => i !== pelletIndex));
        setScore(s => s + 10);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pacmanPos, direction, pellets]);

  // Simple ghost AI
  useEffect(() => {
    const moveGhost = setInterval(() => {
      const possibleMoves = [
        { x: ghostPos.x + 1, y: ghostPos.y },
        { x: ghostPos.x - 1, y: ghostPos.y },
        { x: ghostPos.x, y: ghostPos.y + 1 },
        { x: ghostPos.x, y: ghostPos.y - 1 }
      ].filter(pos => isValidMove(pos.x, pos.y));

      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        setGhostPos(randomMove);
      }
    }, 1000);

    return () => clearInterval(moveGhost);
  }, [ghostPos]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl text-pacman-yellow font-bold">Score: {score}</div>
      <div 
        className="relative bg-pacman-background border-4 border-pacman-blue"
        style={{ 
          width: BOARD_SIZE * 32, 
          height: BOARD_SIZE * 32 
        }}
      >
        {/* Render walls */}
        {WALL_LAYOUT.map((row, y) => 
          row.split('').map((cell, x) => 
            cell === '#' && (
              <div
                key={`wall-${x}-${y}`}
                className="absolute bg-pacman-blue"
                style={{
                  width: 32,
                  height: 32,
                  left: x * 32,
                  top: y * 32,
                }}
              />
            )
          )
        )}
        <PacMan position={pacmanPos} direction={direction} />
        <Ghost position={ghostPos} />
        {pellets.map((pellet, i) => (
          <Pellet key={i} position={pellet} />
        ))}
      </div>
    </div>
  );
};