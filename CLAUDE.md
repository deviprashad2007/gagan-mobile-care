# Gagan Mobile Care — Claude Code Project Rules

Read this file at the start of every session. Source of truth for how this codebase is built.

## What we're building

A website for Gagan Mobile Care, a mobile phone repair shop in Delhi. Public marketing site + admin dashboard for the owner to manage bookings, repairs, and catalog.

## Stack (do not deviate without asking)

- Next.js 15 (App Router, TypeScript strict mode)
- Supabase (Postgres + Auth + Storage)
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- No automated messaging in v1 — customer sees confirmation screen; Gagan calls back manually
- Vercel hosting, Sentry errors, Plausible analytics

## Non-negotiable rules

1. Every user-facing page must have generateMetadata() and JSON-LD schema
2. Every form input has a Zod schema; the same schema validates server-side
3. Every database mutation goes through a server action with auth check and Zod validation; never client-side Supabase writes
4. Every new table has RLS enabled, plus created_at, updated_at, deleted_at columns
5. No `any` types; use `unknown` and narrow with type guards
6. Server Components by default; 'use client' only when needed
7. Business logic lives in /lib, never in components
8. Soft delete only — never DELETE FROM
9. Every AI call (if any) logs to ai_logs table

## Folder structure (target)

/app — Next.js pages (marketing + admin + api)
/components — UI primitives and feature components
/lib — supabase, seo, validations, utilities
/db — numbered SQL migrations
/docs — planning documents
/reference — OLD PROTOTYPE, read-only inspiration only

## Naming

Files: kebab-case.ts
Components: PascalCase.tsx
Server actions: verb-first (createBooking.ts)
DB tables: snake_case, plural
DB columns: snake_case

## Response style

Code first, explanation only when asked.
No preamble like "Great question!"
No alternative approaches unless I ask.
Be honest about tradeoffs and what could go wrong.

## When in doubt

Optimize for "Gagan can run his shop without calling me"
If a page might be slow, server-render it
If a query is over 200ms, add an index
If a form might be spammed, rate-limit it
If tempted to skip RLS, stop and add it

## Reference folder

The /reference folder contains an older React prototype (CDN React, in-browser Babel). It is for VISUAL and BUSINESS LOGIC inspiration only. Do not import from it, do not modify it, do not deploy it. When building, READ relevant reference files to understand design intent, then build fresh in the proper structure.
