## ADDED Requirements

### Requirement: Workout data is stored in a persistent session_logs table
The system SHALL store workout log entries in a `session_logs` table with columns for `id`, `session_id` (foreign key to `sessions`), `exercise_id` (foreign key to `exercises`), `sets`, `reps`, `weight`, `notes`, and `created_at`. Only `session_id` and `exercise_id` are required.

#### Scenario: Log entry is created for an exercise in a session
- **WHEN** a `session_logs` row is inserted with a valid `session_id` and `exercise_id`
- **THEN** the row is retrievable and linked to both the session and exercise

#### Scenario: Sets, reps, and weight are optional
- **WHEN** a log entry is inserted without `sets`, `reps`, or `weight`
- **THEN** the insert succeeds with those columns stored as NULL

#### Scenario: Deleting a session cascades to its logs
- **WHEN** a session row is deleted
- **THEN** all `session_logs` rows with that `session_id` are also deleted

### Requirement: Previous session log data is queryable for reference
The system SHALL allow querying `session_logs` by `exercise_id` and `session_id` to retrieve past performance numbers for a given client and exercise.

#### Scenario: Last session's numbers are queryable
- **WHEN** the trainer starts a new session for a client
- **THEN** the most recent `session_logs` rows for each exercise (from the client's previous session) can be retrieved by joining `sessions` and `session_logs` on `client_id`

### Requirement: Workout log data is only accessible to the authenticated trainer
The system SHALL enforce Row Level Security on the `session_logs` table.

#### Scenario: Authenticated access is permitted
- **WHEN** an authenticated request queries `session_logs`
- **THEN** the matching rows are returned

#### Scenario: Unauthenticated access is denied
- **WHEN** an unauthenticated request queries `session_logs`
- **THEN** no rows are returned
