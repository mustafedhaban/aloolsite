# Alool backend and CMS

## What is implemented

The existing Next.js 16 / React 19 / TypeScript / npm site now uses Payload 3.89 and PostgreSQL. Public URLs and the approved layouts are unchanged. Content is rendered on the server from published CMS records; saving a draft does not change the public site.

- `/admin`: authenticated CMS, first-administrator setup, editors and administrators.
- Pages: approved copy entries inside the existing layouts (home, Work, Services, Industries, About, How We Work, Contact, Privacy, Terms). Entry keys identify their position; do not remove them. This is a structured CMS, not a drag-and-drop page builder. The Insights archive's interface copy remains in its page component.
- Services and industries: structured overview and detail content, with fixed slugs after creation.
- Projects: complete representative case-study content and optional uploaded covers. Existing concept labels and noindex treatment remain intentional. Publishing a real client case requires approved evidence and a template/content-model change; publishing alone does not turn a concept into a verified case.
- Articles: rich-text editor, byline, publication date, optional cover, draft/publish, `/insights/[slug]`, published archive and sitemap entries. No articles have been invented. Publication date is display metadata, not scheduled publishing.
- Home Modules and Working Method: editable repeating sections with draft/publish.
- Site Settings: company name, description, navigation and footer heading; saves are immediate and administrator-only.
- Media: local image uploads, required alt text, generated sizes, 10 MB limit, raster image MIME allowlist. Media is public, even when referenced only by a draft; do not upload confidential material.
- Inquiries: private administrator inbox with new/reviewed/closed status.
- `/api/contact`: server validation, same-origin check, bounded request size, honeypot, database-backed rate limit, real database storage. No outgoing notifications are configured.
- Authenticated draft previews and version history. Draft previews require both a preview cookie and a current CMS login. Exit preview to return to public content.

## Start locally

Run from `/Users/dhaban/Desktop/poc/aloolsite`. PostgreSQL utilities must be installed and on PATH (already available on this Mac).

```sh
npm ci
npm run db:local
npm run cms:migrate
npm run cms:seed
npm run dev -- --hostname 127.0.0.1 --port 4173
```

Open http://localhost:4173/admin and create your own first administrator. No permanent password or test user has been supplied. Complete this step privately before making the server reachable by other people. Only administrators can create additional users or delete records. Editors can edit content and their own account, but cannot grant themselves an administrator role or read inquiries.

The local database is isolated at `.local/postgres`, listening on loopback port 55439. It does not use an existing personal PostgreSQL database. `npm run db:stop` stops only this cluster. Local trust authentication is development-only: another process running on this computer can connect to it. Never expose this cluster to a network.

`db:local` creates `.env.local` with a random secret only if the file does not exist. Secrets, `.local/`, and `uploads/` are ignored by Git. The seed is repeatable: it inserts missing records without overwriting existing CMS edits. Do not delete a seeded page expecting the seed to remember that deletion.

Production-mode preview:

```sh
npm run build
npm run start -- --hostname 127.0.0.1 --port 4173
```

Do not run development and production servers on the same port or build directory simultaneously. The configured `NEXT_PUBLIC_SERVER_URL` must match the browser origin, including its port. Rebuild when that value changes; Next embeds public variables during the build.

## Content workflow

1. Select a collection or global in the CMS.
2. Edit existing structured fields; preserve keys and approved positioning.
3. Save Draft. Use Preview for a supported page or article, or open `/api/preview?path=/` while signed in for homepage/global previews.
4. Publish when approved. Public pages query published content on each request, so no deployment is needed for a content edit.
5. Review previous versions if a change needs to be restored.

The archive currently loads up to 100 articles. Add pagination before reaching that limit. Service/industry/project lists have the same 100-record cap. New Page records do not automatically create new layouts/routes. Services, industries, projects and articles use their existing dynamic templates.

## Contact delivery

The storage backend is implemented and tested, but the ordinary local preview keeps `CONTACT_ENABLED=false` until the privacy notice and handling process are approved. It honestly says that inquiries are not sent. To exercise real local storage, set `CONTACT_ENABLED=true` in the private environment and restart the server; messages appear in Admin → Inquiries. Do not enter real sensitive information during testing.

The endpoint accepts at most five valid attempts per 15 minutes per rate-limit key. Without `TRUSTED_CLIENT_IP_HEADER`, a conservative shared bucket is used. For launch, set this variable only to a header overwritten by your trusted reverse proxy; never trust a header clients can spoof. Configure proxy-level abuse limits too. Periodically prune old limiter records and apply the approved inquiry retention period.

Email sending is deliberately disabled and throws a safe error rather than logging password-reset tokens. Inquiry notifications and password-reset email therefore require an email adapter/provider before launch. Until then an administrator can manage accounts directly; keep the only administrator's credentials safe.

## Schema maintenance

Schema and access rules: `payload.config.ts`, `cms/access.ts`, `cms/fields.ts`.
Database migrations: `cms/migrations/`. Automatic schema push is disabled.
Public reads: `lib/cms.ts`. Existing source content plus `cms/*-seeds.json` are initial import data, not the runtime source of truth.
Route groups: `app/(frontend)` and `app/(payload)` keep public styling separate from the CMS.

After a schema change:

```sh
npm run cms:types
npm run cms:importmap
node --env-file=.env.local node_modules/payload/bin.js migrate:create meaningful_name
npm run cms:migrate
npm run lint
npm run build
```

Review generated migrations before applying them. Back up the database before production migrations. In hosting environments that inject variables directly, invoke the Payload CLI without `--env-file=.env.local`; the supplied npm CMS commands are local conveniences.

## Launch checklist — not yet completed

- Choose hosting for a continuously running Next server and PostgreSQL; no hosting account or deployment was created.
- Use a protected production database with TLS, least-privilege credentials, backups and a tested restore procedure. Do not use the local trust cluster.
- Set a strong production secret and the final HTTPS origin. Configure trusted proxy headers, request limits and monitoring.
- Create the first administrator privately before public exposure. Add an operational account recovery process and email delivery.
- Store uploads on a persistent volume, or add an object-storage adapter before using ephemeral/serverless hosting. Back up originals and the database together.
- Approve Privacy/Terms, real company/contact details, inquiry retention/access policy and real project evidence. Then enable the contact endpoint.
- Decide on notification delivery. Currently inquiries are stored in the CMS inbox only.
- Re-run dependency audit. Sharp and DOMPurify were updated to remove reported high-severity/image and sanitizer findings. Five moderate audit entries remain in the PostgreSQL adapter's transitive Drizzle/esbuild tooling chain (one underlying esbuild development-server advisory); npm reports no automatic compatible fix. No esbuild development server is exposed by this setup. Review upstream fixes before launch.
- Re-run build, permission checks, draft checks and responsive QA against the actual hosted environment. This local integration is not a production security certification.

## Verification performed

Production build and lint pass. All 21 existing public routes were visited at 1440, 1024, 768 and 390 px (84 checks), with no horizontal overflow, broken images or browser console errors. Mobile menu, Escape, reduced-motion rendering and contact preview validation pass.

Backend integration tests verify first-admin registration, editor restrictions, anonymous write denial, private article drafts, publishing, authenticated draft previews, media upload/retrieval, desktop/mobile admin rendering, origin and form validation, five saved inquiries, rate limiting and private inbox visibility. Temporary test users, articles, uploads and inquiry records were removed afterwards. These checks are in `work/cms-qa.mjs`; they expect a disposable local first-user database and a separate test server, so do not run them against production.
