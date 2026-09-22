# FlowPilot — Innovation Hacks Full-Stack Internship Solution

A complete capstone implementation based on the Innovation Hacks internship guide: responsive dashboard, REST API, persistent PostgreSQL database, authentication, CRUD, filtering, progress tracking, and AI-powered task generation/summarization. The guide requires frontend → REST API → backend → database and a final AI-powered application. See the attached guide, pages 2–5.

## Stack
- Next.js + React + TypeScript + Tailwind CSS
- Next.js Route Handlers as REST API
- PostgreSQL + Prisma ORM
- JWT httpOnly cookie authentication + bcrypt password hashing
- OpenAI API (optional; deterministic fallback keeps the AI UI usable without a key)

## Run locally
1. Install Node.js 20+.
2. `npm install`
3. Create `.env` from `.env.example` and set `DATABASE_URL` and `JWT_SECRET`.
4. `npx prisma generate`
5. `npx prisma migrate dev --name init`
6. Optional: set `OPENAI_API_KEY` for live AI.
7. `npm run dev`
8. Open http://localhost:3000

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET/POST /api/projects`
- `GET/PATCH/DELETE /api/projects/:id`
- `GET/POST /api/tasks`
- `PATCH/DELETE /api/tasks/:id`
- `POST /api/ai/generate`
- `POST /api/ai/summarize`

## Demo account
The login screen is prefilled with `demo@flowpilot.dev / password123`, but you must register that account first (or create your own account). For a clean submission, seed a demo user using Prisma or register it manually.

## Deployment
Recommended: Vercel for the Next.js app and a managed PostgreSQL provider such as Neon/Supabase. Add `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, and `OPENAI_MODEL` to deployment environment variables. Run Prisma migration against the production database before first use.

## Submission checklist
The guide calls for GitHub repository, demo video, optional live deployment, and LinkedIn post for each task; GitHub repositories should include README, source, installation instructions, stack, features, screenshots, `.env.example`, and demo link. Never commit credentials. See pages 6–8 of the guide.
