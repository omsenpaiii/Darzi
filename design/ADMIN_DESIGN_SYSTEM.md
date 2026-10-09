# Admin visual specification

Accepted references: `admin-concept.png` and `admin-mobile-concept.png`, generated using the built-in Image Gen tool on 8 October 2026. The references define the interface family; all interactive content is native HTML.

Implementation status updated 9 October 2026. Verified flows and remaining checks are recorded in `QA.md` and `ADMIN_FIDELITY_QA.md`.

- Sidebar: 208px charcoal #202322, cream-white wordmark, muted grey subline, 18px outlined icons, wine active navigation.
- Workspace: warm paper #F6F5F1, ink #222722, muted #71746E, border #DEDED5, white cards and tables, accent #632D3C. Semantic hold red, attention ochre, readiness green; each state has a text label.
- Type: Source Sans 3 for UI, 14px controls/rows, 13px captions; Bodoni Moda only section headings at 50–56px; IBM Plex Mono 11px item IDs. Mobile heading 36px.
- Geometry: 6px control/card radius, 1px borders, compact rows; no unnecessary shadow or nested panels. 44px minimum principal control height.
- Desktop: sidebar, top search/Scan QR/New intake bar, open heading, AU/India segment, board/table/filter controls, horizontally scrollable stage board. Optional 320px inspector.
- Mobile: charcoal header, collapsible nav, stacked item summary, photo, facts, spec/activity tabs and sticky primary stage action. Secondary item actions sit inline in the content, keeping note/fitting/correction controls out of the fixed primary area. No desktop board shrunk into viewport.
- Copy lock: DARZI, Atelier workspace, Overview, Leads, Orders, Production, Customers, Scan, Appointments, Attendance, Revenue, Team & settings; Production / One garment. One clear next step.; Search orders, customers, item ID; New intake; India (Workshop); AU (Customer service); Board; Table; Filter.
- Implemented operational extensions: appointment creation/rescheduling/completion/cancellation, attendance, recorded-revenue summary, source migration preview/archive, permissions and managed-authentication states. Invoice creation is outside scope. Development data is synthetic and changes operational counts; generated thumbnail/copy examples are not business facts.
- Intake: accepted non-draft measurement history can be copied for the selected customer. Numeric values/source sheet become an editable snapshot with provenance; edits leave the source revision intact and dispatched measurements require fresh workshop acceptance.
- Diary: display studio timezone explicitly, offer device-time conversion, preserve unchanged instants and expose earlier/later occurrence selection for repeated clock-change times. Overlap/stale-state checks are server enforced. Appointment email/reminder delivery remains unconfigured.
- Lead detail: preserve the original enquiry, display attributed dated follow-ups and link the converted commission. Item controls provide hold-resolution reason, QC rework target and Super Admin correction/reopening reason entry.
- Assets: use standalone generated suit/craft imagery, never private Trello screenshots. No screenshot is shipped as live UI.
- Motion: brief panel/selection transitions only, disabled under reduced motion; no scroll effects in operations.
