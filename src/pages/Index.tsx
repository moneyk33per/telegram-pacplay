
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pacman-background p-4">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-pacman-yellow">Pac-Man</h1>
        <span className="text-2xl text-pacman-yellow">Мужики, зацените!</span>
      </div>
      <GameBoard />
      <p className="text-pacman-white mt-4">Use arrow keys to move</p>
    </div>
  );
};

export default Index;
