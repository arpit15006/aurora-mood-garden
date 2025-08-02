
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  TreePine, 
  Camera, 
  BookOpen, 
  MessageCircle, 
  TrendingUp,
  Heart,
  Brain,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
  Home,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuroraLogo from '@/components/ui/AuroraLogo';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const onboardingSteps = [
    {
      title: "Welcome to Aurora",
      subtitle: "Your AI-Powered Wellness Companion",
      icon: Sparkles,
      content: (
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative liquid-glass-strong rounded-full p-4 backdrop-blur-xl flex items-center justify-center">
              <AuroraLogo size={96} className="mx-auto" />
            </div>
          </div>
          <p className="text-xl text-gray-200 leading-relaxed">
            Aurora is designed to support your mental wellness journey through AI-powered tools and insights. 
            Let's explore what makes Aurora special and how it can help you thrive.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="liquid-glass p-4 rounded-2xl">
              <Brain className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">AI-Powered</h4>
              <p className="text-sm text-gray-300">Advanced emotional intelligence</p>
            </div>
            <div className="liquid-glass p-4 rounded-2xl">
              <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Privacy First</h4>
              <p className="text-sm text-gray-300">Your data stays secure</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Mood Garden",
      subtitle: "Visualize Your Emotional Journey",
      icon: TreePine,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass p-6 rounded-3xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600">
                <TreePine className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Interactive Digital Garden</h3>
                <p className="text-gray-300">Watch your emotions bloom into beautiful plants</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-200">Each emotion becomes a unique plant in your garden</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-200">Track emotional patterns through visual growth</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-200">Celebrate your emotional diversity and growth</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-3xl mb-2">🌻</div>
              <Badge className="bg-yellow-500/20 text-yellow-300">Happy</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌸</div>
              <Badge className="bg-pink-500/20 text-pink-300">Calm</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌿</div>
              <Badge className="bg-purple-500/20 text-purple-300">Anxious</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌹</div>
              <Badge className="bg-red-500/20 text-red-300">Frustrated</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Emotion Detection",
      subtitle: "Real-Time AI Emotional Analysis",
      icon: Camera,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass p-6 rounded-3xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Advanced Facial Recognition</h3>
                <p className="text-gray-300">Understand your emotions in real-time</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-200">Real-time emotion detection using your camera</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-200">Privacy-focused: processing happens locally</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-200">Track emotional patterns throughout the day</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-200">Get insights into your emotional well-being</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-4 rounded-2xl border border-cyan-400/20">
            <p className="text-sm text-cyan-300 text-center">
              <Shield className="h-4 w-4 inline mr-2" />
              Your camera data never leaves your device - complete privacy guaranteed
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Smart Journal",
      subtitle: "AI-Powered Reflection Space",
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass p-6 rounded-3xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Intelligent Journaling</h3>
                <p className="text-gray-300">Transform thoughts into insights</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-purple-400" />
                <span className="text-gray-200">AI analyzes your journal entries for patterns</span>
              </div>
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-purple-400" />
                <span className="text-gray-200">Personalized writing prompts to inspire reflection</span>
              </div>
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-purple-400" />
                <span className="text-gray-200">Mood tracking integrated with your writings</span>
              </div>
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-purple-400" />
                <span className="text-gray-200">Progress tracking and emotional insights</span>
              </div>
            </div>
          </div>
          <div className="liquid-glass p-4 rounded-2xl">
            <p className="text-gray-300 italic text-center">
              "Writing is thinking on paper. Let Aurora help you think more clearly."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "AI Companion",
      subtitle: "Your Supportive Digital Friend",
      icon: MessageCircle,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass p-6 rounded-3xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Safe Emotional Outlet</h3>
                <p className="text-gray-300">Vent, reflect, and receive support</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-pink-400" />
                <span className="text-gray-200">Non-judgmental AI companion available 24/7</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-pink-400" />
                <span className="text-gray-200">Safe space to express difficult emotions</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-pink-400" />
                <span className="text-gray-200">Receive empathetic responses and coping strategies</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-pink-400" />
                <span className="text-gray-200">Build emotional resilience through conversation</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-600/10 p-4 rounded-2xl border border-teal-400/20">
            <p className="text-sm text-teal-300 text-center">
              Remember: Aurora complements but doesn't replace professional mental health care
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Wellness Analytics",
      subtitle: "Track Your Mental Health Journey",
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass p-6 rounded-3xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Comprehensive Analytics</h3>
                <p className="text-gray-300">Data-driven insights into your wellbeing</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                <span className="text-gray-200">Visualize emotional patterns over time</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                <span className="text-gray-200">Track progress across all Aurora features</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                <span className="text-gray-200">Identify triggers and positive influences</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                <span className="text-gray-200">Set and monitor wellness goals</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="liquid-glass p-3 rounded-2xl text-center">
              <div className="text-2xl font-bold text-cyan-400">7d</div>
              <div className="text-xs text-gray-400">Weekly Trends</div>
            </div>
            <div className="liquid-glass p-3 rounded-2xl text-center">
              <div className="text-2xl font-bold text-purple-400">30d</div>
              <div className="text-xs text-gray-400">Monthly Progress</div>
            </div>
            <div className="liquid-glass p-3 rounded-2xl text-center">
              <div className="text-2xl font-bold text-pink-400">∞</div>
              <div className="text-xs text-gray-400">Lifetime Journey</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Begin?",
      subtitle: "Start Your Wellness Journey Today",
      icon: Sparkles,
      content: (
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="relative liquid-glass-strong rounded-full p-6">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">You're All Set!</h3>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            Aurora is now ready to support your mental wellness journey. Remember, small steps lead to big changes, 
            and we're here to support you every step of the way.
          </p>
          <div className="liquid-glass p-6 rounded-3xl">
            <h4 className="font-semibold text-white mb-4">Quick Start Tips:</h4>
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-200">Start with the Mood Garden to track your first emotion</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-200">Try the AI Companion when you need someone to talk to</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-gray-200">Use the Journal for daily reflection and insights</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  const currentStepData = onboardingSteps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb" />
      <div className="floating-orb" />
      <div className="floating-orb" />
      
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="liquid-glass text-white hover:bg-white/10 rounded-3xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Aurora
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="liquid-glass text-white">
              Step {currentStep + 1} of {onboardingSteps.length}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
          </div>
          <div className="liquid-glass rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="liquid-glass-strong border-2 border-white/10 rounded-3xl mb-8">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-400/30">
                <StepIcon className="h-12 w-12 text-cyan-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold aurora-text-glow mb-2">
              {currentStepData.title}
            </CardTitle>
            <CardDescription className="text-xl text-gray-300">
              {currentStepData.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {currentStepData.content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="liquid-glass text-white hover:bg-white/10 rounded-3xl disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === onboardingSteps.length - 1 ? (
            <Button
              onClick={goHome}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 rounded-3xl px-8"
            >
              <Home className="h-4 w-4 mr-2" />
              Start Using Aurora
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 rounded-3xl"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
