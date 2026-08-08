# JobBoard — Job Website Frontend (School Project)

A full job board website: landing page, job listings with search/filter,
job detail pages, and email/password authentication.

**Stack:** Next.js (React) · Node.js (API routes) · MongoDB · NextAuth.js · Plain CSS

---

## 1. Install dependencies

```
npm install
```

## 2. Set up MongoDB Atlas (free)

1. Go to https://www.mongodb.com/cloud/atlas and create a free account.
2. Create a free (M0) cluster.
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) —
   fine for a school project.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

## 3. Configure environment variables

Copy the example file:

```
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

- `MONGODB_URI` — paste your connection string, add `/jobdashboard` before the `?`
  so it targets a database named `jobdashboard`
- `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
  (or any random long string for a class project)
- `NEXTAUTH_URL` — leave as `http://localhost:3000` for local dev

## 4. Seed the database with fake jobs

```
npm run seed
```

This inserts ~8 fake job listings so the site has content.

## 5. Run the dev server

```
npm run dev
```

Visit http://localhost:3000

## 6. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Go to https://vercel.com, import the repo.
3. In the Vercel project settings, add the same environment variables
   (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` — set this one to your
   deployed URL, e.g. `https://your-app.vercel.app`).
4. Deploy. Vercel auto-detects Next.js, no extra config needed.

---

## Project structure

```
pages/
  index.js              Landing page (hero, categories, featured jobs)
  jobs/index.js          Job listings with search + filters
  jobs/[id].js            Single job detail page
  login.js               Login page
  signup.js               Signup page
  api/
    jobs/index.js         GET (list/search/filter jobs), POST (create job)
    jobs/[id].js           GET single job
    auth/signup.js         POST create user account
    auth/[...nextauth].js  NextAuth config (credentials login)
models/
  User.js                Mongoose schema for users
  Job.js                 Mongoose schema for jobs
lib/
  mongodb.js              Cached MongoDB connection helper
  seed.js                 Script to populate fake job data
components/
  Navbar.js, Footer.js, JobCard.js
styles/
  globals.css + one CSS module per component/page
```

## Features implemented

- Landing page with hero search bar, stats, categories, featured jobs, "how it works"
- Job listings page with live search + filter by category/type/location
- Job detail page
- Signup (bcrypt-hashed passwords) + Login (NextAuth credentials provider, JWT sessions)
- Navbar shows logged-in state and lets you log out
- "Apply now" button only shows for logged-in users (prompts login otherwise)

## Possible extensions (if you want to go further)

- Let logged-in users save/bookmark jobs
- Add a "post a job" form for employers
- Add pagination to the jobs listing page
- Add a user dashboard showing saved/applied jobs
