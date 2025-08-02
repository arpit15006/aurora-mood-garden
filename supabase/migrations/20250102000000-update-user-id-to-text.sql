-- Update user_id columns to TEXT to support Clerk user IDs

-- Update journal_entries table
ALTER TABLE public.journal_entries 
ALTER COLUMN user_id TYPE TEXT;

-- Update emotion_logs table  
ALTER TABLE public.emotion_logs
ALTER COLUMN user_id TYPE TEXT;

-- Update profiles table
ALTER TABLE public.profiles
ALTER COLUMN user_id TYPE TEXT;

-- Drop the foreign key constraint on profiles.id since Clerk users won't be in auth.users
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Update the profiles.id column to TEXT as well
ALTER TABLE public.profiles
ALTER COLUMN id TYPE TEXT;