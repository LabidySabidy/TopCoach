## MODIFIED Requirements

### Requirement: Sessions have a status field
The system SHALL add a `status` column (text, default `'active'`) to the `sessions` table via a new database migration. Valid values are `'active'` (in progress) and `'completed'`.

#### Scenario: New session starts as active
- **WHEN** a new session is created
- **THEN** the session record has status `active`

#### Scenario: Completed session is marked done
- **WHEN** the trainer completes a session
- **THEN** the session status is updated to `completed`

#### Scenario: Client profile distinguishes active and completed sessions
- **WHEN** the client profile renders the sessions list
- **THEN** active sessions are visually distinct from completed sessions
