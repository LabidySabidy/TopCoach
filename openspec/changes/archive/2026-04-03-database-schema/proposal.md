## Why

The app has no database tables yet. Before any feature can store or retrieve data, the Supabase PostgreSQL schema needs to be created. This change establishes the foundational data model — clients, exercises, sessions, and session logs — and seeds the exercise library so the trainer has a useful starting point without manual data entry.

## What Changes

- Create `clients` table — stores trainer's client list (name, email, phone)
- Create `exercises` table — seeded library of common exercises plus support for trainer-added custom ones
- Create `sessions` table — represents a booked training session for a client, linked to Google Calendar and Stripe
- Create `session_logs` table — the actual workout data logged during a session (exercise, sets, reps, weight)
- Seed `exercises` table with ~40 common exercises across major muscle groups
- Add Row Level Security (RLS) policies — all tables are private to the authenticated trainer

## Capabilities

### New Capabilities

- `client-management`: Trainer can create, read, update, and delete clients stored in the `clients` table
- `exercise-library`: Pre-seeded exercise list that the trainer can extend with custom exercises
- `session-management`: Sessions are created per client with date, time, and notes; linked to calendar events and invoices
- `workout-logging`: Session logs capture sets, reps, and weight per exercise per session; previous session data is queryable for reference

### Modified Capabilities

- none

## Impact

- New Supabase migration file required — run via Supabase dashboard SQL editor or CLI
- No code changes yet — this change is schema only; feature UI is in subsequent changes
- Touches all 3 core features at the data layer (workout logger, payments, calendar)
- New third-party dependency: none (uses existing Supabase connection)
