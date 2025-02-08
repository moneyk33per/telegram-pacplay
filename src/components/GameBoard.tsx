
import React, { useState, useEffect } from 'react';
import { PacMan } from './PacMan';
import { Ghost } from './Ghost';
import { Pellet } from './Pellet';
import { useToast } from "@/components/ui/use-toast";

const BOARD_SIZE = 15;
const CELL_SIZE = 20;
const WALL_LAYOUT = [
  "###############",
  "#P    #      G#",
  "# ### # ##### #",
  "#     #       #",
  "# # ### ### # #",
  "# #   G     # #",
  "# # ####### # #",
  "#     G       #",
  "# # ####### # #",
  "# #    G    # #", // Added new ghost position
  "# # ####### # #",
  "#     #     G #",
  "# ### # ##### #",
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
  const [ghost2Pos, setGhost2Pos] = useState({ x: 7, y: 5 });
  const [ghost3Pos, setGhost3Pos] = useState({ x: 7, y: 7 });
  const [ghost4Pos, setGhost4Pos] = useState({ x: 13, y: 11 });
  const [ghost5Pos, setGhost5Pos] = useState({ x: 7, y: 9 });
  const [direction, setDirection] = useState<'right' | 'left' | 'up' | 'down'>('right');
  const [pellets, setPellets] = useState(INITIAL_PELLETS);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const { toast } = useToast();

  const isValidMove = (x: number, y: number) => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && WALL_LAYOUT[y][x] !== '#';
  };

  const moveGhostTowardsPacman = (ghostPos: { x: number; y: number }) => {
    const dx = pacmanPos.x - ghostPos.x;
    const dy = pacmanPos.y - ghostPos.y;
    
    // Calculate all possible moves including diagonals
    const possibleMoves = [
      { x: ghostPos.x + Math.sign(dx), y: ghostPos.y }, // horizontal
      { x: ghostPos.x, y: ghostPos.y + Math.sign(dy) }, // vertical
      { x: ghostPos.x + Math.sign(dx), y: ghostPos.y + Math.sign(dy) }, // diagonal
      { x: ghostPos.x - Math.sign(dx), y: ghostPos.y }, // opposite horizontal
      { x: ghostPos.x, y: ghostPos.y - Math.sign(dy) }, // opposite vertical
    ].filter(move => isValidMove(move.x, move.y));

    if (possibleMoves.length > 0) {
      // Only 10% chance to move randomly now (down from 20%)
      if (Math.random() < 0.1) {
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      }
      
      // Enhanced pathfinding - find the move that gets closest to Pacman
      return possibleMoves.reduce((best, move) => {
        const currentDist = Math.sqrt(
          Math.pow(move.x - pacmanPos.x, 2) + 
          Math.pow(move.y - pacmanPos.y, 2)
        );
        const bestDist = Math.sqrt(
          Math.pow(best.x - pacmanPos.x, 2) + 
          Math.pow(best.y - pacmanPos.y, 2)
        );
        return currentDist < bestDist ? move : best;
      }, possibleMoves[0]);
    }
    return ghostPos;
  };

  const checkGhostCollision = () => {
    const hasCollided = 
      (pacmanPos.x === ghost1Pos.x && pacmanPos.y === ghost1Pos.y) ||
      (pacmanPos.x === ghost2Pos.x && pacmanPos.y === ghost2Pos.y) ||
      (pacmanPos.x === ghost3Pos.x && pacmanPos.y === ghost3Pos.y) ||
      (pacmanPos.x === ghost4Pos.x && pacmanPos.y === ghost4Pos.y) ||
      (pacmanPos.x === ghost5Pos.x && pacmanPos.y === ghost5Pos.y); // Added new ghost check

    if (hasCollided && !gameOver) {
      if (lives > 1) {
        setLives(lives - 1);
        setPacmanPos({ x: 1, y: 1 });
        toast({
          title: "Lost a life!",
          description: `${lives - 1} lives remaining`,
          variant: "destructive"
        });
      } else {
        setGameOver(true);
        toast({
          title: "Game Over!",
          description: `Final Score: ${score}`,
          variant: "destructive"
        });
      }
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

  useEffect(() => {
    if (gameOver) return;

    const moveGhosts = setInterval(() => {
      setGhost1Pos(moveGhostTowardsPacman(ghost1Pos));
      setGhost2Pos(moveGhostTowardsPacman(ghost2Pos));
      setGhost3Pos(moveGhostTowardsPacman(ghost3Pos));
      setGhost4Pos(moveGhostTowardsPacman(ghost4Pos));
      setGhost5Pos(moveGhostTowardsPacman(ghost5Pos));
    }, 600); // Changed from 300ms to 600ms to make ghosts move half as fast

    return () => clearInterval(moveGhosts);
  }, [ghost1Pos, ghost2Pos, ghost3Pos, ghost4Pos, ghost5Pos, pacmanPos, gameOver]);

  useEffect(() => {
    checkGhostCollision();
  }, [pacmanPos, ghost1Pos, ghost2Pos, ghost3Pos, ghost4Pos, ghost5Pos]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-[300px]">
        <div className="text-2xl text-pacman-yellow font-bold">Score: {score}</div>
        <div className="text-2xl text-pacman-yellow font-bold">Lives: {lives}</div>
      </div>
      <div 
        className="relative bg-pacman-background border-2 border-pacman-blue"
        style={{ 
          width: BOARD_SIZE * CELL_SIZE, 
          height: BOARD_SIZE * CELL_SIZE 
        }}
      >
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
        <Ghost position={ghost3Pos} cellSize={CELL_SIZE} />
        <Ghost position={ghost4Pos} cellSize={CELL_SIZE} />
        <Ghost position={ghost5Pos} cellSize={CELL_SIZE} />
        {pellets.map((pellet, i) => (
          <Pellet key={i} position={pellet} cellSize={CELL_SIZE} />
        ))}
      </div>
    </div>
  );
};
