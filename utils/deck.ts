import { Card, Rank, Suit } from '../types';

export const createDeck = (deckCount: number): Card[] => {
  const cards: Card[] = [];
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  // Exclude Joker from the standard ranks loop
  const ranks = Object.values(Rank).filter(r => r !== Rank.JOKER);

  for (let d = 0; d < deckCount; d++) {
    // Standard 52 cards
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push({
          id: `${d}-${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`,
          suit,
          rank
        });
      }
    }
    
    // Add 2 Jokers per deck
    for (let j = 0; j < 2; j++) {
      cards.push({
        id: `${d}-JOKER-${j}-${Math.random().toString(36).substr(2, 9)}`,
        suit: Suit.JOKER,
        rank: Rank.JOKER
      });
    }
  }

  return cards;
};

// Fisher-Yates Shuffle
export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const getSuitColor = (suit: Suit): string => {
  if (suit === Suit.JOKER) return 'text-purple-600';
  return suit === Suit.HEARTS || suit === Suit.DIAMONDS ? 'text-red-600' : 'text-slate-900';
};

export const getSuitIcon = (suit: Suit) => {
  switch (suit) {
    case Suit.HEARTS: return '♥';
    case Suit.DIAMONDS: return '♦';
    case Suit.CLUBS: return '♣';
    case Suit.SPADES: return '♠';
    case Suit.JOKER: return '★';
  }
};