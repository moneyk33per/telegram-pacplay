import { GameBoard } from "@/components/GameBoard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pacman-background p-4">
      <h1 className="text-4xl font-bold text-pacman-yellow mb-8">Pac-Man</h1>
      <GameBoard />
      <p className="text-pacman-white mt-4">Use arrow keys to move</p>
    </div>
  );
};

export default Index;