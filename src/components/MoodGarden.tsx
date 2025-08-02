
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Flower, TreePine, Leaf } from 'lucide-react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    // Load saved plants from localStorage
    const savedPlants = localStorage.getItem('moodGarden');
    if (savedPlants) {
      setPlants(JSON.parse(savedPlants));
    }
  }, []);

  useEffect(() => {
    // Save plants to localStorage whenever plants change
    localStorage.setItem('moodGarden', JSON.stringify(plants));
  }, [plants]);

  const addPlant = (mood: string) => {
    const plantData = moodToPlant[mood as keyof typeof moodToPlant] || moodToPlant.neutral;
    
    const newPlant: Plant = {
      id: Date.now().toString(),
      type: plantData.type,
      mood,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      size: Math.random() * 20 + 20,
      color: plantData.color,
      timestamp: new Date()
    };

    setPlants(prev => [...prev, newPlant]);
  };

  const clearGarden = () => {
    setPlants([]);
    setSelectedPlant(null);
  };

  const drawGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a2332');
    gradient.addColorStop(1, '#0a0f1c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw plants
    plants.forEach(plant => {
      ctx.save();
      ctx.translate(plant.x, plant.y);

      // Draw plant glow effect
      ctx.shadowColor = plant.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = plant.color;
      ctx.beginPath();
      ctx.arc(0, 0, plant.size, 0, Math.PI * 2);
      ctx.fill();

      // Draw plant stem
      ctx.shadowBlur = 5;
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, plant.size / 2);
      ctx.lineTo(0, plant.size + 10);
      ctx.stroke();

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
                  width={500}
                  height={300}
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

            {/* Controls */}
            <div className="space-y-4">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-aurora-electric-blue text-lg">Add Plants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(moodToPlant).map(([mood, plant]) => (
                      <Button
                        key={mood}
                        variant="outline"
                        size="sm"
                        onClick={() => addPlant(mood)}
                        className="glass-effect text-white hover:bg-white/20 justify-start"
                      >
                        <span className="mr-2">{plant.icon}</span>
                        {plant.type}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-aurora-purple text-lg">Garden Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Plants:</span>
                      <span className="text-aurora-electric-blue">{plants.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Most Common:</span>
                      <span className="text-aurora-green">
                        {plants.length > 0 
                          ? plants.reduce((a, b) => 
                              plants.filter(p => p.mood === a.mood).length > 
                              plants.filter(p => p.mood === b.mood).length ? a : b
                            ).mood 
                          : 'None'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedPlant && (
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-aurora-cyan text-lg">Plant Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="capitalize">{selectedPlant.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mood:</span>
                        <span className="capitalize">{selectedPlant.mood}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Planted:</span>
                        <span>{selectedPlant.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={clearGarden}
                variant="outline"
                size="sm"
                className="w-full glass-effect text-white hover:bg-white/20"
              >
                Clear Garden
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodGarden;
