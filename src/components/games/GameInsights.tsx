import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Clock, Target, Lightbulb } from 'lucide-react';

interface GameInsightsProps {
  gameStats: Array<{
    game_type: string;
    score: number;
    time_played: number;
    completed: boolean;
    created_at: string;
  }>;
}

const GameInsights = ({ gameStats }: GameInsightsProps) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, [gameStats]);

  const generateInsights = async () => {
    if (gameStats.length === 0) {
      setInsights('Start playing games to receive personalized wellness insights!');
      setLoading(false);
      return;
    }

    try {
      const gameAnalysis = analyzeGameData();
      
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
            content: 'You are a mental wellness AI analyzing therapeutic gaming patterns. Provide encouraging, personalized insights about stress relief and cognitive benefits based on gaming data. Keep responses under 200 words and focus on positive reinforcement and wellness benefits.'
          }, {
            role: 'user',
            content: `Analyze this gaming data and provide wellness insights: ${JSON.stringify(gameAnalysis)}`
          }],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      setInsights(data.choices[0]?.message?.content || 'Your gaming sessions are contributing positively to your mental wellness journey!');
    } catch (error) {
      setInsights('Your consistent gaming practice shows dedication to stress relief and mental wellness. Keep up the great work!');
    } finally {
      setLoading(false);
    }
  };

  const analyzeGameData = () => {
    if (gameStats.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        completedGames: 0,
        averageScore: 0,
        mostPlayedGame: 'None',
        recentSessions: 0,
        completionRate: 0
      };
    }

    const totalSessions = gameStats.length;
    const totalTime = gameStats.reduce((sum, stat) => sum + (stat.time_played || 0), 0);
    const completedGames = gameStats.filter(stat => stat.completed === true).length;
    const averageScore = Math.round(gameStats.reduce((sum, stat) => sum + (stat.score || 0), 0) / totalSessions);
    
    const gameTypes = gameStats.reduce((acc, stat) => {
      acc[stat.game_type] = (acc[stat.game_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPlayedGame = Object.keys(gameTypes).length > 0 
      ? Object.entries(gameTypes).reduce((a, b) => gameTypes[a[0]] > gameTypes[b[0]] ? a : b)[0]
      : 'None';

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentSessions = gameStats.filter(stat => 
      new Date(stat.created_at).getTime() > weekAgo
    ).length;

    return {
      totalSessions,
      totalTime: Math.round(totalTime / 60000), // Convert to minutes
      completedGames,
      averageScore,
      mostPlayedGame,
      recentSessions,
      completionRate: totalSessions > 0 ? Math.round((completedGames / totalSessions) * 100) : 0
    };
  };

  const getGameTypeLabel = (gameType: string) => {
    const labels = {
      breakout: 'Breakout Therapy',
      wordsearch: 'Word Search Zen',
      flappybird: 'Mindful Flight',
      colormemory: 'Color Memory Flow'
    };
    return labels[gameType as keyof typeof labels] || gameType;
  };

  const analysis = gameStats.length > 0 ? analyzeGameData() : null;

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="liquid-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 aurora-text">
            <Brain className="h-5 w-5" />
            AI Wellness Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
              Analyzing your gaming patterns...
            </div>
          ) : (
            <p className="text-gray-200 leading-relaxed">{insights}</p>
          )}
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="liquid-glass">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold aurora-text">{analysis.totalSessions}</div>
              <div className="text-sm text-gray-400">Total Sessions</div>
            </CardContent>
          </Card>

          <Card className="liquid-glass">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold aurora-text">{analysis.totalTime}m</div>
              <div className="text-sm text-gray-400">Time Played</div>
            </CardContent>
          </Card>

          <Card className="liquid-glass">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold aurora-text">{analysis.completionRate}%</div>
              <div className="text-sm text-gray-400">Completion Rate</div>
            </CardContent>
          </Card>

          <Card className="liquid-glass">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold aurora-text">{analysis.recentSessions}</div>
              <div className="text-sm text-gray-400">This Week</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Favorite Game */}
      {analysis && (
        <Card className="liquid-glass-card">
          <CardHeader>
            <CardTitle className="text-lg aurora-text">Your Gaming Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Most Played Game:</p>
                <p className="text-xl font-semibold aurora-text-dark">
                  {getGameTypeLabel(analysis.mostPlayedGame)}
                </p>
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-aurora-electric-blue to-aurora-cyan text-white">
                Favorite
              </Badge>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Average Score: {analysis.averageScore} points</p>
              <p>Games Completed: {analysis.completedGames} out of {analysis.totalSessions}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wellness Benefits */}
      <Card className="liquid-glass-card">
        <CardHeader>
          <CardTitle className="aurora-text">Therapeutic Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-cyan-400">Stress Relief</h4>
              <p className="text-sm text-gray-300">Gaming provides a healthy escape and helps reduce cortisol levels</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-400">Cognitive Enhancement</h4>
              <p className="text-sm text-gray-300">Improves memory, focus, and problem-solving abilities</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Mood Regulation</h4>
              <p className="text-sm text-gray-300">Releases endorphins and promotes positive emotional states</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-pink-400">Mindfulness Practice</h4>
              <p className="text-sm text-gray-300">Encourages present-moment awareness and mental clarity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInsights;