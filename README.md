# DARZI

A new public tailoring website and an Australia/India operations workspace, built from scratch with Next.js 16, React, TypeScript, GSAP and Neon. The two core workflows are rapid customer/garment intake and item-level QR production tracking. Invoice preparation is excluded.

Implementation/verification status updated 9 October 2026.

## Run locally

```sh
npm install
npm run dev
```

Open [the homepage](http://localhost:3000) or [the atelier workspace](http://localhost:3000/admin). A provisioned `.env.local` already exists in this checkout; preserve it. For a different checkout, use `.env.example` to configure a separate development environment. Never commit secrets.

```sh
npm run typecheck
npm test
npm run build
```

Backend integration tests require the local application to be running against an explicitly labelled synthetic development dataset. They refuse business-record mutations unless the session reports `demoData: true`. Targeted appointment/time checks can be run with `npx tsx --test tests/admin-time.test.ts tests/appointments.test.ts` against that same local environment. QR generation checks run with `npx tsx --test tests/qr-labels.test.ts`; protected read-only QR lookup checks run with `npx tsx --test tests/qr-flow.test.ts` against the running synthetic application.

The bundled Next.js version has changed APIs. Read the relevant guides under `node_modules/next/dist/docs/` before changing routing, layouts or framework behavior, as required by `AGENTS.md`.

## What is implemented

The public site includes a full-screen scroll assembly hero, transparent centered homepage navigation, editorial work/craft sections, four service pages, fabric/work filters, garment detail pages, house/contact pages and draft policy destinations. Consultation enquiries save to durable Leads records; they do not imply confirmed bookings.

The admin workspace includes shared orders and independently tracked garments, intake drafts and accepted-measurement reuse with independent editable snapshots/provenance, production board/table views, item inspector/history, holds/revisions/QC, shipments and Australia receipt, opaque QR labels/scanning, private attachments and AU/India role restrictions. Lead detail preserves original enquiries, attributed follow-ups and converted-order links. Item controls include hold-resolution reasons, QC rework targets and Super Admin stage correction/reopening; mobile secondary actions stay inline.

Appointments support creation, rescheduling, completion and cancellation. Studio/device timezone conversion preserves unchanged instants; repeated clock-change times expose explicit earlier/later choices. Server checks reject overlaps, stale time/status snapshots and reactivation of cancelled/completed appointments. Team, attendance, recorded business summaries and legacy preview/archive share the backend. Appointment mail/reminders and real staff invitations/recovery still need outgoing provider setup.

## Garment QR labels

Scan includes an existing-garment search by customer, order or garment, explicit selection and a preview/print job. Permanent labels become available after sending the commission to India; draft and unsent intake rows cannot be printed while their piece identities can still change. Completed garments can be included for reprints. Each job allows up to 50 distinct garments and 1–10 copies per garment. Missing, inaccessible or unissued selections fail the whole job instead of silently printing a partial batch. No standalone arbitrary QR is created.

Labels encode the saved opaque token at `/admin/items/<token>` without customer contact data. Reprints retain that identity and do not change production stage. Set `NEXT_PUBLIC_SITE_URL` to the final published HTTPS website before issuing labels for phones or the workshop; a localhost fallback opens this computer's address and is unsuitable for a phone. The preview uses the configured stock dimensions, zero page margins and generation/error/retry states. Print guidance specifies matching stock, 100% scale and disabled headers/footers; physical stock and printer output still need verification.

Lookup accepts printed item numbers, tokens or garment links on the current/canonical site. Expired sessions retain a validated internal garment destination, and the destination waits for fresh authorized workspace data. Failed refreshes offer retry; invalid, removed or inaccessible items receive an unavailable state. India cannot use a known draft token to bypass access restrictions.

## Neon development environment

The user-authorized new project is `darzi-platform` (`icy-grass-38018123`) in AWS Singapore. Local development uses the isolated `darzi-development` branch (`br-billowing-flower-b3bfld8x`), with managed authentication and a private branchable storage bucket. SQL lives in `database/schema.sql`; `database/setup.ts` is locked to that development branch/host, requires `DARZI_DEMO_DATA=true` outside production, and seeds synthetic records only when the staff table is empty. It refuses production targets.

Synthetic development accounts are `owner@darzi.test`, `melbourne@darzi.test` and `workshop@darzi.test`, with password `DarziPreview2026!`. The demo sign-in helper appears only when the server explicitly enables demo data. These accounts are for the isolated development branch; remove/disable them before launch. Real staff require a managed-auth account plus an active staff allow-list entry. Invitations, recovery and appointment messages require an approved outgoing mail configuration.

With no database configured, an explicitly enabled **non-production** `DARZI_LOCAL_PREVIEW=true` mode uses atomic local files under `.data/`. Managed/database configuration is required for production; missing setup fails closed. Private storage falls back to protected Postgres bytes when S3 configuration is absent.

## Production bootstrap

Production uses the separate `production` branch (`br-frosty-recipe-b39v7qnl`), its own Managed Better Auth service and private `darzi-private-jobs` bucket. The approved schema/settings-only bootstrap has run: 18 application tables exist, with one business-settings row and no other application records. Independent reads also confirmed zero managed users/accounts/sessions at bootstrap. No demo accounts, jobs or passwords were copied into production.

Production connection/Auth/storage configuration is held in ignored `.darzi/production.env` with mode `0600`. Set the confirmed published origin in deployment configuration before issuing QR labels. The schema setup is an explicit maintenance command, never a build step:

```sh
DARZI_SETUP_PRODUCTION=true node --env-file=.darzi/production.env --import tsx database/setup-production.ts
```

The script requires the exact production project/branch and direct database host, `DARZI_DEMO_DATA=false` and `DARZI_LOCAL_PREVIEW=false`. It preserves existing records/settings and creates no auth users or staff credentials. Eleven rejection checks passed without database connections. The two authorized real owner identities use expiring, single-use, email-bound setup invitations. Only token hashes enter deployment configuration; raw setup links stay in an ignored private local file. Owners choose their own passwords. Public signup cannot grant workspace access, and staff permissions are checked on each protected request. Outgoing auth/recovery mail requires approved provider configuration. Hosted deployment and its smoke check remain pending.

## Hero media

Scroll controls assembly progress forwards and backwards; there are no playback controls. The implementation uses seven consistent original illustrated WebP frames at 1920 × 1080 with fixed scene framing and canvas cross-dissolves. Together they total 593,640 bytes. Static reduced-motion/data-saving fallback behavior is implemented; complete fallback-state browser coverage is still pending. No continuous film or new HeyGen video was generated. The connected plugin currently exposes no suitable general scene-creation tool. Generated garment studies are identified as illustrations, not client commissions.

Loading uses an original SVG/CSS needle-and-seam animation shared by page/workspace waits, hero asset loading and compact busy buttons. It requests no animation asset or player; reduced motion presents a static seam. Research references were [Needle and Thread](https://lottiefiles.com/free-animation/needle-and-thread-wiAt0m2tOi), [Sewing Triptych](https://codepen.io/karomancer/pen/yLNdeXE) and [Spline Viewer](https://docs.spline.design/exporting-your-scene/web/exporting-as-spline-viewer); their assets/code were not copied into the shipped loader.

## Verified scope

The full `npm test` release run passed all 50 checks on 9 October 2026, covering backend workflows, private uploads, appointment/time handling, QR generation/resolution and owner invite validation. Six additional focused return-path checks passed after the shared sign-in guard was tightened. Typecheck and the optimized build pass. Integration writes used only the explicitly labelled synthetic development branch.

Earlier browser spot checks cover public enquiry/conversion, intake handoff, measurement copy/edit, production advancement, manual item lookup/QR label rendering, diary creation/rescheduling/completion and attendance. Saved measurement copies/provenance, follow-ups and managed authentication survived a process restart. The latest production-build browser check independently decoded the rendered label, opened its URL while signed out, signed in and returned to that exact garment. At 390 × 844, the synthetic garment advanced from Stitching to Quality control and retained that stage after reload; measurement-sheet revision controls were inspected without uploading a new sheet. Desktop/mobile label selection and four-label previews, invalid-link feedback and empty-job blocking passed. Invoking Print opened the system print dialog; no physical label was printed. These results do not establish complete route, accessibility, reduced-motion or device coverage. See `design/QA.md` for exact evidence and remaining checks.

## Delivery records

- `IMPLEMENTATION_TODO.md` — detailed live checklist and external dependencies.
- `DARZI_UI_PLAN.md` — public sitemap, role model and replacement plan.
- `design/DESIGN_SYSTEM.md` and `design/ADMIN_DESIGN_SYSTEM.md` — selected concepts and UI decisions.
- `design/media-brief.md` — original prompts, assets and film brief.
- `design/QA.md` — current browser/workflow evidence, test environment and explicit remaining checks.

Actual Trello migration needs source exports, active-job reconciliation and attachment copying; invitations/screenshots have not been treated as imported records. Hosted review deployment/domain cutover, approved business photographs/copy/policies, real staff activation, mail delivery, real camera/printer checks and reproducible performance lab checks remain launch dependencies. The review environment is local and production contains only bootstrap settings; existing live systems have not been retired.
