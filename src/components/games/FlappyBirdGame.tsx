import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

interface FlappyBirdGameProps {
  onGameEnd: (score: number, timePlayed: number, completed: boolean) => void;
}

const FlappyBirdGame = ({ onGameEnd }: FlappyBirdGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const bird = useRef({ x: 100, y: 200, velocity: 0, radius: 15 });
  const pipes = useRef<Array<{ x: number; topHeight: number; bottomY: number; passed: boolean }>>([]);
  const animationId = useRef(0);
  const gameRunning = useRef(false);

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -8;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const GAME_SPEED = 2;

  const createPipe = () => {
    const topHeight = Math.random() * 200 + 50;
    return {
      x: 800,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false
    };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#0a0f1c');
    gradient.addColorStop(1, '#1a2332');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    pipes.current.forEach(pipe => {
      ctx.fillStyle = '#2dd4bf';
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, 600 - pipe.bottomY);
    });

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(bird.current.x, bird.current.y, bird.current.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 580, 800, 20);
  };

  const update = () => {
    if (!gameRunning.current) return;

    bird.current.velocity += GRAVITY;
    bird.current.y += bird.current.velocity;

    if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < 600) {
      pipes.current.push(createPipe());
    }

    pipes.current.forEach(pipe => {
      pipe.x -= GAME_SPEED;
      
      if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.current.x) {
        pipe.passed = true;
        setScore(prev => prev + 1);
      }
    });

    pipes.current = pipes.current.filter(pipe => pipe.x > -PIPE_WIDTH);

    const birdTop = bird.current.y - bird.current.radius;
    const birdBottom = bird.current.y + bird.current.radius;
    const birdLeft = bird.current.x - bird.current.radius;
    const birdRight = bird.current.x + bird.current.radius;

    if (birdTop <= 0 || birdBottom >= 580) {
      gameRunning.current = false;
      setGameState('ended');
      return;
    }

    pipes.current.forEach(pipe => {
      if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          gameRunning.current = false;
          setGameState('ended');
        }
      }
    });
  };

  const gameLoop = () => {
    if (gameRunning.current) {
      update();
      draw();
      animationId.current = requestAnimationFrame(gameLoop);
    }
  };

  const jump = () => {
    if (gameRunning.current) {
      bird.current.velocity = JUMP_STRENGTH;
    }
  };

  const startGame = () => {
    bird.current = { x: 100, y: 200, velocity: 0, radius: 15 };
    pipes.current = [];
    setScore(0);
    setStartTime(Date.now());
    gameRunning.current = true;
    setGameState('playing');
    gameLoop();
  };

  const resetGame = () => {
    gameRunning.current = false;
    cancelAnimationFrame(animationId.current);
    setGameState('idle');
    bird.current = { x: 100, y: 200, velocity: 0, radius: 15 };
    pipes.current = [];
    draw();
  };

  useEffect(() => {
    if (gameState === 'ended' && !gameRunning.current) {
      onGameEnd(score, Date.now() - startTime, false);
    }
  }, [gameState, score, startTime, onGameEnd]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    draw();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      gameRunning.current = false;
      cancelAnimationFrame(animationId.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="liquid-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between aurora-text">
            <span>Mindful Flight</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Score: {score}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-600 rounded-lg cursor-pointer"
            onClick={jump}
          />
          
          <div className="flex justify-center gap-4 mt-4">
            {gameState === 'idle' && (
              <Button onClick={startGame} className="bg-gradient-to-r from-aurora-green to-aurora-teal">
                <Play className="h-4 w-4 mr-2" />
                Start Flying
              </Button>
            )}
            
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {gameState === 'ended' && (
            <div className="text-center mt-4 p-4 liquid-glass rounded-lg">
              <h3 className="text-xl font-bold aurora-text mb-2">Flight Complete!</h3>
              <p className="text-gray-300">Final Score: {score}</p>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-gray-400">
            <p>Click or press SPACE to flap wings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlappyBirdGame;