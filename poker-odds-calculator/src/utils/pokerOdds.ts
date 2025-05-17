import { Hand } from 'pokersolver';
import { Card, HandOdds, GameState } from '../types/poker';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['h', 'd', 'c', 's'];

const cardToString = (card: Card): string => {
  return `${card.rank}${card.suit}`;
};

const getRemainingDeck = (usedCards: Card[]): Card[] => {
  const deck: Card[] = [];
  const usedCardStrings = usedCards.map(cardToString);

  for (const rank of RANKS) {
    for (const suit of SUITS) {
      const cardString = `${rank}${suit}`;
      if (!usedCardStrings.includes(cardString)) {
        deck.push({ rank, suit });
      }
    }
  }
  return deck;
};

const simulateHand = (
  playerHoleCards: Card[],
  communityCards: Card[],
  numberOfOpponents: number
): boolean => {
  const remainingDeck = getRemainingDeck([...playerHoleCards, ...communityCards]);
  const remainingCommunityCards = 5 - communityCards.length;
  
  // Generate random community cards to complete the board
  const simulatedCommunityCards = [...communityCards];
  for (let i = 0; i < remainingCommunityCards; i++) {
    const randomIndex = Math.floor(Math.random() * remainingDeck.length);
    simulatedCommunityCards.push(remainingDeck[randomIndex]);
    remainingDeck.splice(randomIndex, 1);
  }

  // Generate random hole cards for opponents
  const opponentHands: Card[][] = [];
  for (let i = 0; i < numberOfOpponents; i++) {
    const hand: Card[] = [];
    for (let j = 0; j < 2; j++) {
      const randomIndex = Math.floor(Math.random() * remainingDeck.length);
      hand.push(remainingDeck[randomIndex]);
      remainingDeck.splice(randomIndex, 1);
    }
    opponentHands.push(hand);
  }

  // Evaluate all hands
  const playerHandString = [...playerHoleCards, ...simulatedCommunityCards].map(cardToString);
  const playerHand = Hand.solve(playerHandString);

  const opponentHandStrings = opponentHands.map(hand => 
    [...hand, ...simulatedCommunityCards].map(cardToString)
  );
  const opponentHandValues = opponentHandStrings.map(hand => Hand.solve(hand));

  // Compare hands
  for (const opponentHand of opponentHandValues) {
    if (playerHand.compare(opponentHand) < 0) {
      return false; // Player lost
    }
  }
  return true; // Player won or tied
};

export const calculateOdds = (gameState: GameState): HandOdds => {
  const { holeCards, communityCards, numberOfPlayers } = gameState;
  
  if (holeCards.length !== 2) {
    return { winProbability: 0, tieProbability: 0 };
  }

  const SIMULATION_COUNT = 1000;
  let wins = 0;

  for (let i = 0; i < SIMULATION_COUNT; i++) {
    if (simulateHand(holeCards, communityCards, numberOfPlayers - 1)) {
      wins++;
    }
  }

  return {
    winProbability: wins / SIMULATION_COUNT,
    tieProbability: 0, // For simplicity, we're not calculating tie probability separately
  };
}; 