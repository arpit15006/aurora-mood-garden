-- Create mood_garden_plants table
CREATE TABLE public.mood_garden_plants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plant_type TEXT NOT NULL,
  mood TEXT NOT NULL,
  x_position FLOAT NOT NULL,
  y_position FLOAT NOT NULL,
  size FLOAT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.mood_garden_plants ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable all for authenticated users" ON public.mood_garden_plants FOR ALL USING (true);