## Context

Client management is in place. The database has sessions and session_logs tables. Stripe SDK and Google Calendar client are stubbed. This change wires everything together into the core training session experience.

## Goals / Non-Goals

**Goals:**
- Full session lifecycle: create → log → complete → schedule → pay
- Fast exercise logging — minimal taps, large inputs, mobile-first
- Last session reference visible during logging without leaving the screen
- Post-session prompts as a sequential step-by-step flow (not modals stacked on top of each other)
- Stripe Payment Link generated server-side, displayed as a link + send-to-email button
- Google Calendar event created server-side via OAuth refresh token

**Non-Goals:**
- Editing a completed session's logs
- Deleting individual log entries mid-session (can be added later)
- Push notifications or reminders
- Multiple price tiers or per-client pricing (single global SESSION_PRICE env var)
- QR code generation

## Decisions

### 1. Session status column
Add a `status` column (`text`, default `'active'`) to the `sessions` table via a new migration. Values: `'active'` (in progress) and `'completed'`. This lets the client profile distinguish past sessions from the current one.

### 2. Route structure
```
/sessions/[id]            → workout logging screen
/sessions/[id]/complete   → post-session flow (schedule + payment prompts)
```
Sessions live outside the `(dashboard)` layout because the logging screen needs a full-screen distraction-free layout on mobile. A minimal header with session info and a "Complete" button is sufficient.

### 3. Logging screen layout (mobile-first)
- Top: client name + session date + "Complete Session" button
- Middle: selected exercises with set/rep/weight inputs per exercise
- Bottom: "Add Exercises" button opens a multiselect sheet from the library
- Right panel (tablet) or collapsible section (phone): last session reference card

### 4. Exercise multiselect
A Client Component that fetches all exercises, groups them by muscle group, and allows multiple selections. On confirm, the selected exercises appear as logging cards on the session screen. Each card has inputs for sets, reps, and weight. Logs are saved to `session_logs` on every blur/change (optimistic — no save button needed).

### 5. Last session reference
Fetched server-side when the logging screen loads. Queries the most recent completed session for this client, joins session_logs + exercises, and passes it as a prop. Displayed as a compact read-only card: date, then each exercise with its logged numbers.

### 6. Post-session flow — sequential prompts
`/sessions/[id]/complete` is a Client Component that steps through two prompts in sequence using local state:
- Step 1: Schedule next session (date + time pickers → server action → Google Calendar)
- Step 2: Payment (price display + tip input → server action → Stripe Payment Link → display link + send email button)
Each step has a "Skip" option. After both steps (or skips), redirect to client profile.

### 7. Stripe Payment Link
Generated via `stripe.paymentLinks.create` with a one-time `price_data` inline item for the session amount + tip. The link URL is stored on the session record (`stripe_invoice_id` column reused as `stripe_payment_link`). Displayed as a large tappable link. "Send to email" triggers a second server action that emails the link via Stripe's customer email (using `stripe.customers.create` or find + `stripe.paymentLinks` share — or simply mailto as a fallback since Stripe handles delivery via the payment link itself).

### 8. Google Calendar event
Created via `calendar.events.insert` with:
- `summary`: "Training Session — [Client Name]"
- `start` / `end`: trainer-selected date + time, 1 hour duration default
- `attendees`: client email (Google sends the invite automatically)
- Event ID stored in `sessions.google_calendar_event_id`

### 9. SESSION_PRICE env var
Added to `.env.local` and Vercel. Read server-side only (`process.env.SESSION_PRICE`). Parsed as a number in cents for Stripe (e.g. `"7500"` = $75.00). Displayed in dollars in the UI.

## Risks / Trade-offs

- **Logs saved on blur** → if the trainer closes the browser mid-session, partially entered data may be lost for the current input. Acceptable — they can re-enter on the next session.
- **Stripe Payment Link vs Invoice** → Payment Links are simpler (no customer record required) but less formal than invoices. Fine for MVP.
- **Google Calendar OAuth refresh token** → if the token expires (rare but possible), calendar invites will silently fail. The UI should show a clear error rather than crashing. Mitigation: wrap the calendar call in try/catch and show "Calendar invite failed — send manually" with the session details.
- **`stripe_invoice_id` column repurposed** → renamed conceptually to store payment link URL. Column name stays the same in the DB for now; can migrate later.
