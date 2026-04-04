## Why

During live sessions, the trainer needs to see a client's last performance for each exercise *right where they're logging* — not in a separate collapsible panel that requires extra taps and visual scanning. The current reference panel shows all exercises from the last session in a toggle section, forcing the trainer to expand it, find the right exercise, memorize the numbers, then scroll back to the input field. This breaks the "speed above all" principle and pulls the trainer's attention away from the client.

**Core feature: Workout Logger**

## What Changes

- **Replace the collapsible last-session panel** with per-exercise inline history displayed directly above each exercise's input fields
- **Change the data query** from "all logs from the last completed session" to "last log for each specific exercise across all completed sessions for this client" — so history appears even for exercises that weren't in the immediately previous session
- **Format inline history by exercise type**: "Last: 5 sets × 10 reps @ 100 lbs" (weighted), "Last: 3 sets × 12 reps" (bodyweight), "Last: 10m 30s" (duration)
- **Show "First time" indicator** when an exercise has no prior history for this client
- No new dependencies or third-party services

## Capabilities

### New Capabilities

_None — this is a modification to an existing capability._

### Modified Capabilities

- `session-logging`: The "last session reference" requirement changes from a single collapsible panel showing all exercises from the last session, to per-exercise inline history labels sourced from each exercise's most recent completed log for this client.

## Impact

- **UI**: `SessionLoggingClient.tsx` — remove collapsible panel, add inline label per exercise card
- **Queries**: `queries.ts` — new query to fetch last completed log per exercise per client (replaces current last-session query)
- **Spec**: `session-logging/spec.md` — update the "Last session reference" requirement
- No schema changes, no new tables, no new routes
