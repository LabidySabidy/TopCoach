-- ============================================================
-- TopCoach — Add status column to sessions + unique constraint for upsert
-- Run this in the Supabase SQL Editor
-- ============================================================

alter table public.sessions
  add column if not exists status text not null default 'active';

-- Required for upsertSessionLog to work (ON CONFLICT session_id, exercise_id)
alter table public.session_logs
  drop constraint if exists session_logs_session_exercise_unique;

alter table public.session_logs
  add constraint session_logs_session_exercise_unique
  unique (session_id, exercise_id);
