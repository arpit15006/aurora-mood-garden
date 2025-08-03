import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xlcvzzkqtuehtjronnoj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsY3Z6emtxdHVlaHRqcm9ubm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDg2NzMsImV4cCI6MjA2OTAyNDY3M30.P6hm67m_uCOSsYi5Zjyf7Sjj9C-yjwCZJubdFj0GyXg';

const supabase = createClient(supabaseUrl, supabaseKey);

const createGameStatsTable = async () => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create game_stats table for tracking therapeutic game progress
        CREATE TABLE IF NOT EXISTS game_stats (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT NOT NULL,
            game_type TEXT NOT NULL CHECK (game_type IN ('breakout', 'wordsearch', 'flappybird', 'colormemory')),
            score INTEGER NOT NULL DEFAULT 0,
            time_played INTEGER NOT NULL DEFAULT 0,
            completed BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better query performance
        CREATE INDEX IF NOT EXISTS idx_game_stats_user_id ON game_stats(user_id);
        CREATE INDEX IF NOT EXISTS idx_game_stats_game_type ON game_stats(game_type);
        CREATE INDEX IF NOT EXISTS idx_game_stats_created_at ON game_stats(created_at);

        -- Enable Row Level Security
        ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        DROP POLICY IF EXISTS "Users can view their own game stats" ON game_stats;
        CREATE POLICY "Users can view their own game stats" ON game_stats
            FOR SELECT USING (user_id = auth.uid()::text);

        DROP POLICY IF EXISTS "Users can insert their own game stats" ON game_stats;
        CREATE POLICY "Users can insert their own game stats" ON game_stats
            FOR INSERT WITH CHECK (user_id = auth.uid()::text);

        DROP POLICY IF EXISTS "Users can update their own game stats" ON game_stats;
        CREATE POLICY "Users can update their own game stats" ON game_stats
            FOR UPDATE USING (user_id = auth.uid()::text);
      `
    });

    if (error) {
      console.error('Error creating table:', error);
    } else {
      console.log('Game stats table created successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

createGameStatsTable();