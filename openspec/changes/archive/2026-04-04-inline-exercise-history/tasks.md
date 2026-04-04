## 1. Data Layer

- [x] 1.1 Add `getLastLogPerExercise(clientId: string, exerciseIds: string[])` to `src/lib/supabase/queries.ts` — query all completed session_logs for the given exercise IDs for this client, join sessions (for date + status filter) and exercises (for exercise_type), order by date desc, deduplicate in TypeScript to return `Record<string, { sets, reps, weight, duration_seconds, date, exercise_type }>`
- [x] 1.2 Add `LastExerciseLog` type to `src/types/index.ts`

## 2. Server Component

- [x] 2.1 Update the session page server component (`src/app/sessions/[id]/page.tsx`) to call `getLastLogPerExercise` instead of `getLastCompletedSession`, passing the client_id and exercise IDs from existing logs. Pass the result as an `exerciseHistory` prop to `SessionLoggingClient`

## 3. Client Component

- [x] 3.1 Update `SessionLoggingClient` props: replace `lastSession: SessionWithLogs | null` with `exerciseHistory: Record<string, LastExerciseLog>`
- [x] 3.2 Add inline history label to each exercise card — a single `text-xs text-gray-400` line between the exercise name row and the input fields, formatted per exercise type (weighted/bodyweight/duration) or "First time logging this exercise" if no history exists
- [x] 3.3 Remove the collapsible last-session panel (lines 303-341), the `showLastSession` state, the `formatLogValue` helper, and the `SessionWithLogs` import

## 4. Cleanup

- [x] 4.1 Remove `getLastCompletedSession` import from the session page server component (keep the function in queries.ts for potential future use)
- [x] 4.2 Verify the session logging screen renders correctly with inline history for weighted, bodyweight, and duration exercises, and shows "First time" for exercises with no history
