-- ============================================================
-- TopCoach — Initial Schema
-- Run this once in the Supabase SQL Editor
-- ============================================================

-- ============================================================
-- CLIENTS
-- ============================================================
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  created_at  timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Authenticated users can do anything with clients"
  on public.clients
  for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- EXERCISES
-- ============================================================
create table if not exists public.exercises (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  muscle_group text,
  is_custom    boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.exercises enable row level security;

create policy "Authenticated users can do anything with exercises"
  on public.exercises
  for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- SESSIONS
-- ============================================================
create table if not exists public.sessions (
  id                        uuid primary key default gen_random_uuid(),
  client_id                 uuid not null references public.clients(id) on delete cascade,
  date                      date not null,
  time                      time,
  notes                     text,
  google_calendar_event_id  text,
  stripe_invoice_id         text,
  created_at                timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "Authenticated users can do anything with sessions"
  on public.sessions
  for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- SESSION LOGS
-- ============================================================
create table if not exists public.session_logs (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.sessions(id) on delete cascade,
  exercise_id  uuid not null references public.exercises(id) on delete restrict,
  sets         integer,
  reps         integer,
  weight       numeric(6,2),
  notes        text,
  created_at   timestamptz not null default now()
);

alter table public.session_logs enable row level security;

create policy "Authenticated users can do anything with session_logs"
  on public.session_logs
  for all
  to authenticated
  using (true)
  with check (true);
