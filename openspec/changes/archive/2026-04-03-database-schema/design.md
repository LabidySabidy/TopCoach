## Context

Supabase (PostgreSQL) is already connected. There are no tables yet. This change creates the complete schema in a single migration SQL file that is run once via the Supabase dashboard SQL editor. No ORM is used — raw SQL migrations keep things simple and visible.

## Goals / Non-Goals

**Goals:**
- Create all 4 tables with correct column types, constraints, and foreign keys
- Enable Row Level Security on all tables so only the authenticated trainer can access data
- Seed the exercises table with a useful starting library
- Keep the schema minimal — only columns that are actually used in MVP features

**Non-Goals:**
- No Supabase CLI setup (keep it simple — SQL editor only for now)
- No stored procedures or triggers
- No additional tables beyond the 4 defined in the data model
- No soft deletes — hard delete is fine for this scale

## Decisions

### 1. Single migration file run via SQL editor
Using the Supabase dashboard SQL editor is simpler than setting up the Supabase CLI for a solo developer. One `.sql` file is created in `supabase/migrations/` for documentation, but it is run manually. This is fine at this scale.

### 2. UUIDs as primary keys
All tables use `uuid` primary keys with `gen_random_uuid()` as default. Consistent with Supabase's auth.users table and avoids sequential ID guessing.

### 3. Row Level Security (RLS) — authenticated-only policies
All tables have RLS enabled with a single policy: `auth.role() = 'authenticated'`. Since there is only one user (the trainer), this is the correct level of protection. No user-specific filtering needed.

### 4. `exercises.is_custom` flag
A boolean column distinguishes seeded exercises from trainer-added ones. This allows the UI to display them differently and prevents accidental deletion of seeded entries later.

### 5. `session_logs` stores raw numbers, no units
Weight is stored as a `numeric` with no unit column. The trainer always works in the same unit (lbs or kg). If units become important later, a column can be added — premature to add now.

### 6. Nullable foreign key columns on `sessions`
`google_calendar_event_id` and `stripe_invoice_id` are nullable because a session can exist before either is sent. They get populated when the trainer sends the invite or invoice.

## Risks / Trade-offs

- **Manual migration** → If the schema needs to change later, another SQL file must be run manually. Acceptable at this scale; can adopt Supabase CLI later.
- **No soft deletes** → Deleting a client also cascades to their sessions and logs. This is intentional — make it clear in the UI before allowing deletion.

## Migration Plan

1. Write the migration SQL file at `supabase/migrations/001_initial_schema.sql`
2. Open Supabase dashboard → SQL Editor
3. Paste and run the migration
4. Verify tables appear in the Table Editor
5. Verify RLS policies are active on each table
6. Run the seed SQL to populate exercises
