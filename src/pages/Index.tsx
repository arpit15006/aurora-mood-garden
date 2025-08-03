import { Sparkles, User } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';

const Index = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Sparkles className="h-16 w-16 text-cyan-400" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Aurora
          </h1>
        </div>
        <p className="text-2xl text-gray-300">Welcome, {user?.firstName || 'User'}!</p>
        <p className="text-lg text-gray-400">Your AI Wellness Companion</p>
        
        <div className="flex items-center justify-center space-x-4 mt-8">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <User className="h-4 w-4 text-cyan-400" />
            <span className="text-white font-medium">
              {user?.emailAddresses?.[0]?.emailAddress || 'user@example.com'}
            </span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <Sparkles className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Emotion Detection</h3>
            <p className="text-gray-300">AI-powered emotion analysis</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Smart Journaling</h3>
            <p className="text-gray-300">AI-enhanced reflection</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <Sparkles className="h-8 w-8 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Companion</h3>
            <p className="text-gray-300">24/7 emotional support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
