## MODIFIED Requirements

### Requirement: Client profile has a "Start Session" button
The system SHALL display a "Start Session" button on the client profile page that creates a new active session and navigates to the logging screen.

#### Scenario: Start Session button triggers session creation
- **WHEN** the trainer taps "Start Session" on the client profile
- **THEN** a new session record is inserted with the client_id, today's date, and status `active`, and the trainer is redirected to `/sessions/[id]`

### Requirement: Client profile shows a real sessions history list
The system SHALL replace the sessions placeholder on the client profile with a real list of past sessions ordered by date descending, showing the date and status of each session.

#### Scenario: Sessions list shows completed sessions
- **WHEN** the client has one or more completed sessions
- **THEN** the sessions list displays each session's date and a "Completed" badge, ordered most recent first

#### Scenario: Sessions list shows empty state
- **WHEN** the client has no sessions
- **THEN** a message indicates no sessions have been logged yet
