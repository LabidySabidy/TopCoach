## ADDED Requirements

### Requirement: Trainer can start a new session for a client
The system SHALL create a new session record with status `active` when the trainer taps "Start Session" on the client profile, then navigate to the logging screen at `/sessions/[id]`.

#### Scenario: Session is created and trainer lands on logging screen
- **WHEN** the trainer taps "Start Session" on a client profile
- **THEN** a new session row is inserted with the client_id, today's date, and status `active`, and the trainer is redirected to `/sessions/[id]`

### Requirement: Trainer can select exercises from the library for the session
The system SHALL provide a multiselect interface grouped by muscle group allowing the trainer to add exercises to the current session. Selected exercises SHALL appear as logging cards on the session screen.

#### Scenario: Exercises are added to the session
- **WHEN** the trainer selects exercises and confirms
- **THEN** the selected exercises appear as individual logging cards on the session screen

#### Scenario: Exercises are grouped by muscle group
- **WHEN** the exercise picker is opened
- **THEN** exercises are displayed grouped by muscle group (Chest, Back, Legs, etc.)

### Requirement: Trainer can log sets, reps, and weight per exercise
The system SHALL display an input card per selected exercise with fields for sets, reps, and weight. Entries SHALL be saved to `session_logs` automatically without a manual save button.

#### Scenario: Log entry is saved
- **WHEN** the trainer enters values for sets, reps, or weight on an exercise card
- **THEN** a session_log row is created or updated for that exercise in this session

### Requirement: Last session reference is shown during logging
The system SHALL display a read-only reference panel showing the most recent completed session for this client — including the session date and each exercise logged with its sets/reps/weight.

#### Scenario: Last session data is visible
- **WHEN** the trainer opens the logging screen for a client who has at least one prior completed session
- **THEN** a reference panel shows the last session's date and exercise log entries

#### Scenario: No prior session reference
- **WHEN** the trainer opens the logging screen for a client with no prior completed sessions
- **THEN** the reference panel shows a message indicating this is the first session
