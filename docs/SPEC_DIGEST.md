# Spec Digest

## Product summary
AI Accelerator is an enterprise compliance intelligence platform for privacy, legal, and runtime security oversight. It targets compliance leaders, legal teams, security teams, and engineering organizations. The differentiator is a single operational workflow that moves from detecting compliance issues to understanding them, applying AI-driven remediation, and verifying outcomes. The tag line is: "From compliance detection to automated remediation."

## Routes and screens

Priority legend: P0 = required for demo success, P1 = supporting but necessary, P2 = nice-to-have or locked placeholder.

- `/login` — Sign-in screen. P0.
- `/dashboard` — Executive overview with score ring, KPI tiles, risk trend, activity feed, and attention list. P0.
- `/code-scanner` — Code-to-GDPR scan list and repository connection hub. P0.
- `/code-scanner/scan/:id` — Staged scan progress. P0.
- `/code-scanner/results` — Findings table and severity breakdown. P0.
- `/documents` — Document intelligence list view and upload entry points. P0.
- `/documents/:id` — Review and accept/reject suggestions. P0.
- `/runtime-security` — Live security feed, session counters, and investigation. P0.
- `/compliance` — Regulatory controls and compliance breakdown. P1.
- `/reports` — Weekly and audit-ready report cards. P1.
- `/audit-logs` — Action and lineage timeline. P1.
- `/assistant` — AI Assistant panel. P1.
- `/settings` — Workspace configuration and reset controls. P1.
- `/family-law` — Locked Family Law placeholder. P2.

## Data entities and seed values

### Workspace/project
- Project: HealthHub
- Repository: `acme/healthhub-web`
- Branch: `main`
- Files: 342
- API routes: 48
- Database tables: 21
- Users: 12,840
- Enterprise plan: true
- User: Anmol (Compliance Lead)

### Findings (code)
Seed values are derived from the PRD and include 12 findings (F-001 through F-012):
- Severity breakdown: 4 critical, 5 high, 3 medium.
- Example clauses: health-data consent collection, retention window, cross-border transfer, logging of PII, unredacted token capture, direct user identity mapping.
- Each finding includes: id, title, severity, location, regulation, score delta, status, suggestion, before/after code.
- Overall code issue delta target: 74 → 82 → 86 after AI fixes.

### Documents
- 4 seeded docs plus a Privacy Policy demo.
- Demo document findings: D-01 to D-11.
- Score progression: 68 → 73 → 81 → 84 → 90 → 94.
- Findings focus on retention, DPO contact, cross-border transfer, transparency, consent, and notice.

### Runtime events
- Initial counters: Active sessions 128; events today 1,842; blocked 17; critical 2.
- Event IDs RT-001 through RT-008.
- Common event stream themes: bulk data extraction, abnormal API burst, suspicious session bloom, malicious geolocation anomaly, prompt injection signal, etc.
- On block action: blocked count increments by 1 and runtime critical drops from 2 to 1.

### Notifications
- 3 seed notifications with age stamps: 5 min ago, 18 min ago, 32 min ago.
- Notifications cover fix readiness, security incident investigation, and exported report status.

### Audit logs
- 4 seed audit items with timestamps: 20:14, 20:11, 19:52, 19:32.
- Entries correspond to score recalculation, remediation, access policy updates, and document acceptance.

### Dashboard sub-scores
- GDPR: 76
- DPDP: 71
- Security: 80
- Documentation: 68
- Risk trend series: 7-day seed (Mon 82, Tue 79, Wed 75, Thu 70, Fri 64, Sat 61, Sun 58) with a downtrend as fixes are accepted.

### Reports
- 4 report cards.
- Report types: GDPR Compliance Report, DPDP Assessment, DPIA, RoPA / Article 30.

### Assistant
- Chips for common risk questions and summary actions.
- Response tone: brief, enterprise and action-oriented.

## State rules
- Every action is staged and takes 1.5–8 seconds with a checklist and progress indicator.
- Clicking a finding or document issue opens a drawer with status and remediation detail.
- Generating a fix marks the issue as reviewed and updates the score delta immediately after the staged sequence.
- Applying a fix resolves the finding, changes status to resolved, updates score, pushes an audit log, and adds a notification.
- Rejecting a document clause keeps the original clause and leaves the finding open.
- Accepting a document clause updates the clause preview and increases the score according to the exact progression: 68 → 73 → 81 → 84 → 90 → 94.
- Runtime event investigation marks the event as reviewed and can flip the status from critical to blocked after action.
- Reset Workspace restores the exact seed state using structuredClone of the initial seed data.

## Expected numbers
- Code score: 74 → 82 → 86
- Document score: 68 → 73 → 94
- Runtime critical count: 2 → 1
- Blocked count: 17 → 18
- Dashboard critical total: 9 → 8 after F-001 fix
- Total number of code findings: 12
- Total document findings: 11
- Distinct dashboard sub-scores: GDPR 76 / DPDP 71 / Security 80 / Documentation 68

## Design tokens
- Theme: Midnight Navy with light content surfaces
- Brand: `#4F46E5`
- Background: `#F6F7F9`
- Sidebar: `#0B1220`
- Module accent colors: code `#0891B2`, docs `#7C3AED`, runtime `#E11D48`
- Radius: Buttons 8px, cards 12px
- Motion: 150–200ms fades and slides
- Typography: Inter UI, JetBrains Mono for code and tokens, Playfair Display on login hero only
- Elevation: light card shadow and thin borders, no heavy blur shadow

## Tech stack and architecture rules
- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui (Radix primitives usage pattern)
- Lucide React
- Recharts
- Framer Motion
- React Router
- Zustand
- cmdk
- Sonner
- Shiki
- @fontsource/inter, @fontsource/jetbrains-mono, @fontsource/playfair-display
- clsx, tailwind-merge, class-variance-authority
- UI components → Zustand stores → services/mock* → mock/seed data
- No direct mock imports in components
- No hardcoded cross-screen numbers in components
- Async flows are staged, not instant
- Service signatures are designed for future API replacement

## Brand assets found
- Logo file: `logo.jpeg`
- White background appears on logo asset; usage on dark surfaces must be white rounded chip or cropped icon, never raw on navy
- Tagline: "From compliance detection to automated remediation."

## UI/UX reference observations
- Dark navy sidebar + light content workspace is the primary pattern.
- The dashboards are dense enterprise monitors with high information hierarchy and minimal ornament.
- Findings and audit tables follow compact rows with tabular metrics.
- Split views are used for document review suggestions and code diff review.
- The visual system emphasizes status chips, minimal badges, and clear module accents.
- Login uses a dark gradient panel on the left with a large display hero and a lighter form area on the right.
