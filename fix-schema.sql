-- Drop all RLS policies first
DROP POLICY IF EXISTS "Users can view their own journal entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can insert their own journal entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can update their own journal entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can delete their own journal entries" ON public.journal_entries;

DROP POLICY IF EXISTS "Users can view their own emotion logs" ON public.emotion_logs;
DROP POLICY IF EXISTS "Users can insert their own emotion logs" ON public.emotion_logs;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Now alter column types
ALTER TABLE public.journal_entries ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.emotion_logs ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.profiles ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT;

-- Recreate RLS policies for TEXT user_id
CREATE POLICY "Users can view their own journal entries" ON public.journal_entries
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own journal entries" ON public.journal_entries
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own journal entries" ON public.journal_entries
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own journal entries" ON public.journal_entries
  FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own emotion logs" ON public.emotion_logs
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own emotion logs" ON public.emotion_logs
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');