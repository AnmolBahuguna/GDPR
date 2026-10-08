# Decisions log

- 2026-10-08: Resolved the theme conflict in favor of `techstack.md`: brand `#4F46E5`, background `#F6F7F9`, and sidebar `#0B1220`. This is the authoritative source over the PRD color references.
- 2026-10-08: Resolved the database model mismatch by using 21 tables consistently across the app and docs, rather than the conflicting 17-model note in one PRD section.
- 2026-10-08: Applied the score formula `overall = Math.min(99, 74 + codeDelta + Math.round(docDelta * 0.25))` as the canonical scoring behavior.
- 2026-10-08: The raw logo asset has a white background; on dark navy surfaces it will be displayed as a white chip or icon crop, never directly on navy.
- 2026-10-08: Light-only theme selected; dark mode remains deferred as a P2 item.
- 2026-10-08: For showability and demo reliability, refresh will reset to a fresh seeded state rather than keeping persisted state across sessions.
- 2026-10-08: Mockups and design references are used as visual direction; the implemented product follows the authoritative stack and phase plan rather than any single HTML mockup alone.
