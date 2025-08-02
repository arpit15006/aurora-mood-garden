
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Flower, TreePine, Leaf, Save, RotateCcw } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Plant {
  id: string;
  type: string;
  mood: string;
  x: number;
  y: number;
  size: number;
  color: string;
  timestamp: Date;
}

const MoodGarden = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [insights, setInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useUser();
  const { toast } = useToast();

  const groqApiKey = "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";

  const moodToPlant = {
    happy: { type: 'sunflower', color: '#fbbf24', icon: '🌻' },
    sad: { type: 'blue lily', color: '#60a5fa', icon: '🌸' },
    calm: { type: 'cherry blossom', color: '#f9a8d4', icon: '🌸' },
    anxious: { type: 'lavender', color: '#a78bfa', icon: '🌿' },
    angry: { type: 'red rose', color: '#f87171', icon: '🌹' },
    surprised: { type: 'daisy', color: '#fde047', icon: '🌼' },
    neutral: { type: 'grass', color: '#4ade80', icon: '🌱' }
  };

  useEffect(() => {
    if (user) {
      loadGarden();
    }
  }, [user]);

  const loadGarden = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mood_garden_plants')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data) {
        const loadedPlants = data.map(item => ({
          id: item.id,
          type: item.plant_type,
          mood: item.mood,
          x: item.x_position,
          y: item.y_position,
          size: item.size,
          color: item.color,
          timestamp: new Date(item.created_at)
        }));
        setPlants(loadedPlants);
      }
    } catch (error) {
      console.error('Error loading garden:', error);
    }
  };

  const saveGarden = async () => {
    if (!user || plants.length === 0) return;
    
    setIsSaving(true);
    try {
      // Clear existing plants for this user
      await supabase
        .from('mood_garden_plants')
        .delete()
        .eq('user_id', user.id);

      // Insert current plants
      const plantsToSave = plants.map(plant => ({
        id: plant.id,
        user_id: user.id,
        plant_type: plant.type,
        mood: plant.mood,
        x_position: plant.x,
        y_position: plant.y,
        size: plant.size,
        color: plant.color
      }));

      const { error } = await supabase
        .from('mood_garden_plants')
        .insert(plantsToSave);

      if (error) throw error;
      
      toast({
        title: "Garden Saved!",
        description: "Your mood garden has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving garden:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your garden. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addPlant = (mood: string) => {
    const plantData = moodToPlant[mood as keyof typeof moodToPlant] || moodToPlant.neutral;
    
    const newPlant: Plant = {
      id: Date.now().toString(),
      type: plantData.type,
      mood,
      x: Math.random() * 900 + 50,
      y: Math.random() * 500 + 50,
      size: Math.random() * 20 + 20,
      color: plantData.color,
      timestamp: new Date()
    };

    setPlants(prev => [...prev, newPlant]);
  };

  const clearGarden = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('mood_garden_plants')
        .delete()
        .eq('user_id', user.id);
        
      setPlants([]);
      setSelectedPlant(null);
      
      toast({
        title: "Garden Cleared",
        description: "Your mood garden has been cleared.",
      });
    } catch (error) {
      console.error('Error clearing garden:', error);
    }
  };

  const generateInsights = async () => {
    if (plants.length === 0) return;
    
    setIsGeneratingInsights(true);
    
    const moodCounts = plants.reduce((acc: any, plant) => {
      acc[plant.mood] = (acc[plant.mood] || 0) + 1;
      return acc;
    }, {});
    
    const prompt = `Analyze this student's mood garden and provide supportive insights:

Garden Summary:
- Total plants: ${plants.length}
- Mood distribution: ${Object.entries(moodCounts).map(([mood, count]) => `${mood}: ${count}`).join(', ')}
- Most planted mood: ${Object.entries(moodCounts).reduce((a: any, b: any) => a[1] > b[1] ? a : b)[0]}

Provide:
1. Emotional pattern analysis
2. Positive observations about their mood journey
3. Gentle suggestions for emotional wellness
4. Encouragement for continued self-reflection

Keep it supportive, non-judgmental, and focused on growth.`;

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
              content: 'You are Aurora, an empathetic AI wellness companion. Analyze mood gardens with compassion and provide supportive insights for students.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      setInsights(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this time. Your garden is beautiful and reflects your emotional journey!');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const drawGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw enhanced gradient background
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/2);
    gradient.addColorStop(0, '#2dd4bf20');
    gradient.addColorStop(0.3, '#8b5cf620');
    gradient.addColorStop(0.6, '#1a233280');
    gradient.addColorStop(1, '#0a0f1c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw plants with enhanced visuals
    plants.forEach((plant, index) => {
      ctx.save();
      ctx.translate(plant.x, plant.y);

      // Draw plant base shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(0, plant.size + 15, plant.size * 0.8, plant.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw plant glow effect
      ctx.shadowColor = plant.color;
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 0;
      
      // Draw plant petals/leaves
      const petals = 6;
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        const petalX = Math.cos(angle) * plant.size * 0.7;
        const petalY = Math.sin(angle) * plant.size * 0.7;
        
        ctx.fillStyle = plant.color;
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, plant.size * 0.4, plant.size * 0.6, angle, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw plant center
      ctx.fillStyle = plant.color;
      ctx.beginPath();
      ctx.arc(0, 0, plant.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw plant stem with gradient
      const stemGradient = ctx.createLinearGradient(0, plant.size / 2, 0, plant.size + 15);
      stemGradient.addColorStop(0, '#4ade80');
      stemGradient.addColorStop(1, '#22c55e');
      
      ctx.shadowBlur = 8;
      ctx.strokeStyle = stemGradient;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, plant.size / 2);
      ctx.lineTo(0, plant.size + 15);
      ctx.stroke();
      
      // Add small leaves on stem
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(-8, plant.size * 0.8, 6, 3, -Math.PI/4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(8, plant.size * 0.9, 6, 3, Math.PI/4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Draw particles floating around
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2 + 1;
      
      ctx.fillStyle = `rgba(45, 212, 191, ${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(() => {
    drawGarden();
  }, [plants]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a plant
    const clickedPlant = plants.find(plant => {
      const distance = Math.sqrt((x - plant.x) ** 2 + (y - plant.y) ** 2);
      return distance <= plant.size;
    });

    setSelectedPlant(clickedPlant || null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="aurora-text flex items-center">
            <Sparkles className="mr-2 h-6 w-6" />
            Mood Garden
          </CardTitle>
          <CardDescription className="text-gray-300">
            Watch your emotional journey bloom into a beautiful garden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Garden Canvas */}
            <div className="lg:col-span-2">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={1000}
                  height={600}
                  onClick={handleCanvasClick}
                  className="w-full h-auto border border-gray-700 rounded-lg cursor-pointer bg-gradient-to-br from-aurora-deep-blue to-aurora-midnight"
                />
                {plants.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Flower className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">Your garden is empty</p>
                      <p className="text-sm text-gray-500">Add plants by selecting moods below</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="space-y-4">
              <Card className="liquid-glass-strong">
                <CardHeader>
                  <CardTitle className="text-aurora-electric-blue text-lg flex items-center">
                    <Flower className="mr-2 h-5 w-5" />
                    Plant Moods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(moodToPlant).map(([mood, plant]) => (
                      <Button
                        key={mood}
                        variant="outline"
                        size="sm"
                        onClick={() => addPlant(mood)}
                        className="liquid-glass text-white hover:bg-white/20 justify-start transition-all duration-300 hover:scale-105 border-aurora-electric-blue/30"
                      >
                        <span className="mr-3 text-lg">{plant.icon}</span>
                        <div className="text-left">
                          <div className="font-medium capitalize">{mood}</div>
                          <div className="text-xs text-gray-400 capitalize">{plant.type}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-glass-strong">
                <CardHeader>
                  <CardTitle className="text-aurora-purple text-lg flex items-center">
                    <TreePine className="mr-2 h-5 w-5" />
                    Garden Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-aurora-electric-blue/10 rounded-lg">
                      <span className="text-gray-300">Total Plants:</span>
                      <span className="text-aurora-electric-blue font-bold text-lg">{plants.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-aurora-green/10 rounded-lg">
                      <span className="text-gray-300">Most Common:</span>
                      <span className="text-aurora-green font-medium capitalize">
                        {plants.length > 0 
                          ? plants.reduce((a, b) => 
                              plants.filter(p => p.mood === a.mood).length > 
                              plants.filter(p => p.mood === b.mood).length ? a : b
                            ).mood 
                          : 'None'
                        }
                      </span>
                    </div>
                    {plants.length > 0 && (
                      <div className="text-xs text-gray-400 text-center mt-2">
                        🌱 Your garden is growing beautifully!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {selectedPlant && (
                <Card className="liquid-glass-strong border-aurora-cyan/30">
                  <CardHeader>
                    <CardTitle className="text-aurora-cyan text-lg flex items-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Plant Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-aurora-cyan/10 rounded-lg">
                        <span className="text-gray-300">Type:</span>
                        <span className="capitalize text-aurora-cyan font-medium">{selectedPlant.type}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-aurora-purple/10 rounded-lg">
                        <span className="text-gray-300">Mood:</span>
                        <span className="capitalize text-aurora-purple font-medium">{selectedPlant.mood}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-aurora-pink/10 rounded-lg">
                        <span className="text-gray-300">Planted:</span>
                        <span className="text-aurora-pink font-medium">{selectedPlant.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Button
                  onClick={saveGarden}
                  disabled={isSaving || plants.length === 0}
                  className="w-full bg-aurora-green hover:bg-aurora-teal transition-all duration-300"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Save Garden
                    </div>
                  )}
                </Button>
                
                <Button
                  onClick={clearGarden}
                  variant="outline"
                  size="sm"
                  className="w-full liquid-glass text-white hover:bg-red-500/20 border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear Garden
                </Button>
                
                {plants.length > 0 && (
                  <Button
                    onClick={generateInsights}
                    disabled={isGeneratingInsights}
                    className="w-full bg-aurora-purple hover:bg-aurora-pink transition-all duration-300"
                  >
                    {isGeneratingInsights ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get AI Insights
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Insights */}
      {insights && (
        <Card className="liquid-glass-strong">
          <CardHeader>
            <CardTitle className="text-aurora-green flex items-center">
              <Sparkles className="mr-2 h-6 w-6" />
              Aurora's Garden Insights
            </CardTitle>
            <CardDescription className="text-gray-300">
              AI analysis of your emotional garden journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {insights}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodGarden;
