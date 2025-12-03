import React from 'react';
import { Card as CardType, Suit, Rank } from '../types';
import { getSuitColor, getSuitIcon } from '../utils/deck';

interface PlayingCardProps {
  card: CardType;
  animate?: boolean;
  className?: string;
}

const SuitIconSVG: React.FC<{ suit: Suit; className?: string }> = ({ suit, className }) => {
  const colorClass = getSuitColor(suit);
  
  // Simple SVG paths for better scalability than unicode
  const paths = {
    [Suit.HEARTS]: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    [Suit.DIAMONDS]: "M12 2L2 12l10 10 10-10L12 2z", // Simplified diamond
    // Updated Club path: Smooth trefoil with 3 round lobes and a short vertical stem
    [Suit.CLUBS]: "M12,2.5c-2.8,0-5,2.2-5,5c0,1.3,0.5,2.4,1.4,3.3c-2.4,0.5-4.1,2.6-4.1,5c0,2.8,2.2,5,5,5c0.6,0,1.2-0.1,1.7-0.3L9.8,23.5h4.4l-1.2-3c0.5,0.2,1.1,0.3,1.7,0.3c2.8,0,5-2.2,5-5c0-2.4-1.8-4.5-4.1-5c0.8-0.9,1.4-2,1.4-3.3C17,4.7,14.8,2.5,12,2.5z",
    // Updated Spade path for better visual accuracy: solid body + triangular stem
    [Suit.SPADES]: "M12,2C9,8 4,9 4,14.5C4,17.5 6.5,20 9.5,20C11.5,20 12,18.5 12,18.5C12,18.5 12.5,20 14.5,20C17.5,20 20,17.5 20,14.5C20,9 15,8 12,2z M12,18L10,22H14L12,18z",
    [Suit.JOKER]: "M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" // Star for Joker
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={`${colorClass} ${className} inline-block`}
    >
      <path d={paths[suit]} />
    </svg>
  );
};

export const PlayingCard: React.FC<PlayingCardProps> = ({ card, animate = true, className = '' }) => {
  const { rank, suit } = card;
  const colorClass = getSuitColor(suit);
  
  // Determine if it's a face card for slight layout variations
  const isFace = ['J', 'Q', 'K'].includes(rank);
  const isJoker = rank === Rank.JOKER;

  return (
    <div className={`perspective-1000 aspect-[2.5/3.5] relative group ${className}`}>
      {/* 
         The flipping container. 
         If `animate` is true, we apply the `animate-flip` class which runs the keyframe animation.
      */}
      <div className={`relative w-full h-full text-center transition-all duration-500 transform-style-3d ${animate ? 'animate-flip' : ''}`}>
        
        {/* FRONT SIDE */}
        <div className={`absolute w-full h-full backface-hidden rounded-2xl shadow-2xl bg-white border-2 border-slate-200 flex flex-col justify-between p-[5%] select-none`}>
          {/* Top Left Corner */}
          <div className="flex flex-col items-center self-start">
            <span className={`text-3xl font-bold ${colorClass}`}>{rank}</span>
            <SuitIconSVG suit={suit} className="w-6 h-6" />
          </div>

          {/* Center Art */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {isJoker ? (
               <div className="flex flex-col items-center justify-center">
                  <SuitIconSVG suit={suit} className="w-32 h-32 md:w-40 md:h-40 animate-pulse" />
                  <span className={`font-black text-2xl md:text-4xl tracking-widest mt-2 ${colorClass}`}>JOKER</span>
               </div>
             ) : isFace ? (
               <div className={`border-4 ${colorClass} opacity-20 rounded-lg w-[50%] h-[50%] flex items-center justify-center`}>
                 <span className={`text-6xl font-serif ${colorClass}`}>{rank}</span>
               </div>
             ) : (
                <div className="flex items-center justify-center p-12 opacity-80">
                   <SuitIconSVG suit={suit} className="w-24 h-24 md:w-32 md:h-32 transform scale-125" />
                </div>
             )}
          </div>

          {/* Bottom Right Corner (Rotated) */}
          <div className="flex flex-col items-center self-end transform rotate-180">
            <span className={`text-3xl font-bold ${colorClass}`}>{rank}</span>
            <SuitIconSVG suit={suit} className="w-6 h-6" />
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute top-0 left-0 w-full h-full backface-hidden rotate-y-180 bg-blue-900 rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden">
          {/* Card Back Pattern */}
          <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] h-[80%] border-2 border-slate-400/30 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
