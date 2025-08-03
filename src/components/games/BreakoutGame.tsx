import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

interface BreakoutGameProps {
  onGameEnd: (score: number, timePlayed: number, completed: boolean) => void;
}

const BreakoutGame = ({ onGameEnd }: BreakoutGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [startTime, setStartTime] = useState(0);

  // Game objects
  const paddle = useRef({ x: 350, y: 570, width: 100, height: 10 });
  const ball = useRef({ x: 400, y: 300, dx: 4, dy: -4, radius: 8 });
  const bricks = useRef<Array<{ x: number; y: number; visible: boolean; color: string }>>([]);
  const keys = useRef({ left: false, right: false });
  const animationId = useRef(0);

  const colors = ['#2dd4bf', '#8b5cf6', '#ec4899', '#10b981', '#06b6d4'];

  const createBricks = () => {
    const newBricks = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 10; col++) {
        newBricks.push({
          x: col * 80 + 35,
          y: row * 25 + 60,
          visible: true,
          color: colors[row % colors.length]
        });
      }
    }
    bricks.current = newBricks;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0f1c';
    ctx.fillRect(0, 0, 800, 600);

    // Draw paddle
    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(paddle.current.x, paddle.current.y, paddle.current.width, paddle.current.height);

    // Draw ball
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw bricks
    bricks.current.forEach(brick => {
      if (brick.visible) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, 75, 20);
      }
    });
  };

  const update = () => {
    // Move paddle
    if (keys.current.left && paddle.current.x > 0) {
      paddle.current.x -= 8;
    }
    if (keys.current.right && paddle.current.x < 700) {
      paddle.current.x += 8;
    }

    // Move ball
    ball.current.x += ball.current.dx;
    ball.current.y += ball.current.dy;

    // Ball wall collision
    if (ball.current.x <= ball.current.radius || ball.current.x >= 800 - ball.current.radius) {
      ball.current.dx = -ball.current.dx;
    }
    if (ball.current.y <= ball.current.radius) {
      ball.current.dy = -ball.current.dy;
    }

    // Ball paddle collision
    if (ball.current.y + ball.current.radius > paddle.current.y &&
        ball.current.x > paddle.current.x && 
        ball.current.x < paddle.current.x + paddle.current.width) {
      ball.current.dy = -Math.abs(ball.current.dy);
    }

    // Ball brick collision
    bricks.current.forEach(brick => {
      if (brick.visible &&
          ball.current.x > brick.x && ball.current.x < brick.x + 75 &&
          ball.current.y > brick.y && ball.current.y < brick.y + 20) {
        brick.visible = false;
        ball.current.dy = -ball.current.dy;
        setScore(prev => prev + 10);
      }
    });

    // Ball falls down
    if (ball.current.y > 600) {
      setLives(prev => {
        if (prev <= 1) {
          setGameState('ended');
          return 0;
        }
        // Reset ball
        ball.current.x = 400;
        ball.current.y = 300;
        ball.current.dx = 4;
        ball.current.dy = -4;
        return prev - 1;
      });
    }

    // Win condition
    if (bricks.current.every(brick => !brick.visible)) {
      setGameState('ended');
    }
  };

  const gameLoop = () => {
    if (gameState === 'playing') {
      update();
      draw();
      animationId.current = requestAnimationFrame(gameLoop);
    }
  };

  const startGame = () => {
    createBricks();
    paddle.current.x = 350;
    ball.current = { x: 400, y: 300, dx: 4, dy: -4, radius: 8 };
    setScore(0);
    setLives(3);
    setStartTime(Date.now());
    setGameState('playing');
  };

  const resetGame = () => {
    cancelAnimationFrame(animationId.current);
    setGameState('idle');
    createBricks();
    paddle.current.x = 350;
    ball.current = { x: 400, y: 300, dx: 4, dy: -4, radius: 8 };
    draw();
  };

  // Start game loop when state changes to playing
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoop();
    }
  }, [gameState]);

  // Handle game end
  useEffect(() => {
    if (gameState === 'ended') {
      const completed = bricks.current.every(brick => !brick.visible);
      onGameEnd(score, Date.now() - startTime, completed);
    }
  }, [gameState, score, startTime, onGameEnd]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'ArrowRight') keys.current.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'ArrowRight') keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Initial setup
    createBricks();
    draw();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="liquid-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between aurora-text">
            <span>Breakout Therapy</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Score: {score}
              </span>
              <span>Lives: {lives}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-600 rounded-lg"
          />
          
          <div className="flex justify-center gap-4 mt-4">
            {gameState === 'idle' && (
              <Button onClick={startGame} className="bg-gradient-to-r from-aurora-electric-blue to-aurora-cyan">
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            )}
            
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {gameState === 'ended' && (
            <div className="text-center mt-4 p-4 liquid-glass rounded-lg">
              <h3 className="text-xl font-bold aurora-text mb-2">
                {lives <= 0 ? 'Game Over!' : 'Congratulations!'}
              </h3>
              <p className="text-gray-300">Final Score: {score}</p>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-gray-400">
            <p>Use ← → arrow keys to move the paddle</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreakoutGame;