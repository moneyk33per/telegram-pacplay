
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
        transition: 'transform 0.4s ease-in-out',
      }}
    >
      <div className="w-full h-full bg-red-500 rounded-t-full relative">
        <div className="absolute bottom-0 w-full flex justify-between px-1">
          <div className="w-2 h-3 bg-red-500 rounded-b-full"></div>
          <div className="w-2 h-3 bg-red-500 rounded-b-full"></div>
          <div className="w-2 h-3 bg-red-500 rounded-b-full"></div>
        </div>
      </div>
    </div>
  );
};
