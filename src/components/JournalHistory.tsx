
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Calendar, Brain, Lightbulb, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  ai_response?: string;
  ai_insights?: string;
  ai_suggestions?: string;
  created_at: string;
}

const JournalHistory = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const { user } = useUser();

  const moods = ['happy', 'sad', 'calm', 'anxious', 'angry', 'surprised', 'neutral', 'excited', 'stressed'];

  useEffect(() => {
    if (user) {
      fetchJournalEntries();
    }
  }, [user]);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, selectedMood]);

  const fetchJournalEntries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMood) {
      filtered = filtered.filter(entry => entry.mood === selectedMood);
    }

    setFilteredEntries(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gray-900/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center text-2xl font-bold">
            <BookOpen className="mr-2 h-6 w-6 text-blue-400" />
            Journal History
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Explore your wellness journey through your saved journal entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search journal entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="bg-gray-900/50 border border-gray-600 text-white rounded-md px-3 py-2 focus:border-purple-400 focus:ring-purple-400"
              >
                <option value="">All Moods</option>
                {moods.map(mood => (
                  <option key={mood} value={mood} className="capitalize">
                    {mood}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Entries List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your journal entries...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">
                {entries.length === 0 ? 'No journal entries yet.' : 'No entries match your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="bg-gray-800/40 backdrop-blur-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-blue-400 text-lg font-semibold">
                          {entry.title}
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(entry.created_at)}
                          </div>
                          {entry.mood && (
                            <div className="flex items-center text-sm text-cyan-400">
                              <span className="capitalize">Mood: {entry.mood}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                        variant="outline"
                        size="sm"
                        className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500"
                      >
                        {expandedEntry === entry.id ? 'Collapse' : 'Expand'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-200 leading-relaxed">
                          {expandedEntry === entry.id ? entry.content : truncateText(entry.content, 200)}
                        </p>
                      </div>

                      {expandedEntry === entry.id && (
                        <div className="space-y-4 mt-6">
                          {entry.ai_response && (
                            <Card className="bg-gray-700/40 backdrop-blur-lg border border-gray-600/50">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-green-400 text-lg flex items-center font-semibold">
                                  <Brain className="mr-2 h-5 w-5" />
                                  Aurora's Response
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                  {entry.ai_response}
                                </p>
                              </CardContent>
                            </Card>
                          )}

                          {entry.ai_insights && (
                            <Card className="bg-gray-700/40 backdrop-blur-lg border border-gray-600/50">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-purple-400 text-lg flex items-center font-semibold">
                                  <Brain className="mr-2 h-5 w-5" />
                                  AI Insights
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                  {entry.ai_insights}
                                </p>
                              </CardContent>
                            </Card>
                          )}

                          {entry.ai_suggestions && (
                            <Card className="bg-gray-700/40 backdrop-blur-lg border border-gray-600/50">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-cyan-400 text-lg flex items-center font-semibold">
                                  <Lightbulb className="mr-2 h-5 w-5" />
                                  AI Suggestions
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                  {entry.ai_suggestions}
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalHistory;
