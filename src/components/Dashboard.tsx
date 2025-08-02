
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Brain, Target, RefreshCw, BookOpen, MessageSquare, Flower2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';

const Dashboard = () => {
  const [emotionData, setEmotionData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [totalEmotionLogs, setTotalEmotionLogs] = useState(0);
  const [averageConfidence, setAverageConfidence] = useState(0);
  const [moodDistribution, setMoodDistribution] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [insights, setInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const { user } = useUser();

  const groqApiKey = "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";

  const callGroqAPI = async (prompt: string) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are Aurora, an AI wellness companion. Analyze comprehensive emotional and wellness patterns from multiple data sources and provide supportive, actionable insights for students.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 600,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return 'Unable to generate insights at this time. Please try again later.';
    }
  };

  const fetchAllData = async () => {
    if (!user) return;

    try {
      // Fetch emotion detection data
      const { data: emotionLogs, error: emotionError } = await supabase
        .from('emotion_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false });

      if (emotionError) throw emotionError;

      // Fetch journal entries
      const { data: journalEntries, error: journalError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (journalError) throw journalError;

      // Process emotion logs
      if (emotionLogs && emotionLogs.length > 0) {
        setHasData(true);
        setTotalEmotionLogs(emotionLogs.length);
        
        const avgConf = emotionLogs.reduce((sum, log) => sum + (log.confidence || 0), 0) / emotionLogs.length;
        setAverageConfidence(Math.round(avgConf * 100));

        // Process emotion distribution
        const emotionCounts = emotionLogs.reduce((acc: any, log: any) => {
          const emotion = log.emotion;
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(emotionCounts).map(([emotion, count]) => ({
          emotion,
          count,
          color: getEmotionColor(emotion)
        }));

        setEmotionData(chartData);

        // Generate mood distribution for pie chart
        const moodPieData = Object.entries(emotionCounts).map(([emotion, count]) => ({
          name: emotion,
          value: count as number,
          color: getEmotionColor(emotion)
        }));
        setMoodDistribution(moodPieData);

        // Generate weekly trend data
        const weeklyTrend = generateWeeklyTrend(emotionLogs);
        setWeeklyData(weeklyTrend);
      }

      // Set journal count
      setJournalCount(journalEntries?.length || 0);

      // Generate activity overview
      const activityOverview = generateActivityData(emotionLogs, journalEntries);
      setActivityData(activityOverview);

      // Check if we have any data
      const totalData = (emotionLogs?.length || 0) + (journalEntries?.length || 0);
      setHasData(totalData > 0);

    } catch (error) {
      console.error('Error fetching data:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: '#10b981',
      sad: '#60a5fa',
      calm: '#14b8a6',
      anxious: '#a78bfa',
      angry: '#f87171',
      surprised: '#fde047',
      neutral: '#6b7280',
      fearful: '#f97316',
      disgusted: '#ef4444'
    };
    return colors[emotion] || '#6b7280';
  };

  const generateWeeklyTrend = (emotionLogs: any[]) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map((date, index) => {
      const dayData = emotionLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      });

      const avgConfidence = dayData.length > 0 
        ? dayData.reduce((sum, log) => sum + (log.confidence || 0), 0) / dayData.length 
        : 0;

      return {
        day: days[index],
        mood_score: Math.round(avgConfidence * 100),
        entries: dayData.length,
        confidence: Math.round(avgConfidence * 100)
      };
    });
  };

  const generateActivityData = (emotionLogs: any[], journalEntries: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    return last30Days.map(date => {
      const dayEmotions = emotionLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      }).length;

      const dayJournals = journalEntries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.toDateString() === date.toDateString();
      }).length;

      return {
        date: date.getDate(),
        emotions: dayEmotions,
        journals: dayJournals,
        total: dayEmotions + dayJournals
      };
    });
  };

  const generateInsights = async () => {
    if (!user || !hasData) return;

    setIsGeneratingInsights(true);
    
    const prompt = `Based on this comprehensive wellness data for a student, provide supportive insights and recommendations:

EMOTION DETECTION DATA:
${emotionData.map(e => `${e.emotion}: ${e.count} detections`).join('\n')}
Total emotion logs: ${totalEmotionLogs}
Average confidence: ${averageConfidence}%

WEEKLY EMOTIONAL TREND:
${weeklyData.map(d => `${d.day}: Mood Score ${d.mood_score}/100, ${d.entries} detections`).join('\n')}

JOURNALING ACTIVITY:
Total journal entries: ${journalCount}

ACTIVITY OVERVIEW:
${activityData.slice(-7).map(d => `Day ${d.date}: ${d.emotions} emotions, ${d.journals} journals, ${d.total} total activities`).join('\n')}

Please provide:
1. Overall wellness trend analysis
2. Emotional pattern recognition
3. Balance between different wellness activities
4. Personalized recommendations for improvement
5. Positive reinforcement for consistent tracking
6. Suggestions for areas that need more attention

Keep it supportive, actionable, and focused on holistic student wellness.`;

    const response = await callGroqAPI(prompt);
    setInsights(response);
    setIsGeneratingInsights(false);
  };

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  useEffect(() => {
    if (hasData && !insights) {
      generateInsights();
    }
  }, [hasData]);

  const dominantEmotion = emotionData.length > 0 ? emotionData.reduce((a, b) => a.count > b.count ? a : b) : null;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-aurora-electric-blue mr-3" />
          <span className="text-xl text-white">Loading your comprehensive analytics...</span>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="liquid-glass-strong">
          <CardHeader>
            <CardTitle className="aurora-text-glow flex items-center">
              <TrendingUp className="mr-2 h-6 w-6" />
              Your Wellness Journey Analytics
            </CardTitle>
            <CardDescription className="text-gray-300">
              Comprehensive insights from all your wellness activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
              <p className="text-gray-400 mb-6">
                Start using emotion detection, journaling, AI venting, or mood garden to see your analytics.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-aurora-electric-blue" />
                  <p className="text-sm text-gray-500">Emotion Detection</p>
                </div>
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-aurora-green" />
                  <p className="text-sm text-gray-500">Journal</p>
                </div>
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-aurora-purple" />
                  <p className="text-sm text-gray-500">AI Vent</p>
                </div>
                <div className="text-center">
                  <Flower2 className="h-8 w-8 mx-auto mb-2 text-aurora-cyan" />
                  <p className="text-sm text-gray-500">Mood Garden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="liquid-glass-strong">
        <CardHeader>
          <CardTitle className="aurora-text-glow flex items-center">
            <TrendingUp className="mr-2 h-6 w-6" />
            Your Wellness Journey Analytics
          </CardTitle>
          <CardDescription className="text-gray-300">
            Comprehensive insights from emotion detection, journaling, AI venting, and mood tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="liquid-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-aurora-electric-blue flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Emotion Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{totalEmotionLogs}</div>
                <p className="text-xs text-gray-400">AI detections</p>
              </CardContent>
            </Card>
            
            <Card className="liquid-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-aurora-green flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Journal Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{journalCount}</div>
                <p className="text-xs text-gray-400">Written reflections</p>
              </CardContent>
            </Card>
            
            <Card className="liquid-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-aurora-purple">Primary Emotion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white capitalize">{dominantEmotion?.emotion || 'N/A'}</div>
                <p className="text-xs text-gray-400">{dominantEmotion?.count || 0} detections</p>
              </CardContent>
            </Card>
            
            <Card className="liquid-glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-aurora-cyan">Avg Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{averageConfidence}%</div>
                <p className="text-xs text-gray-400">Detection accuracy</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Emotion Distribution Bar Chart */}
            <Card className="liquid-glass">
              <CardHeader>
                <CardTitle className="text-aurora-electric-blue flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Emotion Distribution
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Overview of your detected emotional states
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={emotionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="emotion" 
                      stroke="#9ca3af" 
                      tick={{ fill: '#d1d5db', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)'
                      }}
                      labelStyle={{ color: '#f3f4f6' }}
                      itemStyle={{ color: '#2dd4bf' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#2dd4bf" 
                      radius={[4, 4, 0, 0]}
                      stroke="rgba(45, 212, 191, 0.3)"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Trend Line Chart */}
            <Card className="liquid-glass">
              <CardHeader>
                <CardTitle className="text-aurora-purple flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Weekly Confidence Trend
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your emotional confidence levels over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#9ca3af"
                      tick={{ fill: '#d1d5db', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      tick={{ fill: '#d1d5db', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        backdropFilter: 'blur(12px)'
                      }}
                      labelStyle={{ color: '#f3f4f6' }}
                      itemStyle={{ color: '#8b5cf6' }}
                      formatter={(value: any) => [`${value}%`, 'Confidence']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood_score" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Activity Overview */}
          <Card className="liquid-glass mb-8">
            <CardHeader>
              <CardTitle className="text-aurora-green flex items-center">
                <Target className="mr-2 h-5 w-5" />
                30-Day Activity Overview
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your wellness activities over the past month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    tick={{ fill: '#d1d5db', fontSize: 10 }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                      border: '1px solid #374151',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Bar dataKey="emotions" stackId="a" fill="#2dd4bf" name="Emotions" />
                  <Bar dataKey="journals" stackId="a" fill="#10b981" name="Journals" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {hasData && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-aurora-green flex items-center">
              <Brain className="mr-2 h-6 w-6" />
              Aurora's Comprehensive Insights
            </CardTitle>
            <CardDescription className="text-gray-300">
              AI-powered analysis of your complete wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGeneratingInsights ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-aurora-electric-blue mr-2" />
                <span>Analyzing your comprehensive wellness data...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {insights}
                  </p>
                </div>
                <Button
                  onClick={generateInsights}
                  variant="outline"
                  className="glass-effect text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Insights
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
