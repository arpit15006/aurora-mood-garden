
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TreePine, 
  Camera, 
  BookOpen, 
  MessageCircle, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Heart,
  Brain,
  Shield,
  Zap,
  Target,
  Users,
  Clock
} from 'lucide-react';
import AuroraLogo from '@/components/ui/AuroraLogo';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingModal = ({ open, onOpenChange }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Aurora",
      subtitle: "Your Personal AI Wellness Companion",
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative liquid-glass-strong rounded-full p-4 h-full flex items-center justify-center">
                <AuroraLogo size={96} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold aurora-text-glow">Meet Aurora</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                An AI-powered wellness companion designed to support your mental health journey with empathy, intelligence, and personalized care.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, title: "Empathetic", desc: "Understands your emotions" },
              { icon: Brain, title: "Intelligent", desc: "AI-powered insights" },
              { icon: Shield, title: "Private", desc: "Your data stays secure" },
              { icon: Clock, title: "24/7 Available", desc: "Always here for you" }
            ].map((feature, index) => (
              <Card key={index} className="liquid-glass-card">
                <CardContent className="p-4 text-center">
                  <feature.icon className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-300">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Home Dashboard",
      subtitle: "Your Wellness Command Center",
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Centralized Wellness Hub</h3>
                <p className="text-gray-300">Everything you need in one place</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-200">Quick access to all features</span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-gray-200">Personalized recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-4 w-4 text-purple-400" />
                <span className="text-gray-200">Real-time wellness insights</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Your home dashboard provides an overview of your wellness journey, quick access to all features, 
            and personalized insights to help you stay on track with your mental health goals.
          </p>
        </div>
      )
    },
    {
      title: "Mood Garden",
      subtitle: "Cultivate Your Emotional Landscape",
      icon: TreePine,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Interactive Emotional Visualization</h3>
                <p className="text-gray-300">Watch your emotional garden grow</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-400">Features:</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Visual mood tracking</li>
                  <li>• Interactive garden elements</li>
                  <li>• Emotional pattern recognition</li>
                  <li>• Growth visualization</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-400">Benefits:</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Better emotional awareness</li>
                  <li>• Positive reinforcement</li>
                  <li>• Long-term progress tracking</li>
                  <li>• Gamified wellness</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            The Mood Garden transforms your emotional data into a beautiful, growing digital garden. 
            Each positive emotion nurtures your garden, creating a visual representation of your mental wellness journey.
          </p>
        </div>
      )
    },
    {
      title: "Emotion Detection",
      subtitle: "Real-time Emotional Analysis",
      icon: Camera,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Advanced AI Recognition</h3>
                <p className="text-gray-300">Understand your emotions in real-time</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-200">Facial Expression Analysis</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">Live</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-200">Emotion Confidence Scoring</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">AI-Powered</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-200">Historical Emotion Tracking</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Analytics</Badge>
              </div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Using advanced computer vision and machine learning, Aurora can detect and analyze your emotions 
            through your camera, providing instant feedback and tracking emotional patterns over time.
          </p>
        </div>
      )
    },
    {
      title: "Smart Journal",
      subtitle: "AI-Powered Reflection Space",
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Intelligent Writing Companion</h3>
                <p className="text-gray-300">More than just journaling</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { title: "AI Insights", desc: "Get personalized insights from your entries", color: "text-cyan-400" },
                { title: "Mood Correlation", desc: "See how your writing reflects your emotions", color: "text-purple-400" },
                { title: "Pattern Recognition", desc: "Discover recurring themes in your thoughts", color: "text-green-400" },
                { title: "Growth Tracking", desc: "Monitor your personal development over time", color: "text-yellow-400" }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${feature.color.replace('text-', 'bg-')}`}></div>
                  <div>
                    <h4 className={`font-semibold ${feature.color}`}>{feature.title}</h4>
                    <p className="text-sm text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            The Smart Journal uses AI to analyze your writing, provide insights into your mental state, 
            and help you understand patterns in your thoughts and emotions for better self-awareness.
          </p>
        </div>
      )
    },
    {
      title: "AI Companion",
      subtitle: "Safe Space for Thoughts and Feelings",
      icon: MessageCircle,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Personal AI Therapist</h3>
                <p className="text-gray-300">Always available to listen and support</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-lg border border-cyan-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <span className="font-semibold text-cyan-400">Empathetic Conversations</span>
                </div>
                <p className="text-sm text-gray-300">Natural, understanding dialogue that adapts to your emotional state</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="font-semibold text-purple-400">Safe & Confidential</span>
                </div>
                <p className="text-sm text-gray-300">Your conversations are private and secure, creating a judgment-free space</p>
              </div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Chat with Aurora's AI companion whenever you need someone to talk to. It provides emotional support, 
            coping strategies, and therapeutic guidance in a safe, non-judgmental environment.
          </p>
        </div>
      )
    },
    {
      title: "Wellness Analytics",
      subtitle: "Track Your Mental Health Journey",
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="liquid-glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Comprehensive Progress Tracking</h3>
                <p className="text-gray-300">Data-driven wellness insights</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <h4 className="font-semibold text-white">Mood Trends</h4>
                <p className="text-xs text-gray-400">Weekly & monthly patterns</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <h4 className="font-semibold text-white">Goal Progress</h4>
                <p className="text-xs text-gray-400">Achievement tracking</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <h4 className="font-semibold text-white">AI Insights</h4>
                <p className="text-xs text-gray-400">Personalized recommendations</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-pink-400" />
                <h4 className="font-semibold text-white">Wellness Score</h4>
                <p className="text-xs text-gray-400">Overall health rating</p>
              </div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Get detailed analytics on your mental health journey with charts, trends, and AI-powered insights 
            that help you understand your progress and identify areas for improvement.
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto liquid-glass-strong border-2 border-white/20 rounded-3xl">
        <DialogHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30"></div>
              <div className="relative liquid-glass-strong rounded-full p-4">
                <Icon className="h-12 w-12 text-transparent" style={{ 
                  background: 'linear-gradient(135deg, hsl(177, 90%, 70%), hsl(262, 85%, 80%), hsl(330, 90%, 75%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }} />
              </div>
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold aurora-text-glow mb-2">
            {currentStepData.title}
          </DialogTitle>
          <p className="text-xl text-gray-300 font-medium">
            {currentStepData.subtitle}
          </p>
        </DialogHeader>

        <div className="px-2">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-cyan-400 scale-125'
                    : index < currentStep
                    ? 'bg-green-400'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="liquid-glass rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-xl"
              >
                Get Started
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-xl"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
