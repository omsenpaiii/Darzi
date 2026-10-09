# Admin design and functional verification

Updated 9 October 2026. This record covers the named inspections and flows below; it is not a complete navigation, accessibility or reduced-motion audit. Consolidated environment, automated results and launch limits are in `QA.md`.

## References and method

- Desktop concept: `design/admin-concept.png` (built-in Image Gen).
- Mobile concept: `design/admin-mobile-concept.png` (built-in Image Gen).
- Latest desktop browser evidence: `design/qa/admin-production-final.jpg`, 1600 × 1000; concept pair-review covered the real nine-stage board and selected Amelia inspector.
- Historical first-pass desktop evidence: `design/qa/admin-production-desktop.jpg`, 1600 × 1000.
- Mobile browser evidence: `design/qa/admin-item-mobile.jpg`, 390 × 844, with the latest item capture retained as `design/qa/admin-item-mobile-final.jpg`.
- Final mobile note/actions and managed sign-out/login evidence: `design/qa/admin-mobile-note-actions.jpg` and `design/qa/admin-login-mobile-final.jpg`, both 390 × 844.
- First pass used the Codex in-app browser. After the active turn changed, that browser was absent from the subagent's available surfaces. Continued through Chrome using Computer's documented native screenshot/AX controls. Chrome's injected DOM debugger was unavailable, so native screenshot-grounded actions were used.
- Both accepted concepts and both latest browser screenshots were inspected using `view_image` in paired QA passes.

## Fidelity ledger

| Comparison point | Inspection and repair |
| --- | --- |
| Palette | Charcoal sidebar, warm paper canvas and wine primary/selected actions match the concept's locked admin tokens. No gradients or decorative chrome added. |
| Typography | Bodoni page/garment headings, Source Sans interface, IBM Plex item IDs. All controls have deliberate type sizing; mobile headings wrap without clipping. Darkened small ID captions for readability. |
| Container model | Persistent sidebar, slim search/actions toolbar, open heading, AU/India segment, dense horizontal stage board and narrow inspector. Actual workflow retains all India stages rather than collapsing them into five illustrative concept columns. |
| Card anatomy | Thumbnail, customer, garment, monospaced ID, fabric, due date and labelled priority/hold state. Actual records and counts drive the board. Standalone generated assets provide illustrative demo imagery. |
| Inspector action | Initial browser pass placed the next step below the fold. Repaired with a fixed primary action area on desktop and mobile. Secondary note/fitting/correction actions now sit inline, keeping the next step prominent. |
| Mobile hierarchy | Dark DARZI header, separate back link and ID, garment heading, media, fabric/due/owner facts, specification/activity/files tabs and large primary action. Repaired inline back-link/ID run-on. |
| Responsive navigation | Hidden desktop sidebar becomes an inert mobile drawer. Closed offscreen navigation is removed from keyboard/AX reach. Icon-only mobile Scan/New intake links have explicit accessible names. |
| Keyboard implementation | Dialogs implement initial focus, Tab/Shift-Tab trapping, Escape dismissal and focus restoration; controls include visible focus/upload focus-within treatment. Full keyboard/screen-reader coverage remains pending. |

## Copy comparison

The permitted concept strings DARZI, Atelier workspace, Overview, Leads, Orders, Production, Customers, Scan, Appointments, Attendance, Revenue, Team & settings, Production, One garment. One clear next step., Search orders/customers/item ID, Scan QR, New intake, Board, Table and Filter are retained. Actual business workflow stage names and synthetic customer/garment IDs replace illustrative concept examples. The Development workspace/Synthetic demo data banner is an intentional factual addition tied to the server's preview flag. Exact demo headings/content vary with data; no invented business claims or production measurements are shown.

## Functional evidence

- Managed owner account signed in successfully and restored the authenticated workspace.
- India production selected a garment, opened the inspector and moved synthetic item `item-1` from Cutting to Stitching.
- Browser visibly confirmed Cutting count fell to zero, Stitching count rose to two, item stage changed, next action changed to Quality control and a saved success toast appeared.
- Manual printed ID lookup opened the same persisted garment; its printable label rendered an actual QR for the authenticated item route.
- A converted public synthetic enquiry restored the customer, event date and original message into intake. The four-step form captured one garment, three numeric measurements and a promised due date, then Send to India persisted the original order as `DZ-2026-1033` with the unique item `DZ-2026-1033-1`, stage Received from Australia, measurement revision 1 awaiting workshop acceptance. Evidence: `design/qa/admin-intake-handoff.jpg`.
- Studio diary creation saved Synthetic Diary QA and converted device time to the stated Melbourne display timezone. Complete persisted its completed status and removed completed-record actions. Evidence: `design/qa/admin-appointment-complete.jpg`.
- Accepted measurements from the selected customer's non-draft garment history were copied in the browser into a new garment and edited independently. The copy retains numeric values/source sheet and provenance; backend checks confirm the original accepted revision is unchanged. Evidence: `design/qa/admin-measurement-reuse.jpg`.
- The browser copy from synthetic Original QA shirt `DZ-2026-1041-1` was edited from 98cm to 101cm and saved in draft `DZ-2026-1045`. After stopping development, building and starting the production server, the saved garment reopened with 101cm and provenance. Independent database inspection confirmed the source remains 98cm; lead follow-up and managed authentication also survived that restart.
- Lead detail preserves the original enquiry and adds separate actor/date-attributed follow-ups, with a converted-commission link. These fields and link preservation are covered by backend checks; retained UI evidence is `design/qa/admin-lead-follow-up.jpg`.
- Dedicated appointment rescheduling is implemented with overlap checks, studio/device timezone conversion, exact unchanged-instant preservation and explicit earlier/later selection for repeated clock-change times. An actual synthetic appointment was rescheduled to a repeated clock-change time, saved/reloaded and later cancelled. The final native-modal inspection displays Earlier GMT+11 at 1100 × 800 without saving the seed appointment; evidence: `design/qa/admin-reschedule-clock-change.jpg`. Targeted tests verify both occurrences, stale edits and rejection of closed-record reactivation. Mail/reminder integration is still pending.
- Hold resolution now presents a required reason field; QC failure presents a reason and selectable rework target; Super Admin correction/reopening presents a target stage and reason. Mobile secondary actions are inline. These controls are implemented; this record does not claim every action permutation was exercised in the browser.
- At 390 × 844, Add note/Correct stage render inline above the fixed Inspect quality/Place on hold controls. A synthetic note saved successfully and displayed its actor/date. Mobile item and login document widths both matched the 390px viewport, and managed sign-out returned to the login screen. Evidence: `design/qa/admin-mobile-note-actions.jpg`, `design/qa/admin-item-mobile-final.jpg`, `design/qa/admin-login-mobile-final.jpg`.
- Fresh production-build sign-in → overview → production inspector produced no error/warning entries in the inspected log window; desktop document width matched the 1600px viewport. This observation is limited to that flow and time window.
- Attendance clock-in revealed the frontend initially used UTC date while the server used the business timezone. Repaired the frontend to use the same settings timezone for date identity and timestamps, with a disabled completed-day state.
- Typecheck and the latest production build passed on 9 October 2026. The isolated development dataset passed 19 backend checks and 13 appointment/time checks, for 32 passing checks total.

## Intentional differences / practical limits

- The full confirmed workflow has nine India stages; the concept showed five readable examples. The board scrolls horizontally with native scrolling and offers a table view.
- Demo thumbnails are generated illustrative tailoring imagery. Actual private attachments take priority when present; no Trello client photographs are republished.
- Real camera permission and physical QR/printer tests require the user's device. Native BarcodeDetector is used where supported, with a lazy-loaded ZXing fallback and manual ID lookup. The app does not request camera access until Open camera is pressed.
- Revenue is a read-only recorded ledger. Invoice creation is excluded per the user's request.
- Existing customer selection prefills contact information. Measurement reuse copies accepted non-draft garment history into an independent editable snapshot for that customer. Draft/unaccepted history cannot be selected as an accepted reuse source; dispatch requires new workshop acceptance.
- Camera fallback is implemented but a physical camera permission grant and printed-code scan were not performed. QR/manual lookup and label rendering were browser-verified.
- Source archive import is implemented; live Trello cutover remains dependent on authorised source exports, active-job reconciliation and attachment copying.
- The new Neon project, isolated development managed authentication and private storage are provisioned; production remains empty. Real staff provider accounts/invitations, account recovery and outgoing mail remain launch dependencies.
