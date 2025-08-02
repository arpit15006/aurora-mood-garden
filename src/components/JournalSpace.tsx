import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PenTool, Sparkles, Send, Save, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/components/ui/use-toast';
import JournalHistory from './JournalHistory';

interface JournalSpaceProps {
  currentMood: string;
}

const JournalSpace = ({ currentMood }: JournalSpaceProps) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiInsights, setAiInsights] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

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
              content: 'You are Aurora, an empathetic AI wellness companion for students. Provide supportive, non-judgmental responses focused on emotional wellness and personal growth.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
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
      return 'I apologize, but I\'m having trouble connecting right now. Please try again later.';
    }
  };

  const saveJournalEntry = async () => {
    if (!user?.id || !journalEntry.trim()) {
      toast({
        title: "Error",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // First ensure user profile exists
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          email: user.emailAddresses?.[0]?.emailAddress || user.id
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      const entryData = {
        user_id: user.id,
        title: journalTitle || `Journal Entry - ${new Date().toLocaleDateString()}`,
        content: journalEntry,
        mood: currentMood || null,
        ai_response: aiResponse || null,
        ai_insights: aiInsights || null,
        ai_suggestions: aiSuggestions || null
      };
      
      const { error } = await supabase
        .from('journal_entries')
        .insert(entryData);

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Database Error",
          description: error.message || "Failed to save journal entry.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Journal saved!",
        description: "Your journal entry has been saved successfully.",
      });

      setJournalEntry('');
      setJournalTitle('');
      setAiResponse('');
      setAiInsights('');
      setAiSuggestions('');
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateMoodPrompt = async () => {
    if (!currentMood) return;
    
    setIsGeneratingPrompt(true);
    
    const prompt = `Generate a thoughtful, supportive journaling prompt for a student who is currently feeling ${currentMood}. The prompt should be:
    1. Empathetic and understanding
    2. Encouraging self-reflection
    3. Focused on emotional wellness
    4. Age-appropriate for college students
    5. No more than 2-3 sentences
    
    Current mood: ${currentMood}`;

    const response = await callGroqAPI(prompt);
    setAiPrompt(response);
    setIsGeneratingPrompt(false);
  };

  const analyzeJournalEntry = async () => {
    if (!journalEntry.trim()) return;
    
    setIsAnalyzing(true);
    
    const responsePrompt = `As Aurora, an empathetic AI wellness companion, please provide a supportive response to this journal entry from a student. Focus on:
    1. Validating their feelings
    2. Offering gentle insights
    3. Suggesting healthy coping strategies if appropriate
    4. Encouraging continued self-reflection
    5. Being warm and non-judgmental
    
    Student's journal entry: "${journalEntry}"
    Current mood context: ${currentMood || 'not specified'}`;

    const insightsPrompt = `Analyze this journal entry and provide brief, supportive insights about the student's emotional patterns, growth areas, and positive aspects. Keep it encouraging and constructive.
    
    Journal entry: "${journalEntry}"
    Current mood: ${currentMood || 'not specified'}`;

    const suggestionsPrompt = `Based on this journal entry, provide 3-4 practical, actionable suggestions for the student's emotional wellness and personal growth. Make them specific and achievable.
    
    Journal entry: "${journalEntry}"
    Current mood: ${currentMood || 'not specified'}`;

    try {
      const [response, insights, suggestions] = await Promise.all([
        callGroqAPI(responsePrompt),
        callGroqAPI(insightsPrompt),
        callGroqAPI(suggestionsPrompt)
      ]);

      setAiResponse(response);
      setAiInsights(insights);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error analyzing journal entry:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (currentMood) {
      generateMoodPrompt();
    }
  }, [currentMood]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-700">
          <TabsTrigger value="write" className="flex items-center text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            <PenTool className="mr-2 h-4 w-4" />
            Write Journal
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            <History className="mr-2 h-4 w-4" />
            Journal History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="write">
          <Card className="bg-gray-900/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center text-2xl font-bold">
                <PenTool className="mr-2 h-6 w-6 text-blue-400" />
                Smart Journaling
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Express your thoughts and feelings in a safe space with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* AI-Generated Prompt */}
                {currentMood && (
                  <Card className="bg-gray-800/40 backdrop-blur-lg border border-gray-600/50">
                    <CardHeader>
                      <CardTitle className="text-cyan-400 text-lg font-semibold">
                        Personalized Prompt
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Based on your current mood: <span className="capitalize text-cyan-300 font-medium">{currentMood}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isGeneratingPrompt ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-cyan-400 mr-2" />
                          <span className="text-gray-300">Generating personalized prompt...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-gray-200 leading-relaxed text-lg">{aiPrompt}</p>
                          <Button
                            onClick={generateMoodPrompt}
                            variant="outline"
                            size="sm"
                            className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate New Prompt
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Journal Entry Area */}
                <Card className="bg-gray-800/40 backdrop-blur-lg border border-gray-600/50">
                  <CardHeader>
                    <CardTitle className="text-purple-400 font-semibold">Your Journal Entry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        placeholder="Give your journal entry a title (optional)"
                        value={journalTitle}
                        onChange={(e) => setJournalTitle(e.target.value)}
                        className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      />
                      
                      <Textarea
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        placeholder="Start writing here... Let your thoughts flow freely."
                        className="min-h-[200px] bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 resize-none focus:border-purple-400 focus:ring-purple-400"
                      />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          {journalEntry.length} characters
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={analyzeJournalEntry}
                            disabled={!journalEntry.trim() || isAnalyzing}
                            variant="outline"
                            className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500"
                          >
                            {isAnalyzing ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Send className="h-4 w-4 mr-2" />
                            )}
                            {isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}
                          </Button>
                          
                          <Button
                            onClick={saveJournalEntry}
                            disabled={!journalEntry.trim() || isSaving}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          >
                            {isSaving ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Save className="h-4 w-4 mr-2" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Entry'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Analysis Results */}
                {(aiResponse || aiInsights || aiSuggestions) && (
                  <div className="grid gap-6">
                    {aiResponse && (
                      <Card className="bg-gray-800/40 backdrop-blur-lg border border-gray-600/50">
                        <CardHeader>
                          <CardTitle className="text-green-400 font-semibold">Aurora's Response</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {aiResponse}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {aiInsights && (
                      <Card className="bg-gray-800/40 backdrop-blur-lg border border-gray-600/50">
                        <CardHeader>
                          <CardTitle className="text-purple-400 font-semibold">AI Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {aiInsights}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {aiSuggestions && (
                      <Card className="bg-gray-800/40 backdrop-blur-lg border border-gray-600/50">
                        <CardHeader>
                          <CardTitle className="text-cyan-400 font-semibold">AI Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {aiSuggestions}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
                <Card className="bg-gray-800/40 backdrop-blur-lg border border-gray-600/50">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 text-lg font-semibold">Quick Journal Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setJournalEntry('Today I am grateful for...')}
                        className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500 justify-start"
                      >
                        Gratitude Journal
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setJournalEntry('I\'m feeling stressed about...')}
                        className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500 justify-start"
                      >
                        Stress Relief
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setJournalEntry('Today I accomplished...')}
                        className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500 justify-start"
                      >
                        Achievement Log
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <JournalHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalSpace;
