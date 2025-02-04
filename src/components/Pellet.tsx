import React from 'react';

interface PelletProps {
  position: { x: number; y: number };
}

export const Pellet: React.FC<PelletProps> = ({ position }) => {
  return (
    <div
      className="absolute w-2 h-2 bg-pacman-white rounded-full"
      style={{
        transform: `translate(${position.x * 32 + 12}px, ${position.y * 32 + 12}px)`,
      }}
    />
  );
};