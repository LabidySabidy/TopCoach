## 1. Server Actions — Clients

- [x] 1.1 Create `src/app/(dashboard)/clients/actions.ts` with a `createClient` server action that inserts a row into the `clients` table and calls `revalidatePath('/dashboard/clients')`
- [x] 1.2 Create `src/lib/supabase/queries.ts` with a `getClients` function that fetches all clients ordered by name, and a `getClientById` function that fetches a single client by ID

## 2. Clients List Page

- [x] 2.1 Create `src/app/(dashboard)/clients/page.tsx` as a Server Component that calls `getClients` and renders the list
- [x] 2.2 Create a `ClientCard` component in `src/components/clients/ClientCard.tsx` — shows client name and email, full-width tappable card linking to `/dashboard/clients/[id]`
- [x] 2.3 Add an empty state to the clients list page when no clients exist
- [x] 2.4 Create `src/components/clients/AddClientForm.tsx` as a Client Component with name, email, phone fields and a submit button wired to the `createClient` server action
- [x] 2.5 Add the `AddClientForm` to the clients list page behind a toggle button ("+ Add Client")

## 3. Client Profile Page

- [x] 3.1 Create `src/app/(dashboard)/clients/[id]/page.tsx` as a Server Component that calls `getClientById` and renders the client's details
- [x] 3.2 Show name, email, and phone on the profile page; show a "Client not found" message if the client doesn't exist
- [x] 3.3 Add a placeholder "Sessions" section at the bottom of the profile page ("No sessions yet")

## 4. Navigation

- [x] 4.1 Update `src/app/(dashboard)/dashboard/page.tsx` to include a link to `/dashboard/clients`
- [x] 4.2 Add a back link on the client profile page pointing to `/dashboard/clients`
