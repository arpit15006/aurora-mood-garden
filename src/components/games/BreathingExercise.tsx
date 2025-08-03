import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

interface BreathingExerciseProps {
  onGameEnd: (score: number, timePlayed: number, completed: boolean) => void;
}

const BreathingExercise = ({ onGameEnd }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(300); // 5 minutes default
  const intervalRef = useRef<NodeJS.Timeout>();
  const phaseIntervalRef = useRef<NodeJS.Timeout>();

  const breathingPattern = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    pause: 2
  };

  const phaseMessages = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    pause: 'Pause'
  };

  const startExercise = (duration: number) => {
    setTotalDuration(duration);
    setTimeRemaining(duration);
    setStartTime(Date.now());
    setIsActive(true);
    setCycleCount(0);
    setPhase('inhale');
    startBreathingCycle();
    
    // Main timer
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stopExercise(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startBreathingCycle = () => {
    const phases: (keyof typeof breathingPattern)[] = ['inhale', 'hold', 'exhale', 'pause'];
    let phaseIndex = 0;
    
    const nextPhase = () => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      const currentPhase = phases[phaseIndex];
      
      if (currentPhase === 'inhale') {
        setCycleCount(prev => prev + 1);
      }
      
      setPhase(currentPhase);
      
      if (isActive) {
        phaseIntervalRef.current = setTimeout(nextPhase, breathingPattern[currentPhase] * 1000);
      }
    };
    
    phaseIntervalRef.current = setTimeout(nextPhase, breathingPattern['inhale'] * 1000);
  };

  const stopExercise = (completed: boolean = false) => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (phaseIntervalRef.current) {
      clearTimeout(phaseIntervalRef.current);
      phaseIntervalRef.current = undefined;
    }
    
    if (startTime > 0) {
      const timePlayed = Date.now() - startTime;
      onGameEnd(cycleCount * 10, timePlayed, completed);
    }
  };

  const resetExercise = () => {
    stopExercise(false);
    setCycleCount(0);
    setPhase('inhale');
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 'scale-150';
      case 'hold': return 'scale-150';
      case 'exhale': return 'scale-75';
      case 'pause': return 'scale-75';
      default: return 'scale-100';
    }
  };

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale': return 'bg-gradient-to-r from-blue-400 to-cyan-400';
      case 'hold': return 'bg-gradient-to-r from-purple-400 to-blue-400';
      case 'exhale': return 'bg-gradient-to-r from-green-400 to-teal-400';
      case 'pause': return 'bg-gradient-to-r from-gray-400 to-gray-500';
      default: return 'bg-gradient-to-r from-blue-400 to-cyan-400';
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseIntervalRef.current) clearTimeout(phaseIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="liquid-glass-card max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between aurora-text">
            <span>Mindful Breathing</span>
            <div className="flex items-center gap-4 text-sm">
              <span>Cycles: {cycleCount}</span>
              {isActive && <span>Time: {formatTime(timeRemaining)}</span>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            {/* Breathing Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div 
                className={`
                  w-32 h-32 rounded-full transition-all duration-1000 ease-in-out
                  ${getCircleColor()} ${getCircleScale()}
                  shadow-2xl opacity-80
                `}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {phaseMessages[phase]}
                  </div>
                  {isActive && (
                    <div className="text-sm text-gray-200">
                      {breathingPattern[phase]}s
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center space-y-2">
              <p className="text-gray-300">
                Follow the circle: Expand on inhale, contract on exhale
              </p>
              <p className="text-sm text-gray-400">
                4-4-6-2 breathing pattern for stress relief
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4">
              {!isActive && (
                <>
                  <Button 
                    onClick={() => startExercise(180)}
                    className="bg-gradient-to-r from-aurora-green to-aurora-teal"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    3 Minutes
                  </Button>
                  <Button 
                    onClick={() => startExercise(300)}
                    className="bg-gradient-to-r from-aurora-purple to-aurora-pink"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    5 Minutes
                  </Button>
                  <Button 
                    onClick={() => startExercise(600)}
                    className="bg-gradient-to-r from-aurora-electric-blue to-aurora-cyan"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    10 Minutes
                  </Button>
                </>
              )}
              
              {isActive && (
                <Button 
                  onClick={() => stopExercise(false)}
                  variant="outline"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}
              
              <Button onClick={resetExercise} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
              <div className="text-center p-4 liquid-glass rounded-lg">
                <div className="text-2xl mb-2">🧘</div>
                <h4 className="font-semibold text-cyan-400 mb-1">Reduces Stress</h4>
                <p className="text-xs text-gray-400">Activates parasympathetic nervous system</p>
              </div>
              <div className="text-center p-4 liquid-glass rounded-lg">
                <div className="text-2xl mb-2">💚</div>
                <h4 className="font-semibold text-green-400 mb-1">Improves Focus</h4>
                <p className="text-xs text-gray-400">Enhances concentration and clarity</p>
              </div>
              <div className="text-center p-4 liquid-glass rounded-lg">
                <div className="text-2xl mb-2">😌</div>
                <h4 className="font-semibold text-purple-400 mb-1">Calms Mind</h4>
                <p className="text-xs text-gray-400">Reduces anxiety and promotes peace</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingExercise;