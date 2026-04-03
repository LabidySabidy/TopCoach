## Why

The trainer needs to manage their client roster before any other feature can work — sessions, workout logs, invoices, and calendar invites all require a client to exist first. This change builds the client management screens: a list of all clients, a form to add a new client, and a client profile page that will serve as the entry point to that client's sessions and workout history.

## What Changes

- Add a clients list page at `/dashboard/clients` — shows all clients with name, email, and a link to their profile
- Add an "Add Client" form (inline or modal) — name, email, phone fields with validation
- Add a client profile page at `/dashboard/clients/[id]` — shows client details and a placeholder for their session history
- Add server actions for creating and fetching clients via Supabase
- Update the dashboard home page to link to the clients list

## Capabilities

### New Capabilities

- `client-management-ui`: Trainer can view their client list, add a new client, and navigate to a client's profile page

### Modified Capabilities

- `client-management`: Add UI-level requirement — the clients list SHALL display clients ordered by name; the add client form SHALL validate that name and email are present before submitting

## Impact

- New routes: `/dashboard/clients`, `/dashboard/clients/[id]`
- New server actions for Supabase CRUD on the `clients` table
- Touches the client-management core feature only
- No new dependencies
