import React from 'react';

interface PacManProps {
  position: { x: number; y: number };
  direction: 'right' | 'left' | 'up' | 'down';
  cellSize: number;
}

export const PacMan: React.FC<PacManProps> = ({ position, direction, cellSize }) => {
  const rotationDegrees = {
    right: 0,
    left: 180,
    up: 270,
    down: 90,
  };

  return (
    <div
      className="absolute transition-all duration-200"
      style={{
        width: cellSize,
        height: cellSize,
        transform: `translate(${position.x * cellSize}px, ${position.y * cellSize}px) rotate(${rotationDegrees[direction]}deg)`,
      }}
    >
      <div className="w-full h-full bg-pacman-yellow rounded-full animate-[chomp_0.3s_ease-in-out_infinite]" />
    </div>
  );
};