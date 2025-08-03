-- Create game_stats table for tracking therapeutic game progress
CREATE TABLE IF NOT EXISTS game_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    game_type TEXT NOT NULL CHECK (game_type IN ('breakout', 'wordsearch', 'flappybird', 'colormemory', 'breathing')),
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own game stats" ON game_stats;
DROP POLICY IF EXISTS "Users can insert their own game stats" ON game_stats;
DROP POLICY IF EXISTS "Users can update their own game stats" ON game_stats;

-- Create RLS policies
CREATE POLICY "Users can view their own game stats" ON game_stats
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own game stats" ON game_stats
    FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own game stats" ON game_stats
    FOR UPDATE USING (user_id = auth.uid()::text);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_game_stats_updated_at ON game_stats;
CREATE TRIGGER update_game_stats_updated_at 
    BEFORE UPDATE ON game_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();