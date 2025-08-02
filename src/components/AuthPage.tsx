
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Mail, Lock, User, Stars, Zap, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import AuthDebug from './AuthDebug';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();

  // Test function to create a demo user
  const createTestUser = async () => {
    setEmail('test@aurora.com');
    setPassword('test123');
    setName('Test User');
    setIsSignUp(true);
  };

  // Debug function to check auth state
  const checkAuthState = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      const debugText = `
Debug Info:
- User: ${user?.email || 'None'}
- Loading: ${loading}
- Session: ${session?.user?.email || 'None'}
- Error: ${error?.message || 'None'}
- Supabase URL: ${supabase.supabaseUrl}
      `.trim();
      setDebugInfo(debugText);
    } catch (err) {
      setDebugInfo(`Debug Error: ${err}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting authentication...', { isSignUp, email });

      if (isSignUp) {
        console.log('Signing up user...');
        await signUp(email, password);
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
      } else {
        console.log('Signing in user...');
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating Orbs */}
      <div className="floating-orb" />
      <div className="floating-orb" />
      <div className="floating-orb" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Aurora Logo Section */}
        <div className="flex justify-center mb-12">
          <div className="relative group">
            {/* Outer glow ring */}
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-300"></div>
            
            {/* Main logo container */}
            <div className="relative liquid-glass-strong rounded-full p-8 group-hover:scale-105 transition-transform duration-300">
              {/* Inner decorative elements */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
              
              {/* Logo content */}
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-transparent aurora-text-glow relative z-10" style={{ 
                  background: 'linear-gradient(135deg, hsl(177, 90%, 70%), hsl(262, 85%, 80%), hsl(330, 90%, 75%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }} />
                
                {/* Floating mini sparkles */}
                <Stars className="h-4 w-4 text-cyan-400 absolute -top-1 -right-1 animate-pulse opacity-80" />
                <Zap className="h-3 w-3 text-purple-400 absolute -bottom-1 -left-1 animate-pulse opacity-70" />
                <Sparkles className="h-2 w-2 text-pink-400 absolute top-1 left-6 animate-pulse opacity-60" />
              </div>
              
              {/* Orbiting particles */}
              <div className="absolute inset-0 rounded-full">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute top-2 left-1/2 animate-pulse"></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full absolute bottom-2 right-4 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="w-0.5 h-0.5 bg-pink-400 rounded-full absolute left-3 top-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>

        <Card className="liquid-glass-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold aurora-text-glow">
              {isSignUp ? 'Join Aurora' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              {isSignUp 
                ? 'Begin your wellness journey with Aurora'
                : 'Continue your wellness journey with Aurora'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="liquid-glass pl-10 text-white placeholder-gray-400 border-white/10"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="liquid-glass pl-10 text-white placeholder-gray-400 border-white/10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="liquid-glass pl-10 text-white placeholder-gray-400 border-white/10"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>
            
            <div className="mt-6 space-y-3 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-aurora-electric-blue hover:text-aurora-purple transition-colors duration-300 font-medium"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </button>

              {/* Test User Button for Development */}
              <div className="pt-2 border-t border-gray-700 space-y-2">
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={createTestUser}
                    className="glass-effect text-xs text-gray-400 hover:text-white"
                  >
                    Fill Test User Data
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={checkAuthState}
                    className="glass-effect text-xs text-gray-400 hover:text-white"
                  >
                    Debug Auth
                  </Button>
                </div>

                {debugInfo && (
                  <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs text-gray-300 font-mono whitespace-pre-line">
                    {debugInfo}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Panel */}
        <div className="mt-8">
          <AuthDebug />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
