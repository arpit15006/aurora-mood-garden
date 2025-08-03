import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BookOpen, MessageCircle, Camera, Heart, ArrowRight, TreePine, TrendingUp, Gamepad2 } from 'lucide-react';

interface NavigationProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Navigation = ({ onNavigate, currentSection }: NavigationProps) => {
  const navigationItems = [
    {
      id: 'home',
      title: 'Home Dashboard',
      description: 'Your wellness command center',
      icon: Sparkles,
      gradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-500/10',
      action: () => onNavigate('home')
    },
    {
      id: 'mood-garden',
      title: 'Mood Garden',
      description: 'Cultivate your emotional landscape',
      icon: TreePine,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      action: () => onNavigate('mood-garden')
    },
    {
      id: 'emotion-detection',
      title: 'Emotion Detection',
      description: 'Real-time emotional analysis',
      icon: Camera,
      gradient: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-500/10',
      action: () => onNavigate('emotion-detection')
    },
    {
      id: 'journal',
      title: 'Smart Journal',
      description: 'AI-powered reflection space',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      action: () => onNavigate('journal')
    },
    {
      id: 'vent',
      title: 'AI Companion',
      description: 'Safe space for thoughts and feelings',
      icon: MessageCircle,
      gradient: 'from-cyan-500 to-teal-600',
      bgColor: 'bg-cyan-500/10',
      action: () => onNavigate('vent')
    },
    {
      id: 'analytics',
      title: 'Wellness Analytics',
      description: 'Track your mental health journey',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      action: () => onNavigate('analytics')
    },
    {
      id: 'games',
      title: 'Therapeutic Games',
      description: 'Relieve stress through mindful gaming',
      icon: Gamepad2,
      gradient: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-500/10',
      action: () => onNavigate('games')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id;
        
        return (
          <Card 
            key={item.id}
            className={`
              relative overflow-hidden cursor-pointer transition-all duration-500 liquid-button group rounded-3xl backdrop-blur-xl
              ${isActive 
                ? 'liquid-glass-strong scale-105 shadow-2xl border-2 border-cyan-400/30' 
                : 'liquid-glass-card hover:scale-105 hover:border-cyan-400/20 border-2 border-white/10'
              }
            `}
            onClick={item.action}
          >
            <div className={`absolute inset-0 ${item.bgColor} opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-3xl`} />
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            
            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-3xl bg-gradient-to-r ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold aurora-text-dark group-hover:aurora-text-glow transition-all duration-300">
                      {item.title}
                    </CardTitle>
                  </div>
                </div>
                <ArrowRight className={`h-6 w-6 transition-all duration-300 ${
                  isActive 
                    ? 'rotate-90 text-cyan-400' 
                    : 'text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1'
                }`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <CardDescription className="text-gray-200 font-medium group-hover:text-gray-100 transition-colors duration-300">
                {item.description}
              </CardDescription>
              
              {isActive && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-xs text-cyan-300 font-medium">Currently Active</span>
                </div>
              )}
            </CardContent>
            
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl`} />
          </Card>
        );
      })}
    </div>
  );
};

export default Navigation;