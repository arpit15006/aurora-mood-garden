import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy, Brain } from 'lucide-react';

interface ColorMemoryGameProps {
  onGameEnd: (score: number, timePlayed: number, completed: boolean) => void;
}

const ColorMemoryGame = ({ onGameEnd }: ColorMemoryGameProps) => {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'ended'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [showingIndex, setShowingIndex] = useState(0);

  const colors = [
    { bg: '#2dd4bf', active: '#14b8a6', name: 'Cyan' },
    { bg: '#8b5cf6', active: '#7c3aed', name: 'Purple' },
    { bg: '#ec4899', active: '#db2777', name: 'Pink' },
    { bg: '#10b981', active: '#059669', name: 'Green' },
    { bg: '#f59e0b', active: '#d97706', name: 'Orange' },
    { bg: '#ef4444', active: '#dc2626', name: 'Red' }
  ];

  const showSequence = async () => {
    setGameState('showing');
    setActiveColor(null);
    
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(sequence[i]);
      setShowingIndex(i);
      
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(null);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setGameState('playing');
  };

  const addToSequence = () => {
    const nextColor = Math.floor(Math.random() * colors.length);
    setSequence(prev => [...prev, nextColor]);
  };

  const handleColorClick = (colorIndex: number) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    // Flash clicked color
    setActiveColor(colorIndex);
    setTimeout(() => setActiveColor(null), 200);

    // Check if correct
    if (colorIndex !== sequence[playerSequence.length]) {
      setGameState('ended');
      return;
    }

    // Check if sequence complete
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + sequence.length * 10;
      setScore(newScore);
      setPlayerSequence([]);
      
      // Check win condition
      if (sequence.length >= 10) {
        setGameState('ended');
        return;
      }
      
      // Next level
      setTimeout(() => {
        addToSequence();
      }, 1000);
    }
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setActiveColor(null);
    setShowingIndex(0);
    setStartTime(Date.now());
    setGameState('playing');
    
    // Add first color to sequence
    const firstColor = Math.floor(Math.random() * colors.length);
    setSequence([firstColor]);
  };

  const resetGame = () => {
    setGameState('idle');
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setActiveColor(null);
    setShowingIndex(0);
  };

  // Show sequence when it changes
  useEffect(() => {
    if (sequence.length > 0 && gameState === 'playing') {
      showSequence();
    }
  }, [sequence]);

  // Handle game end
  useEffect(() => {
    if (gameState === 'ended') {
      const completed = sequence.length >= 10;
      onGameEnd(score, Date.now() - startTime, completed);
    }
  }, [gameState, score, startTime, onGameEnd]);

  const getColorStyle = (index: number) => {
    const color = colors[index];
    const isActive = activeColor === index;
    
    return {
      backgroundColor: isActive ? color.active : color.bg,
      transform: isActive ? 'scale(0.95)' : 'scale(1)',
      boxShadow: isActive 
        ? `0 0 20px ${color.active}` 
        : `0 4px 15px rgba(0, 0, 0, 0.3)`,
    };
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="liquid-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between aurora-text">
            <span>Color Memory Flow</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Score: {score}
              </span>
              <span className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                Level: {sequence.length}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Game Status */}
            <div className="text-center">
              {gameState === 'idle' && (
                <p className="text-gray-300">Ready to test your memory?</p>
              )}
              {gameState === 'showing' && (
                <p className="text-cyan-400 font-semibold">Watch the sequence...</p>
              )}
              {gameState === 'playing' && (
                <p className="text-green-400 font-semibold">
                  Repeat the sequence ({playerSequence.length}/{sequence.length})
                </p>
              )}
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className="w-24 h-24 rounded-xl transition-all duration-200 border-2 border-white/20 hover:border-white/40 disabled:cursor-not-allowed"
                  style={getColorStyle(index)}
                  onClick={() => handleColorClick(index)}
                  disabled={gameState !== 'playing'}
                >
                  <span className="text-white font-bold text-sm opacity-80">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {gameState === 'idle' && (
                <Button onClick={startGame} className="bg-gradient-to-r from-aurora-orange to-aurora-pink">
                  <Play className="h-4 w-4 mr-2" />
                  Start Memory Test
                </Button>
              )}
              
              <Button onClick={resetGame} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Game Over Screen */}
            {gameState === 'ended' && (
              <div className="text-center p-4 liquid-glass rounded-lg">
                <h3 className="text-xl font-bold aurora-text mb-2">
                  {sequence.length >= 10 ? 'Memory Master!' : 'Good Try!'}
                </h3>
                <p className="text-gray-300">Final Score: {score}</p>
                <p className="text-gray-300">Reached Level: {sequence.length}</p>
              </div>
            )}

            {/* Progress Indicator */}
            {sequence.length > 0 && (
              <div className="flex justify-center space-x-2">
                {sequence.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index < playerSequence.length 
                        ? 'bg-green-400' 
                        : index === playerSequence.length && gameState === 'playing'
                        ? 'bg-yellow-400 animate-pulse'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorMemoryGame;