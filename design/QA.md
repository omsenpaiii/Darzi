# DARZI verification record

Updated 9 October 2026. This records completed checks and their scope. It does not certify every route, state, device or accessibility behavior.

## Environment and automated results

- Local review URL: `http://localhost:3000`. Development and production servers have been used; the earlier process-restart persistence check used a fresh `npm run build` / `npm run start`. The latest QR API checks use the local application and the same isolated synthetic workspace. Final QR browser checks ran against the latest `npm run build` / `npm run start` production build.
- Data/auth/storage: newly provisioned Neon project `darzi-platform` (`icy-grass-38018123`), AWS Singapore, isolated `darzi-development` branch (`br-billowing-flower-b3bfld8x`), managed Neon authentication and private storage. The production branch remains empty. Browser mutations and integration checks use clearly synthetic development records/accounts.
- HTTP integration tests assert the session's `demoData: true` before business-record writes. No real customer/job migration or outgoing message was performed.
- Latest typecheck and production build passed.

| Check | Command | Result |
| --- | --- | --- |
| Backend workflows | `npx tsx --test tests/server.test.ts` | Earlier baseline: 19 passing; not rerun in latest QR pass |
| Appointment/time checks | `npx tsx --test tests/admin-time.test.ts tests/appointments.test.ts` | Earlier baseline: 13 passing (7 time + 6 appointment); not rerun in latest QR pass |
| QR generation / selection | `npx tsx --test tests/qr-labels.test.ts` | Latest QR pass: 7 passing |
| Protected QR flow | `npx tsx --test tests/qr-flow.test.ts` | Latest QR pass: 7 Node-reported passing (6 subtests + parent) |
| TypeScript | `npm run typecheck` | Passed |
| Production build | `npm run build` | Passed |

The earlier 32-check baseline uses Node's reported totals, including parent tests; those suites were not rerun with the latest QR changes. Backend coverage includes protected access/origins, managed sign-in, lead conversion/follow-ups, accepted measurement reuse, private uploads, item identities, AU/India restrictions, holds, revisions, QC, shipping/receipt, alterations, partial completion, synthetic legacy import and independent Postgres reads. Appointment/time coverage includes overlap, unchanged instants, stale/closed-record edits and repeated/nonexistent clock-change times.

The latest QR pass adds 14 reported checks. Generation tests independently decode generated PNGs to the saved opaque URL and cover required selection, deduplication, whole-job failure, dispatch-only printing, 50-garment/10-copy limits and site-origin validation. Read-only garment API checks verify anonymous rejection, exact token/ID/printed-number resolution, India draft denial and removed contact fields, invalid-label errors and unchanged version/stage/token. Login-return guards and fresh destination loading are implemented; the completed authentication/mobile browser pass is recorded below.

## Browser and restart evidence

Evidence names below are relative to `design/`. Checks were performed with native browser UI/screenshot inspection; accepted concepts and final browser views were also compared using `view_image`.

