
-- Create emotion_logs table with correct structure
CREATE TABLE IF NOT EXISTS emotion_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  detected_emotion text NOT NULL,
  confidence decimal(3,2) NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE emotion_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own emotion logs" ON emotion_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emotion logs" ON emotion_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE emotion_logs;

-- Set replica identity for realtime updates
ALTER TABLE emotion_logs REPLICA IDENTITY FULL;
