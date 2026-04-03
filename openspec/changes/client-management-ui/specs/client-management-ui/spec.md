## ADDED Requirements

### Requirement: Trainer can view a list of all clients
The system SHALL display all clients from the `clients` table on a `/dashboard/clients` page, ordered alphabetically by name. Each client entry SHALL show their name and email and be tappable to navigate to their profile.

#### Scenario: Clients list shows all clients
- **WHEN** the trainer navigates to `/dashboard/clients`
- **THEN** all clients stored in the database are displayed ordered by name

#### Scenario: Empty state when no clients exist
- **WHEN** the trainer navigates to `/dashboard/clients` and no clients exist
- **THEN** a message is shown prompting them to add their first client

#### Scenario: Tapping a client navigates to their profile
- **WHEN** the trainer taps a client row
- **THEN** they are navigated to `/dashboard/clients/[id]` for that client

### Requirement: Trainer can add a new client
The system SHALL provide an add client form on the clients list page with fields for name (required), email (required), and phone (optional). On successful submission the new client SHALL appear in the list.

#### Scenario: Successful client creation
- **WHEN** the trainer submits the add client form with a valid name and email
- **THEN** the client is saved to the `clients` table and appears in the list

#### Scenario: Form validation prevents empty name or email
- **WHEN** the trainer submits the form without a name or email
- **THEN** the form shows a validation error and does not submit

#### Scenario: Phone is optional
- **WHEN** the trainer submits the form without a phone number
- **THEN** the client is created successfully with phone stored as null

### Requirement: Trainer can view a client's profile page
The system SHALL display a client profile page at `/dashboard/clients/[id]` showing the client's name, email, and phone. The page SHALL include a placeholder section for session history.

#### Scenario: Profile shows correct client details
- **WHEN** the trainer navigates to `/dashboard/clients/[id]`
- **THEN** the page displays the correct name, email, and phone for that client

#### Scenario: Invalid client ID returns not found
- **WHEN** the trainer navigates to `/dashboard/clients/[id]` with a non-existent ID
- **THEN** a not-found message is displayed
