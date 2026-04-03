## 1. Create Migration File

- [x] 1.1 Create directory `supabase/migrations/`
- [x] 1.2 Create `supabase/migrations/001_initial_schema.sql` with the full schema SQL (clients, exercises, sessions, session_logs tables with RLS policies)
- [x] 1.3 Create `supabase/migrations/002_seed_exercises.sql` with INSERT statements for ~40 common exercises across all major muscle groups

## 2. Run Migration in Supabase

- [x] 2.1 Open Supabase dashboard → SQL Editor
- [x] 2.2 Paste and run `001_initial_schema.sql`
- [x] 2.3 Verify all 4 tables appear in the Table Editor
- [x] 2.4 Verify RLS is enabled on all 4 tables (Table Editor → each table → RLS tab)

## 3. Run Seed in Supabase

- [x] 3.1 Paste and run `002_seed_exercises.sql` in the SQL Editor
- [x] 3.2 Verify the `exercises` table contains rows with `is_custom = false`

## 4. Update TypeScript Types

- [x] 4.1 Update `src/types/index.ts` to ensure all interfaces exactly match the final column names and nullability from the migration SQL
