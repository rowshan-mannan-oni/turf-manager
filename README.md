# Turf Manager

A football/turf management app for friend groups, built with Next.js, React,
TypeScript, Tailwind CSS, Supabase, and Vercel.

The product requirements are in [Plan.md](./Plan.md). This README covers the
Phase 0 local setup and first deployment.

## What is already set up

- Next.js App Router + TypeScript + Tailwind CSS
- Supabase browser/server client helpers
- A health check at `/api/health`
- An initial Supabase Auth profile migration with Row Level Security (RLS)
- A responsive starter home page

## 1. Run the app locally

Prerequisite: Node.js 20.9 or newer.

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>. Open <http://localhost:3000/api/health> and you
should initially see `supabase: "not_configured"`; that is expected until the
next steps are complete.

Stop the dev server with `Ctrl+C` before changing environment variables.

## 2. Create the free Supabase project

1. Go to <https://supabase.com/dashboard> and sign in.
2. Click **New project**.
3. Select your organization, enter a project name such as `turf-manager`, and
   choose the **Free** plan.
4. Create a strong database password and save it somewhere safe. The Next.js app
   does not need this password.
5. Choose the region closest to you and click **Create new project**.
6. Wait for project provisioning to finish.

## 3. Apply the authentication and RLS migration

1. In the Supabase dashboard, open **SQL Editor**.
2. Click **New query**.
3. Open [`supabase/migrations/20261101000000_initial_auth_profiles.sql`](./supabase/migrations/20261101000000_initial_auth_profiles.sql)
   in this project, copy its entire contents, and paste it into the SQL Editor.
4. Click **Run**. It should finish with **Success**.
5. Open **Table Editor** and confirm that the `profiles` table exists.

This creates a profile automatically whenever an Auth user is created. RLS
allows signed-in users to read and update only their own profile.

## 4. Add the Supabase keys locally

1. In Supabase, open **Project Settings → API** (the exact label may be
   **Settings → API Keys**).
2. Copy the **Project URL**.
3. Copy the **Publishable key**. If your project shows legacy keys, the **anon
   public** key also works. Do **not** use the secret `service_role` key.
4. In the project folder, create your local environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

5. Open `.env.local` and replace both placeholder values:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   ```

6. Save the file. `.env.local` is ignored by Git; never send your real keys to
   anyone or commit them.

## 5. Verify the Supabase connection

```powershell
npm run dev
```

Open <http://localhost:3000/api/health>. The expected response is:

```json
{ "status": "ok", "supabase": "connected" }
```

If it returns `connection_failed`, check that you copied the correct project
URL/key and successfully ran the migration, then restart the dev server.

## 6. Run local quality checks

```powershell
npm run lint
npm run typecheck
npm run build
```

All three should pass before deployment.

## 7. Put the project on GitHub

Vercel's simplest free deployment workflow imports a GitHub repository.

1. Create a new empty repository at <https://github.com/new>. Do not add a
   README, license, or `.gitignore` there because this project already has them.
2. In this project folder, run the following commands. Replace the remote URL
   with your repository URL:

   ```powershell
   git init
   git add .
   git commit -m "Set up Turf Manager"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

Confirm that `.env.local`, `node_modules`, and `.next` are **not** shown on
GitHub.

## 8. Deploy free on Vercel

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. Import the `turf-manager` repository.
3. Vercel should detect **Next.js** automatically. Leave the build command as
   `npm run build` and the output settings at their defaults.
4. Expand **Environment Variables** and add these two variables for Production
   (and Preview if offered):

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your publishable or anon public key |

5. Click **Deploy** and wait for the deployment to finish.
6. Open the Vercel URL, then open `/api/health` on that URL. You should see
   `supabase: "connected"`.

Phase 0 is complete when both the home page and health check work on Vercel.
Every later push to the GitHub `main` branch will trigger a new deployment.
