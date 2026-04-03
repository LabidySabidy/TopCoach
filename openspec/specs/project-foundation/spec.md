## ADDED Requirements

### Requirement: Next.js project is initialized with required dependencies
The system SHALL be a Next.js 14 App Router project with TypeScript, Tailwind CSS, Supabase, Stripe SDK, and Google Calendar SDK installed and accessible via environment variables.

#### Scenario: Project runs locally
- **WHEN** the developer runs `npm run dev`
- **THEN** the app starts without errors on localhost:3000

#### Scenario: Required environment variables are documented
- **WHEN** a developer clones the repo
- **THEN** a `.env.example` file exists listing all required environment variable keys with descriptions and no real values

#### Scenario: Tailwind styles are applied
- **WHEN** a Tailwind utility class is added to any component
- **THEN** the style is reflected in the browser without additional configuration

### Requirement: Supabase client is available for both server and browser contexts
The system SHALL provide a Supabase client configured for server-side use (Server Components, API routes) and a separate client for browser-side use (Client Components), both using the same environment variables.

#### Scenario: Server client is importable
- **WHEN** a Server Component imports `@/lib/supabase/server`
- **THEN** it receives a Supabase client with the service role or anon key, using cookie-based session handling via `@supabase/ssr`

#### Scenario: Browser client is importable
- **WHEN** a Client Component imports `@/lib/supabase/client`
- **THEN** it receives a Supabase client using the public anon key

### Requirement: Stripe and Google Calendar SDK clients are stubbed and importable
The system SHALL export a configured Stripe instance and a Google Calendar API client from `@/lib/stripe` and `@/lib/google-calendar` respectively, ready for use in future feature changes.

#### Scenario: Stripe instance is importable
- **WHEN** any server-side file imports `@/lib/stripe`
- **THEN** it receives a Stripe instance initialized with `STRIPE_SECRET_KEY`

#### Scenario: Google Calendar client is importable
- **WHEN** any server-side file imports `@/lib/google-calendar`
- **THEN** it receives a Google API auth client configured with `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN`

### Requirement: Project is deployed to Vercel and accessible via URL
The system SHALL be deployed to Vercel with all environment variables configured, returning a 200 response at the root URL.

#### Scenario: Production deployment is live
- **WHEN** a request is made to the Vercel production URL
- **THEN** the app responds with a 200 status code (either the login page or dashboard)
