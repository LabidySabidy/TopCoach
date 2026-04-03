-- ============================================================
-- TopCoach — Exercise types + duration logging
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Add exercise_type to exercises table
alter table public.exercises
  add column if not exists exercise_type text not null default 'weighted';

-- Add duration_seconds to session_logs table
alter table public.session_logs
  add column if not exists duration_seconds integer;

-- Classify exercises
update public.exercises
  set exercise_type = 'duration'
  where name in ('Plank', 'Treadmill', 'Rowing Machine', 'Assault Bike', 'Jump Rope');

update public.exercises
  set exercise_type = 'bodyweight'
  where name in ('Push Up', 'Pull Up', 'Dip');
-- Everything else stays as 'weighted' (the default)
