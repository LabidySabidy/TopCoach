## ADDED Requirements

### Requirement: Trainer can log in with email and password
The system SHALL provide a login screen where the trainer enters their email and password. On success, they are redirected to the dashboard. On failure, an error message is shown.

#### Scenario: Successful login
- **WHEN** the trainer enters valid credentials and submits the login form
- **THEN** a Supabase session is created and the trainer is redirected to the dashboard

#### Scenario: Invalid credentials
- **WHEN** the trainer enters an incorrect email or password
- **THEN** an error message is displayed and no session is created

#### Scenario: Empty form submission
- **WHEN** the trainer submits the login form without filling in both fields
- **THEN** client-side validation prevents submission and prompts the trainer to fill in the required fields

### Requirement: All routes except /login are protected by auth middleware
The system SHALL redirect any unauthenticated request to `/login`. Authenticated requests SHALL proceed to the requested route.

#### Scenario: Unauthenticated access to protected route
- **WHEN** a user with no active session navigates to any route other than `/login`
- **THEN** they are redirected to `/login`

#### Scenario: Authenticated access to protected route
- **WHEN** a user with a valid Supabase session navigates to any protected route
- **THEN** the requested page is rendered without redirection

#### Scenario: Authenticated user visits /login
- **WHEN** a trainer with an active session navigates to `/login`
- **THEN** they are redirected to the dashboard

### Requirement: Trainer can log out
The system SHALL provide a logout action that clears the Supabase session and redirects to `/login`.

#### Scenario: Successful logout
- **WHEN** the trainer triggers the logout action
- **THEN** the Supabase session is cleared and the trainer is redirected to `/login`

#### Scenario: After logout, protected routes are inaccessible
- **WHEN** the trainer logs out and then navigates to a protected route
- **THEN** they are redirected to `/login`
