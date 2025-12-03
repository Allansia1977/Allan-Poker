import React, { useState } from 'react';

interface MenuProps {
  onStartGame: (deckCount: number) => void;
}

export const Menu: React.FC<MenuProps> = ({ onStartGame }) => {
  const [selectedDecks, setSelectedDecks] = useState<number>(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden">
      <div className="w-full max-w-md space-y-8 md:space-y-12 animate-fade-in-up">
        
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight drop-shadow-2xl leading-tight">
            POKER<br/>UP DOWN
          </h1>
          <div className="flex flex-col gap-1">
            <p className="text-emerald-100/90 text-lg md:text-xl font-medium tracking-wide">
              Pure Randomness. No Joke.
            </p>
            <p className="text-emerald-400/60 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
              Allan Drinking Game Series
            </p>
          </div>
        </div>

        <div className="space-y-6 backdrop-blur-sm bg-black/20 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <label className="block text-center text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">
            Select Deck Size
          </label>
          
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                onClick={() => setSelectedDecks(count)}
                className={`
                  relative h-20 md:h-24 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center group overflow-hidden
                  ${selectedDecks === count 
                    ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.3)] scale-105' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30'}
                `}
              >
                <span className={`text-2xl md:text-3xl font-bold ${selectedDecks === count ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {count}
                </span>
                <span className="text-[10px] md:text-xs text-slate-400 uppercase mt-1">
                  {count === 1 ? 'Deck' : 'Decks'}
                </span>
                {/* Visual Indicator of stack size */}
                <div className={`absolute bottom-0 w-full h-1 ${selectedDecks === count ? 'bg-emerald-400' : 'bg-transparent'}`} />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStartGame(selectedDecks)}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black text-lg md:text-xl tracking-wider uppercase shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
        >
          <span>Start Game</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

      </div>
      
      <div className="absolute bottom-6 text-slate-500 text-xs">
        {selectedDecks * 54} cards configured (incl. Jokers)
      </div>
    </div>
  );
};