## ADDED Requirements

### Requirement: Exercises are stored in a persistent database table
The system SHALL store exercises in an `exercises` table with columns for `id`, `name`, `muscle_group`, `is_custom`, and `created_at`. The `is_custom` flag SHALL be `false` for seeded exercises and `true` for trainer-added ones.

#### Scenario: Seeded exercises are present after migration
- **WHEN** the migration and seed SQL have been run
- **THEN** the `exercises` table contains at least 40 rows with `is_custom = false` covering major muscle groups (chest, back, legs, shoulders, arms, core, cardio)

#### Scenario: Trainer can add a custom exercise
- **WHEN** a new row is inserted into `exercises` with `is_custom = true`
- **THEN** the exercise is retrievable and appears alongside seeded exercises

### Requirement: Exercise library is accessible to the authenticated trainer
The system SHALL enforce Row Level Security on the `exercises` table allowing only authenticated reads and writes.

#### Scenario: Authenticated trainer can read all exercises
- **WHEN** an authenticated request queries the `exercises` table
- **THEN** all rows (seeded and custom) are returned

#### Scenario: Unauthenticated access is denied
- **WHEN** an unauthenticated request queries `exercises`
- **THEN** no rows are returned
