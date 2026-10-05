# Creative Money Course

Online course platform for Kanjii's "Creative Money" course. Sequential, module-by-module access: each module's video and workbook must be completed before the next module unlocks.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Prisma + Postgres for users, progress, and workbook responses
- NextAuth (email + password, bcrypt-hashed) for student login
- Videos and downloadable resources live in Google Drive. The app proxies them through its own server (`/api/stream/[slug]`, `/api/resource/[resourceId]`) using a Google service account, so there's never a public/shareable Drive link a student could use to bypass the module gating — the proxy checks login + unlock status on every request.
- Deployed on Vercel; will later move to kanjiimbugua.com

## Getting started

```bash
npm install
cp .env.example .env   # fill in real values, see below
npm run db:push        # create tables (needs a real DATABASE_URL)
npm run db:seed        # load the course modules/workbooks
npm run dev
```

## Setting up the Google service account (required for video/resource playback)

The videos and workbook templates are stored in Kanjii's Google Drive and are **not** publicly shared. The app needs its own Google Cloud service account with read access to just those files:

1. In [Google Cloud Console](https://console.cloud.google.com/), create (or reuse) a project, then enable the **Google Drive API** for it.
2. Create a **Service Account** (IAM & Admin → Service Accounts). No roles/permissions needed on the GCP side — access is granted via Drive sharing, not IAM.
3. Create a JSON key for that service account and download it.
4. In Google Drive, share the course content folder (`Creative Money Course` → Videos/Workbooks folders, or just the parent folder) with the service account's email address (ends in `...iam.gserviceaccount.com`) as **Viewer**.
5. From the downloaded JSON key, copy `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` in `.env` (keep the `\n` escapes as-is, in quotes).

## Status

Core app is built and deployed: email/password auth, sequential gating, video streaming with resume-from-last-position, thumbnails, workbooks, and a module listing on the course home page. Modules 1–9 + Intro + 4 Bonus videos are seeded from Drive with real workbook content for modules 1–7.
