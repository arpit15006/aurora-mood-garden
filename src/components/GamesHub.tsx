import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Clock, Star, ArrowLeft, Brain, Target, Palette, Bird, BarChart3, Wind } from 'lucide-react';
import BreakoutGame from './games/BreakoutGame';
import WordSearchGame from './games/WordSearchGame';
import FlappyBirdGame from './games/FlappyBirdGame';
import ColorMemoryGame from './games/ColorMemoryGame';
import BreathingExercise from './games/BreathingExercise';
import GameInsights from './games/GameInsights';
import { supabase } from '@/integrations/supabase/client';

interface GameStats {
  id: string;
  game_type: string;
  score: number;
  time_played: number;
  completed: boolean;
  created_at: string;
}

interface GamesHubProps {
  onBack: () => void;
}

const GamesHub = ({ onBack }: GamesHubProps) => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'games' | 'insights'>('games');
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const games = [
    {
      id: 'breakout',
      title: 'Breakout Therapy',
      description: 'Break through stress with classic brick-breaking action',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      component: BreakoutGame
    },
    {
      id: 'wordsearch',
      title: 'Word Search Zen',
      description: 'Find peace through focused word discovery',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      component: WordSearchGame
    },
    {
      id: 'flappybird',
      title: 'Mindful Flight',
      description: 'Navigate challenges with calm focus',
      icon: Bird,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      component: FlappyBirdGame
    },
    {
      id: 'colormemory',
      title: 'Color Memory Flow',
      description: 'Enhance memory and reduce anxiety',
      icon: Palette,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      component: ColorMemoryGame
    },
    {
      id: 'breathing',
      title: 'Mindful Breathing',
      description: 'Calm your mind with guided breathing',
      icon: Wind,
      color: 'from-teal-500 to-blue-500',
      bgColor: 'bg-teal-500/10',
      component: BreathingExercise
    }
  ];

  useEffect(() => {
    loadGameStats();
    generateAIInsights();
  }, []);

  const loadGameStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGameStats(data || []);
    } catch (error) {
      console.error('Error loading game stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{
            role: 'system',
            content: 'You are a mental wellness AI providing insights about therapeutic gaming for stress relief. Provide encouraging, brief insights about how games can help with mood and stress management.'
          }, {
            role: 'user',
            content: 'Generate a brief insight about how therapeutic games can help students manage stress and improve mood.'
          }],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      setAiInsights(data.choices[0]?.message?.content || 'Games provide a healthy escape and can help reduce stress while improving focus and mood.');
    } catch (error) {
      setAiInsights('Games provide a healthy escape and can help reduce stress while improving focus and mood.');
    }
  };

  const getGameStats = (gameType: string) => {
    const stats = gameStats.filter(stat => stat.game_type === gameType);
    const totalPlayed = stats.length;
    const totalScore = stats.reduce((sum, stat) => sum + (stat.score || 0), 0);
    const totalTime = stats.reduce((sum, stat) => sum + (stat.time_played || 0), 0);
    const completed = stats.filter(stat => stat.completed === true).length;
    
    return { totalPlayed, totalScore, totalTime, completed };
  };

  const saveGameResult = async (gameType: string, score: number, timePlayed: number, completed: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('game_stats')
        .insert({
          user_id: user.id,
          game_type: gameType,
          score,
          time_played: timePlayed,
          completed
        });

      if (error) throw error;
      loadGameStats();
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  if (currentGame) {
    const game = games.find(g => g.id === currentGame);
    const GameComponent = game?.component;
    
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentGame(null)}
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            <h1 className="text-2xl font-bold aurora-text">{game?.title}</h1>
          </div>
          
          {GameComponent && (
            <GameComponent
              onGameEnd={(score: number, timePlayed: number, completed: boolean) => {
                saveGameResult(currentGame, score, timePlayed, completed);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'insights') {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => setCurrentView('games')}
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            <div className="text-center">
              <h1 className="text-4xl font-bold aurora-text-glow mb-2">Gaming Insights</h1>
              <p className="text-gray-300">Your therapeutic gaming analytics</p>
            </div>
            <div className="w-20" />
          </div>
          
          <GameInsights gameStats={gameStats} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold aurora-text-glow mb-2">Therapeutic Games</h1>
            <p className="text-gray-300">Relieve stress through mindful gaming</p>
          </div>
          <Button
            onClick={() => setCurrentView('insights')}
            variant="outline"
            className="text-gray-300 hover:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Insights
          </Button>
        </div>

        <Card className="liquid-glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 aurora-text">
              <Brain className="h-5 w-5" />
              AI Wellness Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200">{aiInsights}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {games.map((game) => {
            const Icon = game.icon;
            const stats = getGameStats(game.id);
            
            return (
              <Card
                key={game.id}
                className="liquid-glass-card cursor-pointer hover:scale-105 transition-all duration-300 group"
                onClick={() => setCurrentGame(game.id)}
              >
                <div className={`absolute inset-0 ${game.bgColor} opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-lg`} />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${game.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="aurora-text-dark">{game.title}</CardTitle>
                        <CardDescription className="text-gray-300">{game.description}</CardDescription>
                      </div>
                    </div>
                    <Gamepad2 className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-300">Best: {stats.totalPlayed > 0 ? Math.max(...gameStats.filter(s => s.game_type === game.id).map(s => s.score || 0)) : 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300">Played: {stats.totalPlayed}x</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Completed: {stats.completed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Time: {stats.totalTime > 0 ? Math.round(stats.totalTime / 60000) : 0}min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="liquid-glass-card">
          <CardHeader>
            <CardTitle className="aurora-text">Your Gaming Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {games.map((game) => {
                const stats = getGameStats(game.id);
                const progress = stats.totalPlayed > 0 ? Math.min((stats.totalPlayed / 10) * 100, 100) : 0;
                const level = stats.totalPlayed > 0 ? Math.floor(stats.totalPlayed / 5) + 1 : 1;
                
                return (
                  <div key={game.id} className="text-center">
                    <h4 className="font-semibold text-gray-200 mb-2">{game.title}</h4>
                    <Progress value={progress} className="mb-2" />
                    <Badge variant="secondary" className="text-xs">
                      Level {level}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamesHub;