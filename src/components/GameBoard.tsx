import React, { useState, useEffect } from 'react';
import { PacMan } from './PacMan';
import { Ghost } from './Ghost';
import { Pellet } from './Pellet';
import { useToast } from "@/components/ui/use-toast";

const BOARD_SIZE = 15;
const CELL_SIZE = 24;
const WALL_LAYOUT = [
  "###############",
  "#P    #    G  #",
  "# ### # ### # #",
  "#     #     # #",
  "# # ##### # # #",
  "# #       # # #",
  "# # ##### # # #",
  "#     G       #",
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
  const [ghost1Pos, setGhost1Pos] = useState({ x: 13, y: 1 });
  const [ghost2Pos, setGhost2Pos] = useState({ x: 7, y: 7 });
  const [direction, setDirection] = useState<'right' | 'left' | 'up' | 'down'>('right');
  const [pellets, setPellets] = useState(INITIAL_PELLETS);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { toast } = useToast();

  const isValidMove = (x: number, y: number) => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && WALL_LAYOUT[y][x] !== '#';
  };

  const checkGhostCollision = () => {
    const hasCollided = 
      (pacmanPos.x === ghost1Pos.x && pacmanPos.y === ghost1Pos.y) ||
      (pacmanPos.x === ghost2Pos.x && pacmanPos.y === ghost2Pos.y);

    if (hasCollided && !gameOver) {
      setGameOver(true);
      toast({
        title: "Game Over!",
        description: `Final Score: ${score}`,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

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
  }, [pacmanPos, direction, pellets, gameOver, score]);

  // Ghost AI for both ghosts
  useEffect(() => {
    if (gameOver) return;

    const moveGhosts = setInterval(() => {
      // Move ghost 1
      const possibleMoves1 = [
        { x: ghost1Pos.x + 1, y: ghost1Pos.y },
        { x: ghost1Pos.x - 1, y: ghost1Pos.y },
        { x: ghost1Pos.x, y: ghost1Pos.y + 1 },
        { x: ghost1Pos.x, y: ghost1Pos.y - 1 }
      ].filter(pos => isValidMove(pos.x, pos.y));

      if (possibleMoves1.length > 0) {
        const randomMove1 = possibleMoves1[Math.floor(Math.random() * possibleMoves1.length)];
        setGhost1Pos(randomMove1);
      }

      // Move ghost 2
      const possibleMoves2 = [
        { x: ghost2Pos.x + 1, y: ghost2Pos.y },
        { x: ghost2Pos.x - 1, y: ghost2Pos.y },
        { x: ghost2Pos.x, y: ghost2Pos.y + 1 },
        { x: ghost2Pos.x, y: ghost2Pos.y - 1 }
      ].filter(pos => isValidMove(pos.x, pos.y));

      if (possibleMoves2.length > 0) {
        const randomMove2 = possibleMoves2[Math.floor(Math.random() * possibleMoves2.length)];
        setGhost2Pos(randomMove2);
      }
    }, 1000);

    return () => clearInterval(moveGhosts);
  }, [ghost1Pos, ghost2Pos, gameOver]);

  // Check for ghost collisions
  useEffect(() => {
    checkGhostCollision();
  }, [pacmanPos, ghost1Pos, ghost2Pos]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl text-pacman-yellow font-bold">Score: {score}</div>
      <div 
        className="relative bg-pacman-background border-4 border-pacman-blue"
        style={{ 
          width: BOARD_SIZE * CELL_SIZE, 
          height: BOARD_SIZE * CELL_SIZE 
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
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                }}
              />
            )
          )
        )}
        {!gameOver && <PacMan position={pacmanPos} direction={direction} cellSize={CELL_SIZE} />}
        <Ghost position={ghost1Pos} cellSize={CELL_SIZE} />
        <Ghost position={ghost2Pos} cellSize={CELL_SIZE} />
        {pellets.map((pellet, i) => (
          <Pellet key={i} position={pellet} cellSize={CELL_SIZE} />
        ))}
      </div>
    </div>
  );
};