## Context

There is no existing codebase. This change creates the TopCoach project from scratch. The app is internal tooling for a single personal trainer — not a multi-tenant SaaS. It needs to be fast to set up, cheap to run, and easy to maintain by one developer.

The three integrations (Supabase, Stripe, Google Calendar) all require API keys and OAuth credentials that must be configured as environment variables before any feature code can be written.

## Goals / Non-Goals

**Goals:**
- Scaffold a Next.js 14 App Router project with TypeScript
- Install and configure Tailwind CSS with a sensible mobile-first base
- Set up Supabase client for both browser and server (using `@supabase/ssr`)
- Implement a simple auth gate — trainer logs in once, all routes are protected
- Install Stripe and Google Calendar SDKs with placeholder env vars
- Establish a clean folder structure that scales to the 3 MVP features
- Get a working skeleton deployed to Vercel

**Non-Goals:**
- Any feature UI or business logic (that is for subsequent changes)
- Supabase database schema/migrations (separate change)
- Stripe or Google Calendar API calls (separate changes)
- CI/CD pipeline beyond Vercel's default git integration

## Decisions

### 1. Next.js App Router over Pages Router
App Router is the current standard and supports React Server Components, which lets us fetch Supabase data server-side without extra API routes. Better long-term, minimal overhead for this project size.

### 2. Supabase Auth over custom auth
Supabase Auth handles password hashing, sessions, and JWT refresh automatically. For a single-user app the setup is minimal: create one user in the Supabase dashboard, done. No need to build auth from scratch.

### 3. `@supabase/ssr` for cookie-based sessions
Using `@supabase/ssr` (not the legacy `auth-helpers`) ensures the auth session works correctly in both Server Components and Client Components via cookies. This is the current Supabase-recommended approach for Next.js App Router.

### 4. Route protection via middleware
A single `middleware.ts` file at the project root checks for a valid Supabase session on every request. Unauthenticated requests redirect to `/login`. This is simpler and more reliable than protecting each route individually.

### 5. Folder structure
```
src/
  app/
    (auth)/
      login/page.tsx
    (dashboard)/
      layout.tsx          ← protected layout
      clients/page.tsx
      sessions/page.tsx
      workout/page.tsx
  components/
    ui/                   ← reusable primitives (buttons, inputs, cards)
  lib/
    supabase/
      client.ts           ← browser client
      server.ts           ← server client
    stripe.ts             ← stripe instance
    google-calendar.ts    ← google calendar client
  types/
    index.ts              ← shared TypeScript types
middleware.ts
```

Route groups `(auth)` and `(dashboard)` keep login outside the protected layout without affecting URLs.

### 6. Vercel for deployment
Free tier covers this project easily. Native Next.js support, environment variable management UI, and automatic preview deployments on push. No configuration needed beyond `vercel link`.

### 7. Environment variables
All secrets live in `.env.local` (gitignored) locally and in Vercel's environment variable dashboard for production. A `.env.example` file will be committed to document required variables without exposing values.

## Risks / Trade-offs

- **Google OAuth setup complexity** → Mitigation: For this base setup change we only install the SDK and stub the client. The full OAuth flow (getting a refresh token) is handled in a dedicated Google Calendar integration change later.
- **Supabase free tier limits** → For 1 trainer and ~10 clients the free tier is more than sufficient. Not a real risk.
- **Tailwind v4 breaking changes** → Stick with Tailwind v3 (stable, well-documented) unless there's a reason to upgrade. Avoids unexpected config changes.

## Migration Plan

1. Run `create-next-app` with TypeScript and Tailwind options
2. Install additional dependencies
3. Create Supabase project in dashboard, copy URL and anon key
4. Wire up `@supabase/ssr` client helpers and middleware
5. Create the folder structure and stub files
6. Create `.env.example` and `.env.local`
7. Run locally to confirm auth gate works
8. Deploy to Vercel, add env vars in dashboard
9. Confirm production login works

Rollback: this is a greenfield project — nothing to roll back to.

## Open Questions

- Does the trainer already have a Supabase account, or does one need to be created?
- Does the trainer already have a Vercel account?
- Does the trainer have a Google Cloud project set up for the Calendar API? (Not needed now, but needed before the calendar integration change)
