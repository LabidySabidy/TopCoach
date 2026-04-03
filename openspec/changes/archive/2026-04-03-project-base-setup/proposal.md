## Why

TopCoach needs a working Next.js project foundation before any features can be built. This change establishes the base project with all core dependencies installed, Supabase connected, Tailwind configured, and a folder structure that supports the three MVP features.

## What Changes

- Initialize a new Next.js 14 project (App Router, TypeScript)
- Install and configure Tailwind CSS with mobile-first base styles
- Install and connect Supabase client (auth + database)
- Install Stripe SDK and set up environment variable placeholders
- Install Google Calendar API client and set up environment variable placeholders
- Create base folder structure for routes, components, and lib utilities
- Set up a single-user auth gate (Supabase Auth — email/password login)
- Deploy skeleton to Vercel with environment variables configured

## Capabilities

### New Capabilities

- `project-foundation`: Base Next.js app with Supabase, Tailwind, Stripe SDK, and Google Calendar SDK installed and wired together via environment variables
- `trainer-auth`: Single-user login screen — trainer authenticates with email and password via Supabase Auth; all routes protected behind auth gate

### Modified Capabilities

- none

## Impact

- New third-party dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `stripe`, `googleapis`, `tailwindcss`
- Requires new environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`
- Sets up the Vercel project and links it to the repo
- This change touches all 3 core features at the infrastructure level (no feature logic yet, just SDK installation and config)
