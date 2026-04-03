## MODIFIED Requirements

### Requirement: Clients are stored in a persistent database table
The system SHALL store client records in a `clients` table in Supabase with columns for `id`, `name`, `email`, `phone`, and `created_at`. All fields except `phone` are required. The system SHALL return clients ordered by `name` ascending when listing all clients.

#### Scenario: Client record exists after creation
- **WHEN** a valid client row is inserted into the `clients` table
- **THEN** the row is retrievable with the correct `id`, `name`, `email`, and `created_at` values

#### Scenario: Phone is optional
- **WHEN** a client row is inserted without a `phone` value
- **THEN** the insert succeeds and `phone` is stored as NULL

#### Scenario: Clients list is ordered by name
- **WHEN** the clients table is queried for all rows
- **THEN** rows are returned ordered alphabetically by `name` ascending
