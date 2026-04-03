## ADDED Requirements

### Requirement: Sessions are stored in a persistent database table
The system SHALL store sessions in a `sessions` table with columns for `id`, `client_id` (foreign key to `clients`), `date`, `time`, `notes`, `google_calendar_event_id`, `stripe_invoice_id`, and `created_at`. Only `client_id` and `date` are required.

#### Scenario: Session record exists after creation
- **WHEN** a session row is inserted with a valid `client_id` and `date`
- **THEN** the row is retrievable and linked to the correct client

#### Scenario: Calendar and invoice IDs are nullable
- **WHEN** a session is created before a calendar invite or invoice is sent
- **THEN** `google_calendar_event_id` and `stripe_invoice_id` are stored as NULL without error

#### Scenario: Deleting a client cascades to their sessions
- **WHEN** a client row is deleted
- **THEN** all session rows with that `client_id` are also deleted

### Requirement: Session data is only accessible to the authenticated trainer
The system SHALL enforce Row Level Security on the `sessions` table.

#### Scenario: Authenticated access is permitted
- **WHEN** an authenticated request queries `sessions`
- **THEN** the matching rows are returned

#### Scenario: Unauthenticated access is denied
- **WHEN** an unauthenticated request queries `sessions`
- **THEN** no rows are returned

### Requirement: Sessions have a status field
The system SHALL track session status (`active` or `completed`) so the trainer can distinguish in-progress sessions from finished ones.

#### Scenario: New session starts as active
- **WHEN** a new session is created
- **THEN** the session record has status `active`

#### Scenario: Completed session is marked done
- **WHEN** the trainer taps "Complete Session"
- **THEN** the session status is updated to `completed`

### Requirement: Trainer can resume or cancel an in-progress session
The system SHALL present a resume/cancel prompt when navigating to an active session that already has logged data.

#### Scenario: Resume prompt appears for active sessions with data
- **WHEN** the trainer navigates to an active session that has at least one exercise logged
- **THEN** a bottom sheet shows the logged exercises dimmed with "Resume Session" and "Cancel Session" buttons

#### Scenario: Cancel deletes the session
- **WHEN** the trainer taps "Cancel Session"
- **THEN** the session and all its logs are deleted and the trainer is redirected to the client profile
