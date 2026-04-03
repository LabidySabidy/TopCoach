## 1. Database Migration

- [x] 1.1 Create migration `003_session_status.sql` adding `status` column (text, default `'active'`) to sessions table
- [ ] 1.2 Run migration against Supabase (apply and confirm schema updated) ← MANUAL STEP

## 2. Environment Variables

- [x] 2.1 Add `SESSION_PRICE` (e.g. `"7500"` for $75.00) to `.env.local`
- [x] 2.2 Add `STRIPE_SECRET_KEY` to `.env.local`
- [x] 2.3 Document required env vars in comments within `.env.local`

## 3. Database Queries

- [x] 3.1 Add `createSession(clientId: string)` query to `src/lib/supabase/queries.ts`
- [x] 3.2 Add `completeSession(sessionId: string)` query to update status to `completed`
- [x] 3.3 Add `getSessionById(sessionId: string)` query joining sessions + client
- [x] 3.4 Add `getSessionLogs(sessionId: string)` query joining session_logs + exercises
- [x] 3.5 Add `getLastCompletedSession(clientId: string)` query returning most recent completed session with its logs
- [x] 3.6 Add `getSessionsByClientId(clientId: string)` query ordered by date descending
- [x] 3.7 Add `upsertSessionLog(sessionId, exerciseId, sets, reps, weight)` query for auto-save

## 4. Types

- [x] 4.1 Update `Session` type in `src/types/index.ts` to include `status` field
- [x] 4.2 Add `SessionWithLogs` type for last session reference panel data

## 5. Client Profile Updates

- [x] 5.1 Add `startSessionAction` server action to `src/app/(dashboard)/clients/actions.ts` — creates session, returns new session id
- [x] 5.2 Add "Start Session" button to `src/app/(dashboard)/clients/[id]/page.tsx` that calls the action and redirects to `/sessions/[id]`
- [x] 5.3 Replace sessions placeholder on client profile with real sessions list using `getSessionsByClientId`

## 6. Session Logging Screen

- [x] 6.1 Create route directory `src/app/sessions/[id]/` (outside dashboard layout for full-screen)
- [x] 6.2 Create `src/app/sessions/[id]/page.tsx` — Server Component fetching session, client, and last completed session data
- [x] 6.3 Create `src/app/sessions/[id]/SessionLoggingClient.tsx` — Client Component with exercise cards, auto-save on blur, last session reference panel
- [x] 6.4 Create `src/app/sessions/[id]/ExercisePicker.tsx` — Client Component multiselect sheet grouped by muscle group
- [x] 6.5 Create `src/app/sessions/[id]/actions.ts` — `saveSessionLogAction` server action for auto-saving log entries
- [x] 6.6 Create `src/app/sessions/[id]/layout.tsx` — minimal full-screen layout (no dashboard nav)

## 7. Complete Session

- [x] 7.1 Add "Complete Session" button to `SessionLoggingClient.tsx` calling `completeSessionAction`
- [x] 7.2 Add `completeSessionAction` to `src/app/sessions/[id]/actions.ts` — updates status to completed, redirects to `/sessions/[id]/complete`

## 8. Post-Session Flow — Schedule Next Session

- [x] 8.1 Create `src/app/sessions/[id]/complete/page.tsx` — Client Component with local step state (step 1: schedule, step 2: payment)
- [x] 8.2 Create `src/app/sessions/[id]/complete/actions.ts` — `scheduleNextSessionAction` server action calling Google Calendar API
- [x] 8.3 Implement Step 1 UI: date + time pickers, "Schedule" button, "Skip" button
- [x] 8.4 Handle Google Calendar error gracefully — show "Calendar invite failed — send manually" with session details

## 9. Post-Session Flow — Stripe Payment

- [x] 9.1 Add `sendPaymentAction` server action to `src/app/sessions/[id]/complete/actions.ts` — calls `stripe.paymentLinks.create` with session price + tip, stores link URL on session record
- [x] 9.2 Implement Step 2 UI: price display (SESSION_PRICE in dollars), tip input, "Generate Payment Link" button, "Skip" button
- [x] 9.3 After link generated: display as large tappable/copyable link and a "Send to email" button
- [x] 9.4 After both steps complete or skipped: redirect to client profile

## 10. Vercel Environment Variables

- [ ] 10.1 Add `SESSION_PRICE` to Vercel project environment variables ← MANUAL STEP
- [ ] 10.2 Add `STRIPE_SECRET_KEY` to Vercel project environment variables ← MANUAL STEP
