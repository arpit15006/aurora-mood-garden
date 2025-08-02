-- Disable RLS and drop tables
ALTER TABLE public.journal_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

DROP TABLE IF EXISTS public.journal_entries CASCADE;
DROP TABLE IF EXISTS public.emotion_logs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Recreate tables with TEXT user_id
CREATE TABLE public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT,
  ai_response TEXT,
  ai_insights TEXT,
  ai_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.emotion_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  detected_emotion TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "Enable all for authenticated users" ON public.journal_entries FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON public.emotion_logs FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON public.profiles FOR ALL USING (true);