# AI Accelerator Suite

AI Accelerator Suite is a React and TypeScript workspace prototype for reviewing software compliance, policy documents, and runtime security events. It combines seeded HealthHub demo data with one live external integration: chat completions through OpenRouter.

This guide describes the current implementation. Values and activity presented by the demo workspace are sample data unless a section specifically says it makes a live request.

## At a glance

- **Application type:** Single page web application (SPA)
- **Frontend:** React 19, TypeScript, Vite
- **Routing:** React Router
- **State:** Zustand, in memory
- **Charts:** Recharts
- **Icons:** Lucide React
- **Motion:** Framer Motion
- **Assistant provider:** OpenRouter Chat Completions API, called through a Vite development middleware
- **Primary demo workspace:** HealthHub (`acme/healthhub-web`, branch `main`)
- **Product areas:** Dashboard, Code Scanner, Documents, Compliance Center, Runtime Security, Audit Logs, Reports, Ask AI

## Contents

- [What the product does](#what-the-product-does)
- [Pages and features](#pages-and-features)
- [Workflows and actions](#workflows-and-actions)
- [Data model and state](#data-model-and-state)
- [Architecture and key files](#architecture-and-key-files)
- [Technology](#technology)
- [Run the project locally](#run-the-project-locally)
- [OpenRouter setup](#openrouter-setup)
- [Build and code quality commands](#build-and-code-quality-commands)
- [Visual system and responsive behavior](#visual-system-and-responsive-behavior)
- [Current scope and production considerations](#current-scope-and-production-considerations)

## What the product does

The product presents a unified compliance and security workspace. It is designed to help a team:

1. Review a workspace-level risk and compliance summary.
2. Inspect seeded code and policy findings, including severity, location, affected regulation, and suggested remediation.
3. Review policy document clauses and accept a suggested change.
4. Triage a sample runtime security event and mark it isolated in the interface.
5. Review compliance coverage for UK GDPR, India's DPDP Act, and an internal security policy.
6. Search and filter the sample audit events and export summaries as CSV.
7. Ask an AI assistant questions using the current findings, document issues, and runtime events as context.

## Pages and features

### Login (`/login`)

- Shows the AI Accelerator Suite brand and an enterprise-themed sign-in screen.
- Offers an **Explore interactive demo** action.
- Includes email and password fields, a remember-device checkbox, a forgot-password message, and a Microsoft Entra ID-styled action.
- The current sign-in, demo launch, and SSO buttons enter the demo workspace. They do not validate credentials or perform identity-provider authentication.

### Dashboard (`/`)

- Summarizes overall, GDPR, DPDP, security, and documentation scores.
- Charts coverage across GDPR, DPDP, Security, and Documents.
- Shows priority findings, recent document actions, recent activity, report cards, and notifications from the sample state.
- Provides links to the scanner and other workspace sections.

### Code Scanner (`/scanner`)

- Lists the twelve seeded code and security findings with severity, source location, and status.
- The **Run scan** button animates a four-stage progress display: Detect, Understand, Fix, Verify.
- When the demo sequence finishes, the overall workspace score is set to 92.
- The scan does not connect to a repository or analyze source files. Finding rows are seeded demo records.

### Documents (`/documents`)

- Shows a document review workspace with sample policy metadata, issue counts, score, and filing status.
- **Use demo policy** selects the sample policy name. **Upload document** lets the browser select a PDF, DOC, DOCX, or TXT file and shows its filename.
- Presents original and suggested clause text, a list of five seeded document issues, and a version-history panel.
- Lets the user select a finding, advance to the next finding, and accept a suggested change. Accepting updates the in-memory status and adds an audit event.
- Exports the review summary as CSV.
- Selecting a file does not upload it to a server or analyze its contents; the displayed analysis is sample content.

### Compliance Center (`/compliance`)

- Displays seeded coverage cards for UK GDPR, India DPDP Act 2023, and the internal security policy.
- Shows sample control coverage, passed-control counts, and category metrics.
- Filters the findings table by all, needs remediation, or resolved.
- Allows findings to be marked resolved or reopened; updates live in the client state.
- Includes a sample evidence-sync confirmation and a CSV executive brief export.

### Runtime Security (`/runtime`)

- Presents sample runtime telemetry and five seeded threat events.
- Filters events by severity, selects an event, and shows a sample investigation panel with event details and risk text.
- **Apply isolation** changes the selected event's display state to isolated for the current session.
- **Escalate for review** displays a confirmation message.
- Exports the event snapshot as CSV.
- The telemetry, isolation, ledger, and security signals are UI demo data; no external runtime monitoring service is connected.

### Audit Logs (`/audit`)

- Lists seeded audit events, including updates made by supported demo actions.
- Filters by module and searches the visible audit entries.
- Exports the audit trail as CSV.
- Ledger height, hashes, timestamps, attestation, and verification badges are illustrative presentation data, not cryptographic proofs.

### Reports (`/reports`)

- Displays four sample report cards: GDPR Compliance Report, DPDP Assessment, DPIA Review, and RoPA / Article 30.
- Shows sample status, score, and update time.
- Supports an aggregate CSV export and per-report CSV downloads.
- The export contains the report card fields; it does not generate a regulator-ready PDF report.

### Ask AI (`/ask-ai`)

- Provides free-text questions and three suggested prompts.
- Sends a bounded recent conversation plus current finding, document, and runtime-event summaries to the local `/api/chat` endpoint.
- The Vite middleware forwards the prompt to OpenRouter and returns the assistant reply.
- Shows a loading state, the conversation, and API error messages.
- The assistant is instructed to explain workspace data and offer practical next steps, without claiming it took actions or giving legal advice.

## Workflows and actions

| User action | Current result | Persistence |
| --- | --- | --- |
| Enter the demo or submit login form | Opens the workspace | No authentication service; demo state is in memory |
| Run scan | Plays staged progress and sets score to 92 | In-memory until page reload |
| Select a document file | Displays selected filename | No upload or content parsing |
| Accept a document suggestion | Updates status and prepends an audit entry | In-memory until page reload |
| Resolve or reopen a finding | Updates finding status | In-memory until page reload |
| Apply runtime isolation | Marks the selected event isolated in the view | Component state only |
| Ask AI | Sends chat and workspace context to OpenRouter | Chat is component state; provider may process request data |
| Export a CSV | Downloads the current sample rows in the browser | Downloaded to the user's device |
| Reset demo | Restores the initial seeded state | In-memory reset |

## Data model and state

`src/types.ts` defines the primary types:

- `WorkspaceState`: user, project, repository, branch, inventory counts, and compliance scores.
- `Finding`: code or control issue, severity, location, regulation, suggested fix, before/after examples, and status.
- `DocumentIssue`: policy issue, affected section, proposed wording, score impact, and review status.
- `RuntimeEvent`: event source, severity, status, timestamp, and description.
- `NotificationItem`, `AuditEvent`, and `ReportCard`: supporting dashboard data.
- `AppSeedState`: the complete initial demo workspace state.

`src/mock/seed.ts` provides the HealthHub sample values. `src/store/appStore.ts` initializes Zustand from a structured clone of that seed and defines actions for sign-in state, reset, findings, document statuses, notifications, runtime events, and scores. The store is not backed by a database or browser persistence layer.

## Architecture and key files

```text
ai-accelerator/
├── public/
│   ├── logo.jpeg             # Product wordmark used in the UI
│   └── icons.svg             # Public icon sprite
├── src/
│   ├── App.tsx               # App shell, routes, page components, chat UI
│   ├── App.css               # App-level styles
│   ├── index.css             # Global styles and responsive layout rules
│   ├── main.tsx              # React entry point and font imports
│   ├── types.ts              # Shared TypeScript data models
│   ├── mock/seed.ts          # Demo workspace records
│   └── store/appStore.ts     # Zustand state and actions
├── .env.example              # Safe environment variable template
├── .env.local                # Local-only configuration; do not commit
├── index.html                # HTML shell and document metadata
├── package.json              # Scripts and dependencies
├── vite.config.ts            # Vite config and local OpenRouter middleware
└── PROJECT.md                # This project guide
```

The app entry point mounts `App` inside React `StrictMode`. `App.tsx` wraps the interface in `BrowserRouter`, uses a shared sidebar and top bar for authenticated demo routes, and routes unauthenticated users to `/login`. Page and shell state is managed with React hooks and Zustand.

## Technology

### Runtime dependencies

- **React / React DOM:** user interface
- **TypeScript:** static type checking
- **Vite:** development server and production bundler
- **React Router:** client-side navigation
- **Zustand:** shared demo workspace state
- **Recharts:** dashboard visualizations
- **Lucide React:** interface icons
- **Framer Motion:** small entrance and transition effects
- **Inter / JetBrains Mono:** interface and monospaced typography

The dependency manifest also includes Tailwind CSS, `cmdk`, `sonner`, `shiki`, `clsx`, `tailwind-merge`, and `class-variance-authority`. The current pages primarily use the existing CSS styles in `src/index.css` and `src/App.css`.

## Run the project locally

Requirements: a current Node.js release with npm.

From the `ai-accelerator` directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The demo workspace is seeded as authenticated by default; use `/login` to view the sign-in screen.

## OpenRouter setup

1. Copy `.env.example` to `.env.local`.
2. Set `OPENROUTER_API_KEY` to a valid OpenRouter key in `.env.local`.
3. Optionally set `OPENROUTER_MODEL` to a model available to the OpenRouter account. The default is `openrouter/auto`.
4. Restart the Vite development server and open **Ask AI**.

The browser calls `/api/chat`; it does not receive the key. `vite.config.ts` registers a development-server middleware that validates the request, adds a system instruction, and sends the request to `https://openrouter.ai/api/v1/chat/completions`. It accepts POST requests with up to 20 user or assistant messages, limited to 4,000 characters each, and rejects request bodies above 32 KB. The middleware requests up to 700 completion tokens.

The middleware is available in Vite's development server only. A production deployment must provide an equivalent authenticated server-side endpoint and store the key as a server secret. Do not place an API key in frontend code or commit `.env.local`.

## Build and code quality commands

```sh
npm run build    # TypeScript project build and Vite production bundle
npm run lint     # Oxlint
npm run preview  # Serve the production build locally
```

## Visual system and responsive behavior

- The app uses a shared dark navigation sidebar, a light content canvas, and a consistent top bar on workspace pages.
- Brand artwork is served from `public/logo.jpeg` and used in the sidebar, login screen, and browser tab icon.
- Global and page styles are in `src/index.css` and `src/App.css`; responsive rules adapt navigation, cards, tables, and page layouts to narrower viewports.
- Icons come from Lucide React. Dashboard charts use Recharts.
- The project does not currently define a separate Tailwind configuration or a formal component library; page components compose shared CSS classes and a small set of reusable display patterns.

## Demo MVP additions

The workspace now includes additional frontend-only roadmap demonstrations:

- **Code Scanner:** after the four stage scan, shows a seeded PII data map, UK GDPR / India DPDP requirements and exportable developer actions.
- **Documents:** supports a document type selector and generates a downloadable corrected sample text file once seeded issues are accepted.
- **Runtime Security:** supports a manual demo theft scenario, an illustrative firewall kill-switch, isolation feedback, and eBPF-style sample trace output.
- **VDI Protection (`/vdi`):** demonstrates session source selection, allow / redact / block clipboard policies, client-side PII redaction, counters, event history, and supported detector examples.
- **Family Law (`/family-law`):** demonstrates Form E sample extraction, flagged bank transactions, a simple Section 25 bracket model, and asset schedule export/sign-off.
- **Reports:** includes sample Article 30 RoPA and DPIA tables with CSV exports and regeneration timestamp.
- **Industry Comparison (`/comparison`):** shows directional competitor positioning and relative cost bars.
- **Audit Logs:** includes an illustrative chain verification interaction and receives events from new demo actions.

New interactions operate on hardcoded sample content in the browser and add audit entries where available. They do not provide legal advice, validate regulatory compliance, scan real code, connect to a VM, or protect real clipboard traffic. Downloads are illustrative demo artifacts. Ask AI remains connected through the existing OpenRouter middleware.

## Current scope and production considerations

- This repository currently implements a client-side product prototype, not a multi-tenant backend.
- Workspace data, demo account state, findings, document statuses, and audit events are held in browser memory and reset on reload.
- Login, Microsoft Entra ID, repository scanning, document upload and analysis, runtime telemetry, isolation, evidence synchronization, and ledger verification are demo interactions and must be connected to real services before being treated as production capabilities.
- The OpenRouter chat integration is live when the local development middleware has a valid key. Prompts include workspace summaries; configure data handling and user consent appropriately for the data used.
- CSV exports are generated in the browser from the current displayed sample state.
- The application provides operational compliance guidance, not legal advice or a certification that a system meets a regulation.
