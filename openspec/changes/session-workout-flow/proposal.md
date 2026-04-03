## Why

The workout logger is the core reason TopCoach exists. The trainer needs to open the app during a live session, log exercises with sets/reps/weight, reference past performance, and then complete the session with a smooth handoff to scheduling and payment. This change builds the entire session lifecycle end to end.

## What Changes

- Add "Start Session" button to the client profile page — creates a session record and enters the logging screen
- Build the workout logging screen — multiselect exercises from the library, log sets/reps/weight per exercise, show last session's date and exercises as a reference panel
- Add "Complete Session" button — marks session as done and triggers the post-session flow
- Post-session Prompt 1 — "Schedule next session?" — trainer picks date and time, app creates a Google Calendar event with the client as attendee (Google sends the invite email automatically); trainer can skip
- Post-session Prompt 2 — "Send payment?" — shows session summary, fixed price (from SESSION_PRICE env var) with optional tip, generates a Stripe Payment Link, displays it as a tappable/copyable link and a "Send to email" button; trainer can skip
- Add SESSION_PRICE to environment variables

## Capabilities

### New Capabilities

- `session-logging`: Trainer can start a session for a client, select exercises from the library, and log sets/reps/weight; last session data is shown for reference
- `session-completion`: Trainer completes a session triggering two optional post-session prompts
- `calendar-invite`: After session completion, trainer can schedule the next session which sends a Google Calendar invite to the client's email
- `stripe-payment`: After session completion, trainer can generate a Stripe Payment Link with optional tip and send it to the client or share it in person

### Modified Capabilities

- `session-management`: Sessions now have a status field (active / completed) and the session creation is triggered from the client profile UI
- `client-management-ui`: Client profile page gains a "Start Session" button and the sessions placeholder is replaced with a real sessions history list

## Impact

- New routes: `/sessions/[id]` (logging screen), `/sessions/[id]/complete` (post-session flow)
- New env var: `SESSION_PRICE` (e.g. "75")
- New Stripe API call: `stripe.paymentLinks.create`
- New Google Calendar API call: `calendar.events.insert`
- Touches all 3 core features: workout logger, Stripe payments, Google Calendar
