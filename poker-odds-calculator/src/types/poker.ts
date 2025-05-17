export type Card = {
  rank: string;
  suit: string;
};

export type HandOdds = {
  winProbability: number;
  tieProbability: number;
};

export type GameState = {
  holeCards: Card[];
  communityCards: Card[];
  numberOfPlayers: number;
}; 