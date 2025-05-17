import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { Card as PokerCard, GameState } from '../types/poker';
import { calculateOdds } from '../utils/pokerOdds';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['h', 'd', 'c', 's'];

const PokerOddsCalculator: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    holeCards: [],
    communityCards: [],
    numberOfPlayers: 2,
  });

  const [odds, setOdds] = useState<{ winProbability: number; tieProbability: number }>({
    winProbability: 0,
    tieProbability: 0,
  });

  const [selectedRank, setSelectedRank] = useState<string>('');
  const [selectedSuit, setSelectedSuit] = useState<string>('');

  useEffect(() => {
    if (gameState.holeCards.length === 2) {
      const calculatedOdds = calculateOdds(gameState);
      setOdds(calculatedOdds);
    }
  }, [gameState]);

  const addCard = (type: 'hole' | 'community') => {
    if (!selectedRank || !selectedSuit) return;

    const newCard: PokerCard = {
      rank: selectedRank,
      suit: selectedSuit,
    };

    if (type === 'hole' && gameState.holeCards.length < 2) {
      setGameState({
        ...gameState,
        holeCards: [...gameState.holeCards, newCard],
      });
    } else if (type === 'community' && gameState.communityCards.length < 5) {
      setGameState({
        ...gameState,
        communityCards: [...gameState.communityCards, newCard],
      });
    }

    setSelectedRank('');
    setSelectedSuit('');
  };

  const resetCards = () => {
    setGameState({
      ...gameState,
      holeCards: [],
      communityCards: [],
    });
    setOdds({ winProbability: 0, tieProbability: 0 });
  };

  const renderCard = (card: PokerCard) => {
    const color = card.suit === 'h' || card.suit === 'd' ? 'red' : 'black';
    return (
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          margin: '4px',
          display: 'inline-block',
          color,
          minWidth: '30px',
          textAlign: 'center',
        }}
      >
        {card.rank}
        {getSuitSymbol(card.suit)}
      </Box>
    );
  };

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'h': return '♥';
      case 'd': return '♦';
      case 'c': return '♣';
      case 's': return '♠';
      default: return '';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Texas Hold'em Odds Calculator
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Hand
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {gameState.holeCards.map((card, index) => (
                    <span key={index}>{renderCard(card)}</span>
                  ))}
                </Box>
                {gameState.holeCards.length < 2 && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small">
                      <InputLabel>Rank</InputLabel>
                      <Select
                        value={selectedRank}
                        label="Rank"
                        onChange={(e) => setSelectedRank(e.target.value)}
                        sx={{ minWidth: 80 }}
                      >
                        {RANKS.map((rank) => (
                          <MenuItem key={rank} value={rank}>
                            {rank}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <InputLabel>Suit</InputLabel>
                      <Select
                        value={selectedSuit}
                        label="Suit"
                        onChange={(e) => setSelectedSuit(e.target.value)}
                        sx={{ minWidth: 80 }}
                      >
                        {SUITS.map((suit) => (
                          <MenuItem key={suit} value={suit}>
                            {getSuitSymbol(suit)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={() => addCard('hole')}
                      disabled={!selectedRank || !selectedSuit}
                    >
                      Add Card
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Community Cards
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {gameState.communityCards.map((card, index) => (
                    <span key={index}>{renderCard(card)}</span>
                  ))}
                </Box>
                {gameState.communityCards.length < 5 && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small">
                      <InputLabel>Rank</InputLabel>
                      <Select
                        value={selectedRank}
                        label="Rank"
                        onChange={(e) => setSelectedRank(e.target.value)}
                        sx={{ minWidth: 80 }}
                      >
                        {RANKS.map((rank) => (
                          <MenuItem key={rank} value={rank}>
                            {rank}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <InputLabel>Suit</InputLabel>
                      <Select
                        value={selectedSuit}
                        label="Suit"
                        onChange={(e) => setSelectedSuit(e.target.value)}
                        sx={{ minWidth: 80 }}
                      >
                        {SUITS.map((suit) => (
                          <MenuItem key={suit} value={suit}>
                            {getSuitSymbol(suit)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={() => addCard('community')}
                      disabled={!selectedRank || !selectedSuit}
                    >
                      Add Card
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Number of Players
                </Typography>
                <FormControl size="small">
                  <Select
                    value={gameState.numberOfPlayers}
                    onChange={(e) => setGameState({
                      ...gameState,
                      numberOfPlayers: Number(e.target.value),
                    })}
                    sx={{ minWidth: 100 }}
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Winning Odds
                </Typography>
                <Typography variant="h4" color="primary">
                  {(odds.winProbability * 100).toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={resetCards}
              fullWidth
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PokerOddsCalculator; 