import React, { useState, useEffect, useRef } from 'react';
import { Card, GameState } from '../types';
import { createDeck, shuffleDeck } from '../utils/deck';
import { PlayingCard } from './PlayingCard';

interface GameProps {
  deckCount: number;
  onExit: () => void;
}

export const Game: React.FC<GameProps> = ({ deckCount, onExit }) => {
  const [remainingCards, setRemainingCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [history, setHistory] = useState<Card[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Initialize game
  useEffect(() => {
    const deck = createDeck(deckCount);
    const shuffled = shuffleDeck(deck);
    setRemainingCards(shuffled);
  }, [deckCount]);

  const playFlipSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    try {
      const ctx = new AudioContext();
      const bufferSize = ctx.sampleRate * 0.1; // 100ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // White noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const gain = ctx.createGain();
      // Fast attack, decay
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      // Lowpass filter to dampen the noise (like paper/cardboard)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start();
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  };

  const handleFlip = () => {
    if (remainingCards.length === 0 || isAnimating) return;

    // Play sound
    playFlipSound();

    // Trigger animation lock
    setIsAnimating(true);
    
    // Logic: Pop from remaining, set as current
    const nextCard = remainingCards[0]; // Take top card (conceptually)
    const newRemaining = remainingCards.slice(1);

    // If there was a previous card, move it to history
    if (currentCard) {
      setHistory(prev => [currentCard, ...prev]);
    }

    setRemainingCards(newRemaining);
    setCurrentCard(nextCard);

    // Allow next flip after animation completes visually
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // 600ms matches CSS animation duration
  };

  // 54 cards per deck now (52 + 2 Jokers)
  const progressPercentage = Math.max(0, (remainingCards.length / (deckCount * 54)) * 100);

  const isGameOver = remainingCards.length === 0 && currentCard !== null;

  return (
    <div className="relative flex flex-col h-[100dvh] w-full bg-slate-900 overflow-hidden">
      
      {/* Top Bar: Stats & Navigation */}
      <div className="flex-none pt-4 pb-2 px-4 md:p-6 flex justify-between items-start z-20 bg-gradient-to-b from-slate-900 via-slate-900/90 to-transparent">
        
        {/* Previous Card (History) - Left Side */}
        <div className="w-24 h-full relative">
           {history.length > 0 ? (
            <div className="absolute top-0 -left-2 z-10 animate-fade-in select-none">
                <div className="relative w-64 origin-top-left transform scale-[0.35] sm:scale-[0.45] transition-transform hover:scale-[0.38] sm:hover:scale-[0.48] -rotate-6">
                    <span className="absolute -top-10 left-0 text-2xl text-slate-400 font-bold uppercase tracking-wider drop-shadow-md">Prev</span>
                    <PlayingCard card={history[0]} animate={false} className="shadow-2xl" />
                    {/* Stack effect */}
                    {history.length > 1 && <div className="absolute inset-0 bg-white/5 rounded-2xl -z-10 translate-x-1 translate-y-1"></div>}
                </div>
            </div>
          ) : (
            <div className="w-full h-full opacity-0">Placeholder</div>
          )}
        </div>

        {/* Center Stats */}
        <div className="flex flex-col items-center pointer-events-auto transform translate-y-1">
          <span className="text-emerald-400 font-bold text-3xl tabular-nums tracking-tighter shadow-emerald-500/20 drop-shadow-lg leading-none">
            {remainingCards.length}
          </span>
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Left</span>
        </div>
        
        {/* Right Reset Button */}
        <div className="w-24 flex justify-end">
          <button 
            onClick={onExit}
            className="pointer-events-auto px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all border border-white/5 hover:border-red-500/30 flex items-center gap-2 group shadow-lg"
          >
            <span>Reset</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-grow relative flex items-center justify-center perspective-1000 w-full overflow-visible">
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
             <div className="w-[80vw] h-[80vw] bg-emerald-500 rounded-full blur-[100px]"></div>
        </div>

        {/* Empty State / Start Prompt */}
        {!currentCard && remainingCards.length > 0 && (
           <div className="text-slate-400 text-center animate-pulse relative z-0">
             <div className="w-[60vw] max-w-[280px] aspect-[2.5/3.5] border-4 border-dashed border-slate-700 rounded-2xl flex items-center justify-center bg-slate-800/20 mx-auto mb-4">
                 <span className="text-6xl text-slate-600 font-black opacity-50">?</span>
             </div>
             <p className="uppercase tracking-widest text-sm">Tap Flip to Start</p>
           </div>
        )}

        {/* Card Stack Visual (The pile waiting to be flipped) */}
        {remainingCards.length > 0 && (
          <div className="absolute transform translate-x-3 translate-y-3 opacity-40 grayscale pointer-events-none" aria-hidden="true">
             <div className="w-[60vw] max-w-[280px] aspect-[2.5/3.5] rounded-2xl bg-blue-900 border-2 border-slate-600 shadow-xl"></div>
          </div>
        )}

        {/* The Active Card - Scaled for mobile */}
        {currentCard && (
           <div className="z-10 w-[60vw] max-w-[280px] aspect-[2.5/3.5] relative transition-all duration-300">
             <PlayingCard 
               key={currentCard.id} // Key change triggers remount for animation
               card={currentCard}
               className="w-full h-full shadow-2xl"
             />
           </div>
        )}

        {/* Game Over State */}
        {remainingCards.length === 0 && !isAnimating && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 animate-fade-in">
             <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 text-center">Deck Empty!</h2>
             <p className="text-slate-300 mb-8 text-center max-w-xs">You've flipped through all cards.</p>
             <button 
                onClick={onExit}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95"
             >
               Play Again
             </button>
          </div>
        )}

      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-800 flex-none">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300 ease-out box-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Bottom Control Area */}
      <div className="flex-none p-6 pb-8 md:pb-10 bg-slate-900/80 backdrop-blur-lg border-t border-white/5 flex justify-center z-20 safe-area-bottom">
        <button
          onClick={handleFlip}
          disabled={remainingCards.length === 0 || isAnimating}
          className={`
            w-full max-w-sm py-5 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-2xl transition-all duration-100 touch-manipulation
            ${remainingCards.length === 0 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 hover:to-amber-400 active:scale-[0.98] active:shadow-inner ring-4 ring-amber-500/20 active:ring-amber-500/40'}
          `}
        >
          {isAnimating ? '...' : 'Flip Card'}
        </button>
      </div>

    </div>
  );
};