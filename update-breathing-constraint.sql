-- Update game_stats table to include breathing exercise
ALTER TABLE game_stats DROP CONSTRAINT IF EXISTS game_stats_game_type_check;
ALTER TABLE game_stats ADD CONSTRAINT game_stats_game_type_check 
CHECK (game_type IN ('breakout', 'wordsearch', 'flappybird', 'colormemory', 'breathing'));