| Flow / inspected state | Result and retained evidence |
| --- | --- |
| Public opening and scroll assembly | Current opening copy/navigation was pair-reviewed against the immersive concept; current opening/foundation framing at 390px and transparent-nav contrast were inspected. `browser-hero-desktop.jpg`, `browser-hero-mobile.jpg`, `browser-hero-foundation-mobile.jpg`, `browser-transparent-nav-contrast.jpg`. Latest finishing timing/top-fade changes are implemented, but a new finishing desktop capture was not taken. |
| Public enquiry → lead → intake | Synthetic enquiry retained contact preference, party size and event date. Conversion restored customer/event/original message into a discoverable draft; intake handoff created an independently tracked garment awaiting workshop acceptance. `browser-enquiry-success.jpg`, `qa/admin-intake-handoff.jpg`. |
| Accepted measurement reuse | Browser copied accepted history and edited the new snapshot independently. Synthetic source shirt `DZ-2026-1041-1` remained 98cm; the copy saved at 101cm in draft `DZ-2026-1045`. `qa/admin-measurement-reuse.jpg`. |
| Manual process restart | After stopping dev, building and starting production, the saved copy reopened at 101cm with provenance. Independent database inspection confirmed the source remains 98cm. Lead follow-up and managed authentication also persisted. |
| Lead follow-up | Original enquiry is preserved beside actor/date-attributed follow-ups and the converted-commission link; backend regression checks confirm preservation. `qa/admin-lead-follow-up.jpg`. |
| Production / desktop inspector | Synthetic Cutting → Stitching persisted with updated counts/stage/next action. Final 1600 × 1000 pair-review shows the workshop board and selected Amelia inspector. `qa/admin-production-desktop.jpg`, `qa/admin-production-final.jpg`. The real nine-stage horizontally scrolling board, rather than five illustrative concept columns, is intentional. |
| QR generation / label | At 1600 × 1200 and 390 × 844, search for Oliver → Select matches → 2 copies prepared four labels for two distinct pieces. All four rendered PNGs completed; 70 × 40mm label boxes measured 264.56 × 151.18px without internal overflow. Empty `/admin/labels` disabled Print instead of selecting all garments; a foreign garment link showed inline rejection. Temporary evidence: `/tmp/darzi-qr-scan-desktop.png`, `/tmp/darzi-qr-scan-mobile.png`, `/tmp/darzi-qr-label-preview.png`, `/tmp/darzi-qr-label-mobile.png`. Invoking Print opened the system print dialog and paused the original tab; verification continued in a fresh same-browser tab. No physical output or camera/printed scan was verified. |
| QR sign-in / exact garment | Independently decoded the actual rendered PNG for `DZ-2026-1021-1`; its URL carried the saved opaque token. Sign out → open decoded URL → sign-in URL retained that token in `next` → Super admin sign-in → Midnight wedding suit, rather than Overview. Authenticated printed-ID lookup also opened that same garment with fresh Quality control state. At 390 × 844, Stitching → Quality control saved and persisted after reload; the Add revised measurement sheet form exposed sheet/revision-note/save controls (cancelled without upload). Temporary evidence: `/tmp/darzi-qr-return-mobile.png`. |
| Latest QR browser health | In the fresh same-browser tab, observed URLs/titles and meaningful DOM matched the Scan, labels and garment pages; no framework overlay or captured error/warning logs appeared through the tested sign-in, status and label flow. Document width matched the 390px and 1600px viewports. Temporary viewport overrides were reset. This is scoped flow evidence, not measured real-device scan performance. |
| Diary | Synthetic creation/device-time conversion and completion persisted. An actual synthetic appointment was rescheduled to a repeated clock-change time, saved/reloaded and later cancelled. Final 1100 × 800 modal displays Earlier GMT+11 without saving the seed appointment. `qa/admin-appointment-complete.jpg`, `qa/admin-reschedule-clock-change.jpg`. |
| Mobile item and note | At 390 × 844, secondary Add note/Correct stage controls sit inline above fixed Inspect quality/Place on hold controls. A synthetic note saved and displayed actor/date. Item document width matched the 390px viewport. `qa/admin-item-mobile-final.jpg`, `qa/admin-mobile-note-actions.jpg`. |
| Managed mobile sign-out | Sign-out returned to the login screen; login document width matched the 390px viewport. `qa/admin-login-mobile-final.jpg` (390 × 844). |
| Attendance | Clock-in/completed-day UI uses the business timezone consistently; completed state was inspected. `qa/admin-attendance-complete.jpg`. |
| Fresh-build errors and width | Since fresh sign-in, the inspected sign-in → overview → production-inspector log window contained no error/warning entries. Desktop document width matched the 1600px viewport. This is a scoped observation, not an all-route error audit. |

## Fidelity and media

`ADMIN_FIDELITY_QA.md` records palette, typography, container/card anatomy, inspector action placement, mobile hierarchy and navigation comparisons with `admin-concept.png` / `admin-mobile-concept.png`. The visible development banner is factual (`demoData`), and generated reference photographs are illustrative rather than verified client garments. Public opening copy/navigation matches the reviewed concept; complete template fidelity review remains pending.

`browser-hero-finishing-desktop.jpg` and `browser-hero-small-mobile.jpg` are historical captures made before the latest 90% finish-hold / 22% top-fade changes; they are not current final-state evidence.

The public scroll assembly is seven consistent illustrated WebP frames at 1920 × 1080, totaling **593,640 bytes**. It uses canvas cross-dissolves, not a continuous film. No new HeyGen video was generated. Original prompts/masters and image budgets are in `media-brief.md`; static reduced-motion/data-saving fallback behavior is implemented but full fallback-state browser coverage has not been completed.

## Remaining launch checks

- Actual Trello exports/access, active-job relationship reconciliation, attachment copying, record counts and freeze/delta cutover rehearsal.
- Hosted review deployment, domain/Squarespace cutover and recovery checks; live systems remain in place.
- Real staff provider accounts/invitations/recovery, approved outgoing mail and verified appointment notification/reminder delivery. No mail has been sent.
- Configure the final public HTTPS `NEXT_PUBLIC_SITE_URL` so phone QR links reach the published app rather than localhost. Actual camera permission/grant/fallback and printed QR scan on target devices; physical printer/label-stock dimensions at 100% scale with both teams. A print dialog is not proof of printed output.
- Approved brand/client imagery, factual copy/testimonials, measurement templates and policy approval. Invoice creation remains outside scope.
- Full public/admin navigation/state coverage, keyboard/screen-reader/contrast/touch-target audit, reduced-motion/data-saving/loading/error checks and supported-browser coverage.
- Reproducible mobile loading/scroll performance lab checks. Known media byte budgets do not establish measured network or frame-time performance.

Hold-resolution reasons, QC rework targets and Super Admin correction/reopening controls are implemented. Automated checks cover underlying workflow restrictions; this record does not claim every UI action permutation was exercised.

## Release check — 9 October 2026

The full development integration/unit run passed 50/50 Node-reported checks. Six focused internal-admin return-path checks then passed, with typecheck and optimized build checks. Production uses its own initially empty Neon branch/Auth/private bucket. Owner invitations are email-bound, hashed, expiring and single use; passwords are chosen privately by the owners.

Original stitching SVG/CSS loader was inspected in dark desktop and dark/light 390px mobile layouts. Read-only DOM samples confirmed needle motion; the homepage completed asset loading without a stuck overlay. Reduced-motion CSS is implemented but not yet browser-emulated. Hosted smoke checks and owner activation are recorded separately after deployment.
