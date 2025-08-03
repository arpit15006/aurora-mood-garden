import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import Index from "./pages/Index";
import MoodGarden from "./pages/MoodGarden";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthPage = () => (
  <div className="min-h-screen relative overflow-hidden">
    <div className="floating-orb" />
    <div className="floating-orb" />
    <div className="floating-orb" />
    
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        <div className="relative group mb-8">
          <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative liquid-glass-strong rounded-full p-8 group-hover:scale-105 transition-transform duration-500">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-aurora-electric-blue via-aurora-purple to-aurora-pink rounded-full flex items-center justify-center">
              <span className="text-3xl">🌸</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold aurora-text-glow mb-2">Welcome to Aurora</h1>
          <p className="text-xl text-gray-300 font-medium">Your AI Wellness Companion</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Discover emotional wellness through AI-powered journaling, mood tracking, 
            real-time emotion detection, and personalized insights designed for students.
          </p>
        </div>
        
        <div className="space-y-4 pt-6">
          <SignInButton mode="modal">
            <button className="w-full px-8 py-4 bg-gradient-to-r from-aurora-electric-blue to-aurora-cyan text-white rounded-2xl hover:from-aurora-cyan hover:to-aurora-teal transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-2xl">
              Sign In to Continue
            </button>
          </SignInButton>
          
          <SignUpButton mode="modal">
            <button className="w-full px-8 py-4 border-2 border-aurora-purple text-aurora-purple rounded-2xl hover:bg-aurora-purple hover:text-white transition-all duration-300 transform hover:scale-105 font-semibold text-lg liquid-glass">
              Create New Account
            </button>
          </SignUpButton>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-8">
          <div className="liquid-glass p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">🧠</div>
            <p className="text-xs text-gray-300">AI Emotion Detection</p>
          </div>
          <div className="liquid-glass p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-xs text-gray-300">Smart Journaling</p>
          </div>
          <div className="liquid-glass p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">🌱</div>
            <p className="text-xs text-gray-300">Mood Garden</p>
          </div>
          <div className="liquid-glass p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-xs text-gray-300">AI Voice Therapy</p>
          </div>
        </div>
        
        <div className="pt-6 text-center">
          <p className="text-xs text-gray-500">
            Built with ❤️ for student mental wellness
          </p>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <SignedOut>
              <AuthPage />
            </SignedOut>
            <SignedIn>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mood-garden" element={<MoodGarden />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SignedIn>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;