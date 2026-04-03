## ADDED Requirements

### Requirement: Clients are stored in a persistent database table
The system SHALL store client records in a `clients` table in Supabase with columns for `id`, `name`, `email`, `phone`, and `created_at`. All fields except `phone` are required.

#### Scenario: Client record exists after creation
- **WHEN** a valid client row is inserted into the `clients` table
- **THEN** the row is retrievable with the correct `id`, `name`, `email`, and `created_at` values

#### Scenario: Phone is optional
- **WHEN** a client row is inserted without a `phone` value
- **THEN** the insert succeeds and `phone` is stored as NULL

### Requirement: Client data is only accessible to the authenticated trainer
The system SHALL enforce Row Level Security on the `clients` table so that unauthenticated requests cannot read or write client data.

#### Scenario: Authenticated access is permitted
- **WHEN** a request with a valid Supabase session reads from `clients`
- **THEN** the rows are returned

#### Scenario: Unauthenticated access is denied
- **WHEN** a request with no session attempts to read from `clients`
- **THEN** no rows are returned and no error exposes data
