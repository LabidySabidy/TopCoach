## 1. Initialize Next.js Project

- [x] 1.1 Run `npx create-next-app@latest topcoach` with TypeScript, Tailwind, App Router, and `src/` directory options selected
- [x] 1.2 Remove boilerplate content from `src/app/page.tsx` and `src/app/globals.css`
- [x] 1.3 Verify `npm run dev` starts without errors on localhost:3000

## 2. Install Dependencies

- [x] 2.1 Install Supabase: `npm install @supabase/supabase-js @supabase/ssr`
- [x] 2.2 Install Stripe: `npm install stripe`
- [x] 2.3 Install Google APIs client: `npm install googleapis`

## 3. Environment Variables

- [x] 3.1 Create `.env.local` with keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`
- [x] 3.2 Create `.env.example` with the same keys but empty values and a comment describing each
- [x] 3.3 Confirm `.env.local` is listed in `.gitignore`

## 4. Supabase Project Setup

- [x] 4.1 Create a new Supabase project in the Supabase dashboard
- [x] 4.2 Copy the project URL and anon key into `.env.local`
- [x] 4.3 Copy the service role key into `.env.local`
- [x] 4.4 Create the trainer user account in Supabase Auth dashboard (Authentication → Users → Add user)

## 5. Supabase Client Helpers

- [x] 5.1 Create `src/lib/supabase/client.ts` — browser client using `createBrowserClient` from `@supabase/ssr`
- [x] 5.2 Create `src/lib/supabase/server.ts` — server client using `createServerClient` from `@supabase/ssr` with cookie handling
- [x] 5.3 Create `src/lib/supabase/middleware.ts` — helper that refreshes the session and returns updated cookies

## 6. Auth Middleware

- [x] 6.1 Create `middleware.ts` at project root that calls the Supabase middleware helper
- [x] 6.2 Configure the matcher to protect all routes except `/login`, `/_next`, and `/favicon.ico`
- [x] 6.3 Add redirect logic: unauthenticated → `/login`, authenticated visiting `/login` → `/dashboard`

## 7. Login Page

- [x] 7.1 Create `src/app/(auth)/login/page.tsx` with an email and password form
- [x] 7.2 Create a server action `src/app/(auth)/login/actions.ts` that calls `supabase.auth.signInWithPassword`
- [x] 7.3 On success, redirect to `/dashboard`; on failure, return and display an error message
- [x] 7.4 Style the login page with Tailwind — centered card, mobile-friendly, full-height layout

## 8. Protected Dashboard Layout

- [x] 8.1 Create `src/app/(dashboard)/layout.tsx` — shared layout for all protected routes
- [x] 8.2 Add a minimal nav/header with the app name "TopCoach" and a logout button
- [x] 8.3 Create `src/app/(dashboard)/dashboard/page.tsx` as a placeholder page ("Welcome to TopCoach")

## 9. Logout

- [x] 9.1 Create a server action for logout that calls `supabase.auth.signOut` and redirects to `/login`
- [x] 9.2 Wire the logout button in the dashboard layout to the logout action

## 10. SDK Stub Files

- [x] 10.1 Create `src/lib/stripe.ts` — exports a Stripe instance initialized with `process.env.STRIPE_SECRET_KEY`
- [x] 10.2 Create `src/lib/google-calendar.ts` — exports a Google OAuth2 client configured with `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN`

## 11. Shared Types

- [x] 11.1 Create `src/types/index.ts` with TypeScript interfaces for `Client`, `Session`, `Exercise`, and `SessionLog` matching the data model

## 12. Vercel Deployment

- [x] 12.1 Push the project to a new GitHub repository
- [x] 12.2 Create a new Vercel project and link it to the GitHub repo
- [x] 12.3 Add all environment variables from `.env.local` to the Vercel project settings
- [x] 12.4 Trigger a deployment and confirm the production URL loads the login page
