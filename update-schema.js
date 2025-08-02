import { supabase } from './src/integrations/supabase/client.js';

async function updateSchema() {
  try {
    // Update journal_entries user_id to TEXT
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.journal_entries ALTER COLUMN user_id TYPE TEXT;'
    });
    
    // Update emotion_logs user_id to TEXT  
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.emotion_logs ALTER COLUMN user_id TYPE TEXT;'
    });
    
    // Update profiles user_id to TEXT
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.profiles ALTER COLUMN user_id TYPE TEXT;'
    });
    
    // Update profiles id to TEXT
    const { error: error4 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT;'
    });
    
    console.log('Schema updated successfully');
    if (error1) console.error('Error 1:', error1);
    if (error2) console.error('Error 2:', error2);
    if (error3) console.error('Error 3:', error3);
    if (error4) console.error('Error 4:', error4);
    
  } catch (error) {
    console.error('Update failed:', error);
  }
}

updateSchema();