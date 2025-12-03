import React, { useState } from 'react';
import { GameState } from './types';
import { Menu } from './components/Menu';
import { Game } from './components/Game';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [deckCount, setDeckCount] = useState<number>(1);

  const startGame = (count: number) => {
    setDeckCount(count);
    setGameState(GameState.PLAYING);
  };

  const exitGame = () => {
    setGameState(GameState.MENU);
  };

  return (
    <div className="font-sans antialiased text-slate-100 h-screen w-screen overflow-hidden selection:bg-emerald-500 selection:text-white">
      {gameState === GameState.MENU && <Menu onStartGame={startGame} />}
      {gameState === GameState.PLAYING && <Game deckCount={deckCount} onExit={exitGame} />}
    </div>
  );
};

export default App;