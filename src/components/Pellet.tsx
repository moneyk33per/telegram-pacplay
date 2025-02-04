import React from 'react';

interface PelletProps {
  position: { x: number; y: number };
  cellSize: number;
}

export const Pellet: React.FC<PelletProps> = ({ position, cellSize }) => {
  return (
    <div
      className="absolute w-2 h-2 bg-pacman-white rounded-full"
      style={{
        transform: `translate(${position.x * cellSize + cellSize/2 - 4}px, ${position.y * cellSize + cellSize/2 - 4}px)`,
      }}
    />
  );
};