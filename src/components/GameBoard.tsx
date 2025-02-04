import React, { useState, useEffect } from 'react';
import { PacMan } from './PacMan';
import { Ghost } from './Ghost';
import { Pellet } from './Pellet';

const BOARD_SIZE = 15;
const INITIAL_PELLETS = Array.from({ length: BOARD_SIZE * BOARD_SIZE / 3 }, () => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
}));

export const GameBoard: React.FC = () => {
  const [pacmanPos, setPacmanPos] = useState({ x: 1, y: 1 });
  const [ghostPos, setGhostPos] = useState({ x: 13, y: 13 });
  const [direction, setDirection] = useState<'right' | 'left' | 'up' | 'down'>('right');
  const [pellets, setPellets] = useState(INITIAL_PELLETS);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newPos = { ...pacmanPos };
      let newDirection = direction;

      switch (e.key) {
        case 'ArrowRight':
          newPos.x = Math.min(BOARD_SIZE - 1, pacmanPos.x + 1);
          newDirection = 'right';
          break;
        case 'ArrowLeft':
          newPos.x = Math.max(0, pacmanPos.x - 1);
          newDirection = 'left';
          break;
        case 'ArrowUp':
          newPos.y = Math.max(0, pacmanPos.y - 1);
          newDirection = 'up';
          break;
        case 'ArrowDown':
          newPos.y = Math.min(BOARD_SIZE - 1, pacmanPos.y + 1);
          newDirection = 'down';
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
      const dx = pacmanPos.x - ghostPos.x;
      const dy = pacmanPos.y - ghostPos.y;
      
      const newPos = { ...ghostPos };
      if (Math.abs(dx) > Math.abs(dy)) {
        newPos.x += dx > 0 ? 1 : -1;
      } else {
        newPos.y += dy > 0 ? 1 : -1;
      }
      
      setGhostPos(newPos);
    }, 1000);

    return () => clearInterval(moveGhost);
  }, [ghostPos, pacmanPos]);

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
        <PacMan position={pacmanPos} direction={direction} />
        <Ghost position={ghostPos} />
        {pellets.map((pellet, i) => (
          <Pellet key={i} position={pellet} />
        ))}
      </div>
    </div>
  );
};