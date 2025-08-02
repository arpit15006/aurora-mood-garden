import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Flower, TreePine, Leaf, Home, ArrowLeft, Plus, Trash2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Plant {
  id: string;
  type: string;
  mood: string;
  x: number;
  y: number;
  size: number;
  color: string;
  timestamp: Date;
  growth: number;
}

const MoodGarden = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showStats, setShowStats] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const moodToPlant = {
    happy: { type: 'Sunflower', color: '#fbbf24', icon: '🌻', bgColor: 'from-yellow-400 to-orange-500' },
    sad: { type: 'Blue Lily', color: '#60a5fa', icon: '🌸', bgColor: 'from-blue-400 to-indigo-500' },
    calm: { type: 'Cherry Blossom', color: '#f9a8d4', icon: '🌸', bgColor: 'from-pink-400 to-rose-500' },
    anxious: { type: 'Lavender', color: '#a78bfa', icon: '🌿', bgColor: 'from-purple-400 to-violet-500' },
    angry: { type: 'Red Rose', color: '#f87171', icon: '🌹', bgColor: 'from-red-400 to-red-600' },
    surprised: { type: 'Daisy', color: '#fde047', icon: '🌼', bgColor: 'from-yellow-300 to-amber-400' },
    neutral: { type: 'Grass', color: '#4ade80', icon: '🌱', bgColor: 'from-green-400 to-emerald-500' },
    excited: { type: 'Tulip', color: '#fb7185', icon: '🌷', bgColor: 'from-pink-400 to-pink-600' }
  };

  useEffect(() => {
    const savedPlants = localStorage.getItem('moodGarden');
    if (savedPlants) {
      const parsedPlants = JSON.parse(savedPlants);
      setPlants(parsedPlants.map((plant: any) => ({
        ...plant,
        timestamp: new Date(plant.timestamp),
        growth: plant.growth || Math.random() * 0.5 + 0.5
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodGarden', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    drawGarden();
  }, [plants, selectedPlant]);

  const addPlant = (mood: string) => {
    const plantData = moodToPlant[mood as keyof typeof moodToPlant] || moodToPlant.neutral;
    
    const newPlant: Plant = {
      id: Date.now().toString(),
      type: plantData.type,
      mood,
      x: Math.random() * 400 + 50,
      y: Math.random() * 250 + 50,
      size: Math.random() * 15 + 15,
      color: plantData.color,
      timestamp: new Date(),
      growth: Math.random() * 0.5 + 0.5
    };

    setPlants(prev => [...prev, newPlant]);
    setSelectedMood('');
  };

  const deletePlant = (plantId: string) => {
    setPlants(prev => prev.filter(plant => plant.id !== plantId));
    setSelectedPlant(null);
  };

  const clearGarden = () => {
    setPlants([]);
    setSelectedPlant(null);
  };

  const navigateToAnalytics = () => {
    // Navigate to the main app with analytics tab
    navigate('/', { state: { activeTab: 'analytics' } });
  };

  const drawGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enhanced gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add ground gradient
    const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.8, 0, canvas.height);
    groundGradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
    groundGradient.addColorStop(1, 'rgba(34, 197, 94, 0.2)');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);

    // Draw plants with enhanced effects
    plants.forEach(plant => {
      ctx.save();
      ctx.translate(plant.x, plant.y);

      // Plant selection highlight
      if (selectedPlant && selectedPlant.id === plant.id) {
        ctx.shadowColor = plant.color;
        ctx.shadowBlur = 30;
        ctx.strokeStyle = plant.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, plant.size + 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Plant glow effect
      ctx.shadowColor = plant.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = plant.color;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, plant.size * plant.growth, 0, Math.PI * 2);
      ctx.fill();

      // Plant stem with gradient
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 8;
      const stemGradient = ctx.createLinearGradient(0, plant.size / 2, 0, plant.size + 20);
      stemGradient.addColorStop(0, '#22c55e');
      stemGradient.addColorStop(1, '#15803d');
      ctx.strokeStyle = stemGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, plant.size / 2);
      ctx.lineTo(0, plant.size + 20);
      ctx.stroke();

      // Plant leaves
      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.ellipse(-8, plant.size / 2 + 5, 6, 3, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(8, plant.size / 2 + 8, 6, 3, 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Add floating particles
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2 + 1;
      const alpha = Math.random() * 0.6 + 0.2;
      
      ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`;
      ctx.shadowColor = 'rgba(45, 212, 191, 0.5)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedPlant = plants.find(plant => {
      const distance = Math.sqrt((x - plant.x) ** 2 + (y - plant.y) ** 2);
      return distance <= plant.size + 10;
    });

    setSelectedPlant(clickedPlant || null);
  };

  const getMoodStats = () => {
    const moodCounts = plants.reduce((acc, plant) => {
      acc[plant.mood] = (acc[plant.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedMoods = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return { moodCounts, topMoods: sortedMoods };
  };

  const { moodCounts, topMoods } = getMoodStats();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb" />
      <div className="floating-orb" />
      <div className="floating-orb" />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="liquid-glass text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold aurora-text-glow">Mood Garden</h1>
                <p className="text-gray-300">Cultivate your emotional landscape</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="liquid-glass text-white">
            {plants.length} Plants Growing
          </Badge>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Garden Canvas */}
          <div className="lg:col-span-3">
            <Card className="liquid-glass-strong">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="aurora-text-dark flex items-center">
                      <TreePine className="mr-2 h-6 w-6" />
                      Your Emotional Garden
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-2">
                      Click on plants to view details. Each plant represents an emotional moment.
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowStats(!showStats)}
                    variant="outline"
                    size="sm"
                    className="liquid-glass text-white hover:bg-white/10"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    {showStats ? 'Hide' : 'Show'} Stats
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    onClick={handleCanvasClick}
                    className="w-full h-auto border border-gray-700/50 rounded-lg cursor-pointer bg-gradient-to-br from-slate-900 to-slate-800"
                  />
                  {plants.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Flower className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Your garden awaits</h3>
                        <p className="text-gray-400">Plant your first emotion to begin growing your mood garden</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Add Plants */}
            <Card className="liquid-glass-strong">
              <CardHeader>
                <CardTitle className="text-aurora-electric-blue flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Plant Emotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {Object.entries(moodToPlant).map(([mood, plant]) => (
                    <Button
                      key={mood}
                      variant="outline"
                      size="sm"
                      onClick={() => addPlant(mood)}
                      className={`liquid-glass text-white hover:bg-white/10 justify-start transition-all duration-300 ${
                        selectedMood === mood ? 'bg-white/20' : ''
                      }`}
                    >
                      <span className="mr-3 text-lg">{plant.icon}</span>
                      <div className="text-left">
                        <div className="font-medium capitalize">{mood}</div>
                        <div className="text-xs text-gray-400">{plant.type}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Garden Statistics */}
            {showStats && (
              <Card className="liquid-glass-strong">
                <CardHeader>
                  <CardTitle className="text-aurora-purple">Garden Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Plants:</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {plants.length}
                      </Badge>
                    </div>
                    
                    {topMoods.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-aurora-green">Top Emotions</h4>
                        {topMoods.map(([mood, count], index) => {
                          const plant = moodToPlant[mood as keyof typeof moodToPlant];
                          return (
                            <div key={mood} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">{plant?.icon}</span>
                                <span className="text-sm capitalize text-gray-300">{mood}</span>
                              </div>
                              <Badge variant="outline" className="bg-gradient-to-r from-gray-500/20 to-gray-600/20">
                                {count}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Garden Age:</span>
                      <span className="text-aurora-cyan text-sm">
                        {plants.length > 0 
                          ? `${Math.max(1, Math.floor((Date.now() - Math.min(...plants.map(p => p.timestamp.getTime()))) / (1000 * 60 * 60 * 24)))} days`
                          : 'New garden'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Plant Details */}
            {selectedPlant && (
              <Card className="liquid-glass-strong border-2 border-aurora-electric-blue/30">
                <CardHeader>
                  <CardTitle className="text-aurora-cyan flex items-center">
                    <Leaf className="mr-2 h-5 w-5" />
                    Plant Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {moodToPlant[selectedPlant.mood as keyof typeof moodToPlant]?.icon}
                      </span>
                      <div>
                        <div className="font-semibold text-white">{selectedPlant.type}</div>
                        <div className="text-sm text-gray-400 capitalize">{selectedPlant.mood} mood</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Planted:</span>
                        <span className="text-white">{selectedPlant.timestamp.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Growth:</span>
                        <span className="text-aurora-green">{Math.round(selectedPlant.growth * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Size:</span>
                        <span className="text-white">{Math.round(selectedPlant.size)}px</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => deletePlant(selectedPlant.id)}
                      variant="outline"
                      size="sm"
                      className="w-full liquid-glass text-red-300 hover:bg-red-500/20 border-red-500/30"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Plant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Garden Actions */}
            <Card className="liquid-glass-strong">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button
                    onClick={clearGarden}
                    variant="outline"
                    className="w-full liquid-glass text-white hover:bg-white/10"
                    disabled={plants.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Garden
                  </Button>
                  <Button
                    onClick={navigateToAnalytics}
                    variant="outline" 
                    className="w-full liquid-glass text-white hover:bg-white/10"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodGarden;
