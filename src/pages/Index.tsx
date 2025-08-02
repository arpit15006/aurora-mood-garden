
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, User, Camera, BookOpen, MessageCircle, TrendingUp, Stars, Zap, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import AuroraLogo from '@/components/ui/AuroraLogo';
import HomePage from '@/components/HomePage';
import EmotionDetector from '@/components/EmotionDetector';
import JournalSpace from '@/components/JournalSpace';
import AIVentSpace from '@/components/AIVentSpace';
import Dashboard from '@/components/Dashboard';

const tabs = [
  { id: 'home', label: 'Home', icon: Sparkles },
  { id: 'emotion-detection', label: 'Emotion Detection', icon: Camera },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'vent', label: 'AI Companion', icon: MessageCircle },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
];

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentMood, setCurrentMood] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Handle navigation from mood garden
  useEffect(() => {
    if (location.state?.activeTab) {
      setCurrentSection(location.state.activeTab);
    }
  }, [location.state]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleOnboardingNavigation = () => {
    navigate('/onboarding');
  };

  // Redirect to auth if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb" />
      <div className="floating-orb" />
      <div className="floating-orb" />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              
              {/* Main logo container */}
              <div className="relative liquid-glass-strong rounded-full p-4 group-hover:scale-105 transition-transform duration-300">
                {/* Inner decorative elements */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/15 via-purple-500/15 to-pink-500/15">
                  <AuroraLogo className="w-full h-full" size={60} />
                </div>
                
                {/* Logo content */}
                <div className="relative flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-transparent" style={{ 
                    background: 'linear-gradient(135deg, hsl(177, 90%, 70%), hsl(262, 85%, 80%), hsl(330, 90%, 75%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }} />
                  
                  {/* Floating mini sparkles */}
                  <Stars className="h-3 w-3 text-cyan-400 absolute -top-1 -right-1 animate-pulse opacity-80" />
                  <Zap className="h-2 w-2 text-purple-400 absolute -bottom-1 -left-1 animate-pulse opacity-70" />
                  <Sparkles className="h-2 w-2 text-pink-400 absolute top-0 left-4 animate-pulse opacity-60" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text">Aurora</h1>
              <p className="text-sm text-gray-300">AI Wellness Companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* User Name */}
            <div className="liquid-glass px-4 py-2 rounded-3xl backdrop-blur-xl border border-white/10">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-cyan-400" />
                <span className="text-white font-medium">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
            </div>
            
            {/* Onboarding Button */}
            <Button
              onClick={handleOnboardingNavigation}
              variant="outline"
              className="liquid-glass text-white hover:bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Guide
            </Button>
            
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="liquid-glass text-white hover:bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <Card className="liquid-glass-strong mb-8 rounded-3xl border-2 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentSection === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setCurrentSection(tab.id)}
                    variant={isActive ? "default" : "ghost"}
                    className={`
                      flex items-center space-x-3 px-8 py-4 rounded-3xl transition-all duration-500 border-2 flex-1 mx-1
                      ${isActive 
                        ? 'bg-gradient-to-r from-cyan-500/40 to-purple-600/40 text-white border-cyan-400/50 shadow-2xl backdrop-blur-xl liquid-glass-strong scale-105' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20 hover:scale-105 liquid-glass backdrop-blur-xl'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-200' : ''}`} />
                    <span className="font-semibold text-base whitespace-nowrap">{tab.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-8">
          {currentSection === 'home' && <HomePage onNavigate={setCurrentSection} currentSection={currentSection} />}
          {currentSection === 'emotion-detection' && <EmotionDetector />}
          {currentSection === 'journal' && <JournalSpace currentMood={currentMood} />}
          {currentSection === 'vent' && <AIVentSpace />}
          {currentSection === 'analytics' && <Dashboard />}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-white/10 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-gray-400 text-sm">Built by Team Vortexium</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
