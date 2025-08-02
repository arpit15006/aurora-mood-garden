
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, BookOpen, MessageCircle, Camera, Smile, ArrowRight, Stars, Zap } from 'lucide-react';
import Navigation from './Navigation';

interface HomePageProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const HomePage = ({ onNavigate, currentSection }: HomePageProps) => {
  const features = [
    {
      icon: Heart,
      title: 'Mood Garden',
      description: 'Visualize your emotional journey with our interactive digital garden that grows with your feelings',
      gradient: 'from-pink-500 to-rose-600',
      action: () => onNavigate('mood-garden')
    },
    {
      icon: BookOpen,
      title: 'Smart Journaling',
      description: 'AI-powered insights help you understand patterns in your thoughts and emotions',
      gradient: 'from-purple-500 to-pink-600',
      action: () => onNavigate('journal')
    },
    {
      icon: MessageCircle,
      title: 'AI Companion',
      description: 'Chat with Aurora for support, guidance, and a listening ear whenever you need it',
      gradient: 'from-cyan-500 to-blue-600',
      action: () => onNavigate('vent')
    },
    {
      icon: Camera,
      title: 'Emotion Detection',
      description: 'Advanced AI technology to recognize and analyze your emotional state in real-time',
      gradient: 'from-green-500 to-teal-600',
      action: () => onNavigate('emotion-detection')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 relative z-10">
      {/* Floating Orbs */}
      <div className="floating-orb" />
      <div className="floating-orb" />
      <div className="floating-orb" />
      
      {/* Enhanced Hero Section */}
      <div className="text-center space-y-8 py-12">
        <div className="flex justify-center mb-8">
          <div className="relative group">
            {/* Outer glow ring */}
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-300"></div>
            
            {/* Main logo container */}
            <div className="relative liquid-glass-strong rounded-full p-12 group-hover:scale-105 transition-transform duration-300">
              {/* Inner decorative elements */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
              
              {/* Logo content */}
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-20 w-20 text-transparent aurora-text-glow relative z-10" style={{ 
                  background: 'linear-gradient(135deg, hsl(177, 90%, 70%), hsl(262, 85%, 80%), hsl(330, 90%, 75%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }} />
                
                {/* Floating mini sparkles */}
                <Stars className="h-6 w-6 text-cyan-400 absolute -top-2 -right-2 animate-pulse opacity-80" />
                <Zap className="h-5 w-5 text-purple-400 absolute -bottom-1 -left-1 animate-pulse opacity-70" />
                <Sparkles className="h-4 w-4 text-pink-400 absolute top-1 left-8 animate-pulse opacity-60" />
              </div>
              
              {/* Orbiting particles */}
              <div className="absolute inset-0 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full absolute top-2 left-1/2 animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full absolute bottom-3 right-6 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="w-1 h-1 bg-pink-400 rounded-full absolute left-4 top-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-8xl font-bold aurora-text-glow tracking-tight leading-tight">
            Welcome to Aurora
          </h1>
          <p className="text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-medium">
            Your personal AI wellness companion designed to support your mental health journey with 
            <span className="aurora-text-dark font-semibold"> empathy</span>, 
            <span className="aurora-text-dark font-semibold"> intelligence</span>, and 
            <span className="aurora-text-dark font-semibold"> care</span>.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="liquid-glass-strong rounded-full px-10 py-5 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <Smile className="h-7 w-7 text-yellow-400 animate-pulse" />
              <span className="text-gray-100 font-semibold text-xl">Start your wellness journey today</span>
              <ArrowRight className="h-6 w-6 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="liquid-glass-card hover:scale-105 transition-all duration-500 group cursor-pointer"
              onClick={feature.action}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-6">
                  <div className={`p-5 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold aurora-text-dark group-hover:aurora-text-glow transition-all duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-200 text-lg leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Navigation Section */}
      <div className="space-y-10 py-8">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold aurora-text-glow">
            Choose Your Experience
          </h2>
          <p className="text-gray-200 text-xl font-medium max-w-2xl mx-auto">
            Select a feature below to begin your personalized wellness journey with Aurora's intelligent support system
          </p>
        </div>
        
        <Navigation onNavigate={onNavigate} currentSection={currentSection} />
      </div>

      {/* Additional Features Section */}
      <div className="py-12">
        <Card className="liquid-glass-card">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-4xl font-bold aurora-text-glow">
              Why Choose Aurora?
            </CardTitle>
            <CardDescription className="text-xl text-gray-200 mt-4">
              Experience the future of mental wellness support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="liquid-glass-strong rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <Heart className="h-10 w-10 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Empathetic AI</h3>
                <p className="text-gray-300">Aurora understands your emotions and provides personalized support tailored to your unique needs.</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="liquid-glass-strong rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <Sparkles className="h-10 w-10 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Smart Insights</h3>
                <p className="text-gray-300">Advanced analytics help you understand patterns in your mental health journey and track progress.</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="liquid-glass-strong rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <Smile className="h-10 w-10 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">24/7 Support</h3>
                <p className="text-gray-300">Aurora is always available to listen, provide guidance, and support you whenever you need it most.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
