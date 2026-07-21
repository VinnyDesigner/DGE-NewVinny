## 1. Sidebar nav reorganization (`src/components/app/nav-config.ts`)

- **Data Management** group → keep only: Jobs, Data Layers
- **Operations** group → keep only: Workflow Monitor, Create Schedule, Manage Schedules
- Remove from sidebar: Layer Configuration, Data Mapping, Database Mapping, Deliveries, and the current single "Schedules" entry
- Route files for removed items stay in place (no flow deleted); they just don't show in sidebar
- URLs:
  - Jobs → `/operations/jobs` (unchanged, re-labeled under Data Management group)
  - Data Layers → `/data-management/layers` (unchanged)
  - Workflow Monitor → `/operations/workflow` (unchanged)
  - Create Schedule → new `/operations/create-schedule`
  - Manage Schedules → new `/operations/manage-schedules`
- The old `/operations/schedules` route file stays (not deleted, still reachable, just unlinked)

## 2. Rebuild pages with the exact content from screenshots, restyled in our existing dark‑glass UI

For each page: keep field names, section headers, tab labels, metrics, columns, chip labels, wizard step names, and copy verbatim from the screenshots. Only visual treatment changes to use app tokens (`Surface`, `GlowSurface`, `PageHeader`, `bg-card`, `border-border`, semantic tone classes, `text-h1/h2/h3`, gradient orbs, existing chip / progress / pill patterns). No content additions or removals; no flow changes.

### a. Jobs — `src/routes/_app.operations.jobs.tsx`
- Header: "Jobs" + "Track, manage and monitor all data processing jobs across all flow types"
- Metric tiles (6): Total 1, Running 1, Completed 0, Warning 0, Failed 0, Pending 0 — styled as Surface metric cards with tone colors
- Filter bar: search, flow‑type pills (All / Primary / Delta Sync / Ext DB), status pills (All / Running / Completed / Warning / Failed / Pending), refresh, "1 of 1"
- Table columns: Delivery / Flow Type / Entity / Layers / Pipeline / Status / Progress / Submitted / Actions
- Row: DEMO‑WF‑1042, #3 · 3 steps, Primary Delivery, Continuous, Abu Dhabi Digital Auth… ADDA, 4 layers, pipeline dots at qa‑qc, Running, 53%, 2026‑06‑27 22:25, action icons (branch, activity, edit, delete)
- Footer: "Page 1 of 1 · 1 delivery" · Prev / Next

### b. Data Layers — `src/routes/_app.data-management.layers.tsx`
- Header: "Data Layers" + subtitle from screenshot, Export + Register Layer buttons
- Metric tiles (4): Total Layers 0 · All registered, Active 0 · Accepting deliveries, Published 0 · Publicly accessible, By Classification · No classifications
- Search + filters: All Entities, All Sensitivity, Columns (9)
- Table columns: Alias Name, Agency Layer Name, DB Layer Name, Entity, Type, Geometry, Coverage, Sensitivity, Actions
- Empty state: icon + "No layers match the current filters." + secondary copy from screenshot
- Footer: "Showing 0 of 0 layers" · Previous · 1 · Next

### c. Workflow Monitor — `src/routes/_app.operations.workflow.tsx`
- Header: "Workflow Monitor" + subtitle from screenshot
- Top‑right status chips: 1 running · 0 ok · 0 failed · Refresh
- Two‑column layout (stacks on mobile):
  - Left: Search runs + tabs (All / Running / Success / Failed / Queued) + run card "Abu Dhabi Digital Authority · DEMO‑WF‑1042 · 53% · 3 stg"
  - Right: title "Abu Dhabi Digital Authority · Running · DEMO‑WF‑1042 · collect · Primary" + Refresh
  - Metric strip: Progress 53%, Layers 4, Duration —, Triggered by scheduler, Started 2026‑06‑27 16:45
  - Pipeline · 3 stages: 1 data‑collection Success 3m 00s (Layers Total 4, Source Format FGDB, Layers Succeeded 4, Features Extracted 18432); 2 qa‑qc Running 60% (Rules Passed 3, Rules Warned 1, Rules Evaluated 4, Features Checked 18432); 3 data‑ingestion Pending
  - Tabs: Live Logs / Stages / Timeline
  - Log panel: `qa-qc · 0 lines · live · auto-scroll` + "Stage has not produced logs yet."

### d. Create Schedule — new `src/routes/_app.operations.create-schedule.tsx`
- Header: "Create Schedule" + subtitle from screenshot, "Manage Schedules" link button (top right)
- 7‑step stepper: Entity · Tool · Data Source · Layers · Target · Schedule · Review, current = Entity
- Step body "Select Entity — Choose the organisation that owns this data pipeline."
- Search field ("Search by name, code or region…", "5 results")
- 5 entity cards: Abu Dhabi Digital Authority (Digital · Active · ADDA · 1 deliveries), Environment Agency Ab… (Environment · Active · EAD · 0), Dept of Government Ena… (Government · Active · DGE · 0), Abu Dhabi Distribution C… (Utilities · Active · ADDC · 0), Abu Dhabi Housing Auth… (Housing · Active · ADHA · 0)
- Continue button
- Right "Schedule Preview" panel: "Live configuration" · "Step 1 of 7 — 14% complete" · Entity / Layers / Tool = Not configured · Schedule (Frequency Daily, Start —, Timezone Asia/Dubai (UTC+4)) · footer chip "Will be active on save"
- Wizard state client‑local; step 1 fully rendered per screenshot, later steps show a small "Continue setup on the next step" placeholder keyed by step so nothing is invented beyond the reference

### e. Manage Schedules — new `src/routes/_app.operations.manage-schedules.tsx`
- Header: "Manage Schedules" + subtitle from screenshot, "+ New Schedule" button
- Metric tiles (4): Total Executions 0 · All time, Active Schedules 1 · 0 inactive, Total Success Deliveries 0 · All time, Failed Deliveries 0 · All time
- Search + tabs All/Active/Inactive + All Frequencies + "1 schedule" + grid/list toggle
- Table columns: Scheduler Name, Entity, Data Source, Connector, Layers, Flow Type, Frequency, Last Run, Next Run, Runs, Actions
- Row: "Test" (Medium priority chip) · ADDA · — · — · 0 · Primary Delivery · daily · clock icon · 2026‑06‑21 09:30 · 0 · pause/lightning/eye/edit action icons
- Footer: Rows per page 10 · Previous · 1 · of 1 · Next

## 3. Route registration

New route files use `createFileRoute("/_app/operations/create-schedule")` and `("/_app/operations/manage-schedules")`; the Vite plugin regenerates `routeTree.gen.ts`. No manual edits to the gen file.

## Files touched
- `src/components/app/nav-config.ts` — group membership
- `src/routes/_app.operations.jobs.tsx` — rebuild content
- `src/routes/_app.data-management.layers.tsx` — rebuild content
- `src/routes/_app.operations.workflow.tsx` — rebuild content
- `src/routes/_app.operations.create-schedule.tsx` — new
- `src/routes/_app.operations.manage-schedules.tsx` — new

## Verification
- `bunx tsgo --noEmit`
- Playwright screenshots of `/operations/jobs`, `/data-management/layers`, `/operations/workflow`, `/operations/create-schedule`, `/operations/manage-schedules` at 1280 and 1920 to confirm layout parity and app styling.
