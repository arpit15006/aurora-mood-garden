import { useState, useEffect } from 'react';
// import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser, UserButton, useClerk } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AIVentSpace from './components/AIVentSpace';
import JournalSpace from './components/JournalSpace';
import EmotionDetector from './components/EmotionDetector';
import MoodGarden from './components/MoodGarden';
import GamesHub from './components/GamesHub';
import { Sparkles, Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const AuthPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="text-center space-y-8 max-w-md mx-auto px-6">
      {/* Logo Section */}
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-3xl">🌸</span>
        </div>
      </div>
      
      {/* Welcome Text */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
          Welcome to Aurora
        </h1>
        <p className="text-xl text-gray-300 font-medium">Your AI Wellness Companion</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Discover emotional wellness through AI-powered journaling, mood tracking, 
          real-time emotion detection, and personalized insights designed for students.
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-4 pt-6">
        <SignInButton mode="modal">
          <button className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-2xl">
            Sign In to Continue
          </button>
        </SignInButton>
        
        <SignUpButton mode="modal">
          <button className="w-full px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-2xl hover:bg-purple-500 hover:text-white transition-all duration-300 font-semibold text-lg">
            Create New Account
          </button>
        </SignUpButton>
      </div>
      
      {/* Features Preview */}
      <div className="grid grid-cols-2 gap-4 pt-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
          <div className="text-2xl mb-2">🧠</div>
          <p className="text-xs text-gray-300">AI Emotion Detection</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
          <div className="text-2xl mb-2">📝</div>
          <p className="text-xs text-gray-300">Smart Journaling</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
          <div className="text-2xl mb-2">🌱</div>
          <p className="text-xs text-gray-300">Mood Garden</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
          <div className="text-2xl mb-2">🎮</div>
          <p className="text-xs text-gray-300">Therapeutic Games</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-6 text-center">
        <p className="text-xs text-gray-500">
          Built with ❤️ for student mental wellness
        </p>
      </div>
    </div>
  </div>
);

const AuroraApp = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentMood, setCurrentMood] = useState('neutral');
  // const { user } = useUser();
  const user = { firstName: 'Demo User' }; // Temporary mock user

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Sparkles className="h-12 w-12 text-cyan-400" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName || 'User'}!
                </h1>
              </div>
              <p className="text-xl text-gray-300">Choose a wellness activity to get started</p>
            </div>
            <Navigation onNavigate={handleNavigate} currentSection={currentSection} />
          </div>
        );
      case 'analytics':
        return <Dashboard />;
      case 'vent':
        return <AIVentSpace />;
      case 'journal':
        return <JournalSpace currentMood={currentMood} />;
      case 'emotion-detection':
        return <EmotionDetector />;
      case 'mood-garden':
        return <MoodGarden />;
      case 'games':
        return <GamesHub onBack={() => handleNavigate('home')} />;
      default:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-xl text-gray-300">Choose a wellness activity to get started</p>
            </div>
            <Navigation onNavigate={handleNavigate} currentSection={currentSection} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Aurora
            </h1>
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-white hidden sm:block">Welcome, {user?.firstName || 'User'}!</span>
            {/* <UserButton afterSignOutUrl="/" /> */}
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {(user?.firstName || 'U')[0]}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        {renderCurrentSection()}
      </div>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
      <h2 className="text-2xl font-bold text-white">Loading Aurora...</h2>
      <p className="text-gray-400">Initializing your wellness companion</p>
    </div>
  </div>
);

const AppContent = () => {
  const { loaded } = useClerk();
  const [bypassAuth, setBypassAuth] = useState(false);
  
  // Timeout to bypass Clerk if it takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) {
        console.warn('Clerk taking too long to load, bypassing authentication');
        setBypassAuth(true);
      }
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(timer);
  }, [loaded]);
  
  if (!loaded && !bypassAuth) {
    return <LoadingScreen />;
  }

  // If bypassing auth or Clerk is loaded
  if (bypassAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <AuroraApp />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SignedOut>
        <AuthPage />
      </SignedOut>
      <SignedIn>
        <AuroraApp />
      </SignedIn>
      <Toaster />
    </div>
  );
};

const App = () => {
  // Temporary bypass for Clerk issues - directly show the app
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <AuroraApp />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
};

export default App;
