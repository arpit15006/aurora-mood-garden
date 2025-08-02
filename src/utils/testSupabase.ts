import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', supabase.supabaseUrl);
    console.log('Supabase Key:', supabase.supabaseKey.substring(0, 20) + '...');

    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

export const testSupabaseAuth = async () => {
  try {
    console.log('Testing Supabase auth...');
    
    // Test getting current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase auth test failed:', error);
      return false;
    }
    
    console.log('Supabase auth test successful, current session:', session?.user?.email || 'No session');
    return true;
  } catch (error) {
    console.error('Supabase auth test error:', error);
    return false;
  }
};
