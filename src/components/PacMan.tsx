import React from 'react';

interface PacManProps {
  position: { x: number; y: number };
  direction: 'right' | 'left' | 'up' | 'down';
}

export const PacMan: React.FC<PacManProps> = ({ position, direction }) => {
  const rotationDegrees = {
    right: 0,
    left: 180,
    up: 270,
    down: 90,
  };

  return (
    <div
      className="absolute w-8 h-8 animate-chomp"
      style={{
        transform: `translate(${position.x * 32}px, ${position.y * 32}px) rotate(${rotationDegrees[direction]}deg)`,
        transition: 'transform 0.2s linear',
      }}
    >
      <div className="w-full h-full bg-pacman-yellow rounded-full" />
    </div>
  );
};