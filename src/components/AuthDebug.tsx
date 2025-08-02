import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';

const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<string[]>([]);
  const { user, session, loading } = useAuth();

  const runTests = async () => {
    const results: string[] = [];
    
    try {
      // Test 1: Check Supabase client
      results.push('✅ Supabase client initialized');
      results.push(`📍 URL: ${supabase.supabaseUrl}`);
      results.push(`🔑 Key: ${supabase.supabaseKey.substring(0, 20)}...`);
      
      // Test 2: Check current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        results.push(`❌ Session error: ${sessionError.message}`);
      } else {
        results.push(`✅ Session check successful`);
        results.push(`👤 Current user: ${currentSession?.user?.email || 'None'}`);
      }
      
      // Test 3: Check auth state
      results.push(`🔄 Auth loading: ${loading}`);
      results.push(`👤 Auth user: ${user?.email || 'None'}`);
      results.push(`🎫 Auth session: ${session?.user?.email || 'None'}`);
      
      // Test 4: Test database connection
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          results.push(`❌ Database error: ${error.message}`);
        } else {
          results.push(`✅ Database connection successful`);
        }
      } catch (dbError) {
        results.push(`❌ Database connection failed: ${dbError}`);
      }
      
      // Test 5: Check local storage
      const localStorageKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('auth')
      );
      results.push(`💾 Local storage keys: ${localStorageKeys.join(', ') || 'None'}`);
      
    } catch (error) {
      results.push(`❌ Test failed: ${error}`);
    }
    
    setTestResults(results);
  };

  const clearAuth = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      setTestResults(['🧹 Auth cleared, localStorage cleared']);
    } catch (error) {
      setTestResults([`❌ Clear auth failed: ${error}`]);
    }
  };

  const testSignUp = async () => {
    try {
      const testEmail = `test-${Date.now()}@aurora.com`;
      const testPassword = 'test123456';
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });
      
      if (error) {
        setTestResults([`❌ Test signup failed: ${error.message}`]);
      } else {
        setTestResults([
          `✅ Test signup successful`,
          `📧 Email: ${testEmail}`,
          `👤 User ID: ${data.user?.id}`,
          `✉️ Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`
        ]);
      }
    } catch (error) {
      setTestResults([`❌ Test signup error: ${error}`]);
    }
  };

  useEffect(() => {
    runTests();
  }, [user, session, loading]);

  return (
    <Card className="glass-effect max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="aurora-text flex items-center gap-2">
          🔧 Authentication Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runTests} size="sm" variant="outline">
            🔄 Run Tests
          </Button>
          <Button onClick={clearAuth} size="sm" variant="outline">
            🧹 Clear Auth
          </Button>
          <Button onClick={testSignUp} size="sm" variant="outline">
            🧪 Test Signup
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Current State:</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={loading ? "default" : "secondary"}>
              Loading: {loading ? "Yes" : "No"}
            </Badge>
            <Badge variant={user ? "default" : "secondary"}>
              User: {user ? "Authenticated" : "None"}
            </Badge>
            <Badge variant={session ? "default" : "secondary"}>
              Session: {session ? "Active" : "None"}
            </Badge>
          </div>
        </div>
        
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300">Test Results:</h3>
            <div className="bg-gray-800/50 rounded p-3 font-mono text-xs space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-gray-300">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebug;
