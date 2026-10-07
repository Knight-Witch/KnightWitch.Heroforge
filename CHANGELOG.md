# Changelog

## Latest repository change — 2026-10-07

- #107 Public Beta Tester implementation is integrated into canonical Dev locally and Dev packaging advances to v1.17.13 / `1.17.13-public-beta-channel`.
- Standalone `WITCH DOCK - BETA TESTER` v0.1.0 layers onto normal Stable, with a separate moving beta manifest, immutable per-module payload SHAs, live reversible module toggles, `IN BETA` labeling, bounded Beta diagnostics, and canonical reporter reuse.
- Dev Bug Capture UI is v0.4.6 / `0.4.6-context-diagnostic-providers`, adding sanitized local contextual provider selection without changing submitted HF.Status sourceContext.
- Provider-independent delivery includes the additive `/beta` channel; executable Beta modules remain immutable `/payloads/<sha>/...` content.
- Promotion cleanup uses one disabled `graduated` manifest revision followed by removal; Git history is the archive.
- HF.Status issue #112 owns the paired `wd-beta-qa` / `public-beta-testing` taxonomy and Beta/QA triage work.
- Validation remains green: repository tests 39/39, Worker route tests 14/14, userscript/reporter syntax, JSON parses, and diff check.
- Public Stable remains v2.4.2 and unchanged.

## Latest Dev delivery context

Dev launcher/manifest are prepared at v1.17.13 / `1.17.13-public-beta-channel`. The prior immutable payload pin is intentionally retained until this candidate commit receives its SHA; the next pairing commit will pin that exact v1.17.13 payload.
