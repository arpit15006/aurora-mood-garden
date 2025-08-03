import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Trophy, Clock } from 'lucide-react';

interface WordSearchGameProps {
  onGameEnd: (score: number, timePlayed: number, completed: boolean) => void;
}

const WordSearchGame = ({ onGameEnd }: WordSearchGameProps) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [category, setCategory] = useState('space');
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const categories = {
    space: ['GALAXY', 'PLANET', 'COMET', 'NEBULA', 'ORBIT', 'SOLAR', 'LUNAR', 'COSMIC'],
    monuments: ['PYRAMID', 'TOWER', 'STATUE', 'TEMPLE', 'PALACE', 'BRIDGE', 'CASTLE', 'SPHINX'],
    cities: ['PARIS', 'TOKYO', 'LONDON', 'SYDNEY', 'BERLIN', 'MADRID', 'ROME', 'DUBAI'],
    science: ['ATOM', 'MOLECULE', 'ENERGY', 'GRAVITY', 'PHOTON', 'QUANTUM', 'PLASMA', 'FUSION']
  };

  const gridSize = 15;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  const generateGrid = useCallback(() => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const categoryWords = categories[category as keyof typeof categories];
    const placedWords: string[] = [];

    // Place words randomly
    categoryWords.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 50) {
        const direction = Math.floor(Math.random() * 8); // 8 directions
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        
        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction);
          placedWords.push(word);
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
    setWords(placedWords);
    setFoundWords(new Set());
  }, [category]);

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: number): boolean => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    const [dr, dc] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;
      
      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false;
      }
      
      if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    
    return true;
  };

  const placeWord = (grid: string[][], word: string, row: number, col: number, direction: number) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    const [dr, dc] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;
      grid[newRow][newCol] = word[i];
    }
  };

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells(new Set([`${row}-${col}`]));
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectedCells(prev => new Set([...prev, `${row}-${col}`]));
    }
  };

  const handleCellMouseUp = () => {
    if (isSelecting) {
      checkForWord();
      setIsSelecting(false);
      setSelectedCells(new Set());
    }
  };

  const checkForWord = () => {
    const selectedLetters = Array.from(selectedCells)
      .sort((a, b) => {
        const [aRow, aCol] = a.split('-').map(Number);
        const [bRow, bCol] = b.split('-').map(Number);
        return aRow - bRow || aCol - bCol;
      })
      .map(cell => {
        const [row, col] = cell.split('-').map(Number);
        return grid[row][col];
      })
      .join('');

    const reversedLetters = selectedLetters.split('').reverse().join('');

    words.forEach(word => {
      if ((selectedLetters === word || reversedLetters === word) && !foundWords.has(word)) {
        // Highlight found word cells
        setFoundCells(prev => new Set([...prev, ...selectedCells]));
        
        setFoundWords(prev => {
          const newFoundWords = new Set([...prev, word]);
          
          // Check win condition
          if (newFoundWords.size === words.length) {
            setTimeout(() => {
              setGameState('ended');
              onGameEnd(newFoundWords.size * 100, Date.now() - startTime, true);
            }, 500);
          }
          
          return newFoundWords;
        });
      }
    });
  };

  const startGame = () => {
    generateGrid();
    setGameState('playing');
    setStartTime(Date.now());
    setTimeElapsed(0);
  };

  const resetGame = () => {
    setGameState('idle');
    setFoundWords(new Set());
    setSelectedCells(new Set());
    setFoundCells(new Set());
    setTimeElapsed(0);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="liquid-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between aurora-text">
            <span>Word Search Zen</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Found: {foundWords.size}/{words.length}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === 'idle' && (
            <div className="text-center space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Choose Category:</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-48 mx-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="space">🚀 Space</SelectItem>
                    <SelectItem value="monuments">🏛️ Famous Monuments</SelectItem>
                    <SelectItem value="cities">🏙️ Cities</SelectItem>
                    <SelectItem value="science">🔬 Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={startGame} className="bg-gradient-to-r from-aurora-purple to-aurora-pink">
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {words.map(word => (
                    <Badge
                      key={word}
                      variant={foundWords.has(word) ? "default" : "outline"}
                      className={foundWords.has(word) ? "bg-green-600" : ""}
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
                
                <Button onClick={resetGame} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="grid grid-cols-15 gap-1 max-w-2xl mx-auto select-none">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                        border border-gray-600 rounded transition-colors
                        ${foundCells.has(`${rowIndex}-${colIndex}`) 
                          ? 'bg-green-600 text-white' 
                          : selectedCells.has(`${rowIndex}-${colIndex}`) 
                          ? 'bg-aurora-electric-blue text-white' 
                          : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                        }
                      `}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleCellMouseUp}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {gameState === 'ended' && (
            <div className="text-center space-y-4 p-4 liquid-glass rounded-lg">
              <h3 className="text-xl font-bold aurora-text mb-2">Congratulations!</h3>
              <p className="text-gray-300">You found all {foundWords.size} words!</p>
              <p className="text-gray-300">Time: {formatTime(timeElapsed)}</p>
              <Button onClick={resetGame} className="bg-gradient-to-r from-aurora-purple to-aurora-pink">
                Play Again
              </Button>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-gray-400">
            <p>Click and drag to select words in any direction</p>
            <p className="mt-1 text-xs">Word searching improves focus and reduces anxiety</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordSearchGame;