# Lazymate / Resume Website

This is my personal portfolio and resume site. It started as a straightforward resume website, but the finished version is closer to a small full-stack portfolio app: a polished landing page, project showcase, about/CV section, a logged-in code playground, newsletter signup, and a small "buy me a coffee" support flow.

The core build is done for now. I may still tweak the visual design later, but the main pieces are in place.

## What Is In Here

- A React + Vite frontend with a custom single-page routing setup.
- A responsive portfolio home page with animated background beams, featured projects, tech stack badges, newsletter signup, and support/contact calls to action.
- A projects page with paginated project cards.
- An about page with profile details, work history, education, achievements, a timeline, and a downloadable PDF resume.
- Supabase auth for login, registration, logout, forgot password, and password reset flows.
- A Monaco-powered code playground where logged-in users can save snippets, reopen them later, delete one or all saved snippets, and create shareable links.
- A FastAPI backend for newsletter subscription, Supabase signup support, and Stripe Checkout session creation.
- Stripe-powered support tiers and custom support amounts on the coffee page.
- Supabase SQL scripts for the playground document table, row-level security policies, and auth profile syncing.
- Deployment helpers for SPA routing on Vercel/Netlify-style hosts.

## Tech Stack

The frontend is built with:

- React 19
- Vite
- Tailwind CSS 4 through the Vite plugin
- Headless UI
- Heroicons
- Monaco Editor
- Supabase JS

The backend is built with:

- FastAPI
- Pydantic
- Stripe's Python SDK
- Supabase REST/Auth calls through Python's standard HTTP tooling
- Uvicorn

## Main Pages

- `/` - the main Lazymate landing page with the hero, stack section, featured builds, newsletter signup, and support CTA.
- `/projects` - the full projects list with pagination.
- `/playground` - the code playground. Anyone can view the editor, but saving and sharing documents requires login.
- `/about` - profile, contact details, work/education history, achievements, timeline, and CV download.
- `/coffee` - support page with Stripe Checkout tiers and custom amount support.
- `/login`, `/register`, `/forgot-password`, `/reset-password` - Supabase-backed auth screens.
- `/components-test` - a component test page kept in the app for local UI checks.
- Any unknown route falls through to the custom 404 page.

## How The App Is Put Together

The root React app lives in `src/`. `src/App.jsx` owns the lightweight client-side routing, lazy-loads most pages, tracks the current Supabase user, and passes navigation/auth state into the pages.

Shared layout pieces live in `src/components/`, including the site header, footer, project cards, confirmation messages, alert dialog, share modal, and background beam effect.

Most portfolio copy and project card data is in `src/pages/pageData/homePageData.jsx`. The saved playground documents are handled by `src/lib/playgroundStore.js`, with the Supabase browser client configured in `src/lib/supabaseClient.js`.

The backend lives in `backend/`. It exposes a health check, signup helper, newsletter subscription endpoint, and Stripe checkout endpoint.

## Backend API

The FastAPI app currently exposes:

- `GET /` - simple health check.
- `POST /signup` - Supabase signup helper.
- `POST /newsletter/subscribe` - stores newsletter subscribers in Supabase.
- `POST /create-checkout-session` - creates a Stripe Checkout session for the coffee page.

## Local Setup

Install the frontend dependencies from the project root:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Run a production build:

```bash
npm run build
```

Preview the built frontend:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Backend Setup

Create and activate a Python virtual environment if you want to run the backend locally:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Then start FastAPI:

```bash
uvicorn main:app --reload --port 8000
```

The frontend defaults to `http://127.0.0.1:8000` for API calls unless `VITE_API_BASE_URL` is set.

## Environment Variables

Frontend variables:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_or_anon_key
```

`VITE_SUPABASE_ANON_KEY` also works as a fallback if you are using the older Supabase naming.

Backend variables:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_BASE_URL=http://localhost:5173
```

The backend will also read compatible `VITE_SUPABASE_*` values from `.env.local` for some Supabase auth calls. For newsletter writes, it needs `SUPABASE_SERVICE_ROLE_KEY`.

## Supabase Notes

The playground uses a `playground_documents` table. The SQL for that is in:

```text
backend/supabase_playground_documents.sql
```

That script creates the table, adds a share token, updates `updated_at` through a trigger, enables RLS, lets owners manage their own documents, and allows public reads for documents marked as shared.

There is also a small auth profile sync script:

```text
backend/supabase_new_user_sync.sql
```

The newsletter endpoint writes to a `newsletter_subscribers` table through Supabase REST. Make sure that table exists in your Supabase project before relying on the newsletter form in production.

## Stripe Notes

The coffee page calls the FastAPI backend at:

```text
POST /create-checkout-session
```

The backend supports three built-in tiers:

- `espresso` - $5 AUD
- `double` - $10 AUD
- `snacks` - $20 AUD

It also supports a custom amount, with validation in both the frontend and backend. Successful checkouts return to `/coffee?status=success`; cancelled checkouts return to `/coffee?status=cancelled`.

## Project Structure

```text
.
|-- backend/
|   |-- main.py
|   |-- requirements.txt
|   |-- Procfile
|   |-- supabase_playground_documents.sql
|   `-- supabase_new_user_sync.sql
|-- public/
|   |-- HillolBarman_Resume.pdf
|   `-- _redirects
|-- src/
|   |-- assets/
|   |-- components/
|   |-- lib/
|   |-- pages/
|   |-- App.jsx
|   |-- main.jsx
|   `-- index.css
|-- package.json
|-- vite.config.js
|-- vercel.json
`-- README.md
```

## Deployment

The frontend is a Vite SPA. `vercel.json` rewrites all routes to `index.html`, and `public/_redirects` does the same style of fallback for hosts that use Netlify-style redirects.

The backend has a `Procfile` for running Uvicorn:

```text
web: uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```

In production, the frontend needs `VITE_API_BASE_URL` pointed at the deployed FastAPI backend, and the backend needs the Supabase, Stripe, and frontend base URL variables listed above.

## Current State

The project is finished from a core-feature point of view. The remaining work, if any, is mostly design polish, copy tweaks, or swapping placeholder project data for more specific real project entries.
