import React from 'react';

interface GhostProps {
  position: { x: number; y: number };
}

export const Ghost: React.FC<GhostProps> = ({ position }) => {
  return (
    <div
      className="absolute w-8 h-8 animate-blink"
      style={{
        transform: `translate(${position.x * 32}px, ${position.y * 32}px)`,
        transition: 'transform 0.2s linear',
      }}
    >
      <div className="w-full h-full bg-pacman-red rounded-t-full" />
    </div>
  );
};