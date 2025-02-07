
import { GameBoard } from "@/components/GameBoard";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const gameUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "You can now paste this link in your bot",
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pacman-background p-4">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-pacman-yellow">Pac-Man</h1>
        <span className="text-2xl text-pacman-yellow">Мужики, зацените!</span>
      </div>
      <GameBoard />
      <p className="text-pacman-white mt-4">Use arrow keys to move</p>
      
      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-pacman-white">Share this game:</p>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={gameUrl} 
            readOnly 
            className="bg-gray-800 text-pacman-white px-4 py-2 rounded border border-pacman-blue w-[300px]"
          />
          <button
            onClick={copyToClipboard}
            className="bg-pacman-blue text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
