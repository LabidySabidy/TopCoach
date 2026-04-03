## Context

The database schema and auth are in place. This is the first feature UI change. All data access goes through Supabase server clients and Next.js server actions — no client-side fetch calls. The UI must be mobile-first and fast to navigate on a tablet or phone.

## Goals / Non-Goals

**Goals:**
- Clients list page with name, email, tap to profile
- Add client form with name (required), email (required), phone (optional)
- Client profile page showing details and a placeholder session history section
- Server actions for create and list operations on the `clients` table
- Dashboard home links to clients list

**Non-Goals:**
- Edit or delete client (can be added later)
- Client search or filtering (only ~10 clients, not needed)
- Session history UI on the profile page (built in a later change)
- Pagination (10 clients max, not needed)

## Decisions

### 1. Server Components for data fetching
The clients list and profile pages fetch data in Server Components using the Supabase server client. No loading spinners or useEffect — data is ready when the page renders. Faster on mobile.

### 2. Server Actions for mutations
Adding a client uses a Next.js server action. On success, `revalidatePath` refreshes the clients list. On error, the form shows an inline message. No separate API route needed.

### 3. Add client form inline on the clients list page
Rather than a separate `/clients/new` route, the add form sits at the bottom of the clients list page behind an "Add Client" button that toggles its visibility. Keeps navigation simple on mobile — one tap to add.

### 4. Route structure
```
/dashboard/clients              → clients list + add form
/dashboard/clients/[id]         → client profile
```
Both sit inside the existing `(dashboard)` layout so the nav header is inherited automatically.

### 5. Mobile-first layout
- Clients list: full-width cards, large tap targets, name prominent, email secondary
- Add form: stacked fields, full-width inputs, large submit button
- Profile page: name as heading, details below, session history section placeholder at bottom

## Risks / Trade-offs

- **No edit/delete yet** → The profile page will show client details read-only for now. This is fine — the trainer sets up clients once and rarely changes them.
- **Inline form toggle** → Uses a Client Component wrapper for the show/hide toggle. Minimal JS, acceptable.
