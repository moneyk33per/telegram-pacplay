import React from 'react';

interface GhostProps {
  position: { x: number; y: number };
  cellSize: number;
}

export const Ghost: React.FC<GhostProps> = ({ position, cellSize }) => {
  return (
    <div
      className="absolute animate-blink"
      style={{
        width: cellSize,
        height: cellSize,
        transform: `translate(${position.x * cellSize}px, ${position.y * cellSize}px)`,
        transition: 'transform 0.2s linear',
      }}
    >
      <div className="w-full h-full bg-red-500 rounded-t-full" />
    </div>
  );
};