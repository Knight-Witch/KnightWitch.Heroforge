# Changelog

## Latest repository change — 2026-10-07

- #107 adds the Dev-side Public Beta Tester infrastructure without changing Public Stable runtime behavior.
- New standalone `WITCH DOCK - BETA TESTER` v0.1.0 / `0.1.0-public-beta-channel` layers onto normal Stable and refuses the Dev channel. It owns a Utilities Beta Tester surface, master ON/OFF, per-module ON/OFF, manual manifest refresh, visible `IN BETA` labels, per-module Beta report actions, and targeted diagnostic capture.
- `beta/manifest.json` is the separate Public Beta runtime authority. The moving manifest may activate/pause/graduate/remove modules, but executable module code must be pinned to an immutable 40-character Witch Dock payload SHA and exact source path. The initial manifest is intentionally empty.
- Beta modules use an explicit reversible registration contract: exact id/version/build plus `activate()` / `deactivate()`; optional `render()`, `getState()`, and `dispose()`. Modules that cannot safely hot-disable must declare `requiresReloadToDisable` rather than faking live removal.
- Beta Tester rejects modules when the installed Stable version is below the manifest/module minimum, keeps Stable startup independent from Beta failure, and captures only bounded Beta host/module diagnostic state.
- Dev Bug Capture UI advances to v0.4.6 / `0.4.6-context-diagnostic-providers`. Contextual callers may request additional local diagnostic providers; that list is sanitized/bounded and deliberately excluded from submitted HF.Status `sourceContext`, preserving the existing report schema.
- Provider-independent delivery adds the additive `/beta` channel for the Beta Tester and moving manifest. Beta executable modules still use immutable `/payloads/<sha>/...` delivery.
- Promotion cleanup is defined as one manifest revision of a disabled `graduated` tombstone so already-open pages can deactivate cleanly, followed by removal; Git history remains the archive. A later patch test can re-add the same module ID with a newer immutable payload.
- HF.Status issue #112 is the paired owner for the distinct `wd-beta-qa` / `public-beta-testing` taxonomy and Beta/QA triage bucket. No second reporter endpoint/backend is introduced.
- Validation passes: Beta Tester tests 8/8, reporter contextual-provider regressions 3/3, runtime delivery tests 14/14, userscript/reporter syntax checks, JSON parses, and `git diff --check`.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Canonical Dev remains v1.17.12 / `1.17.12-independent-normal-headroom`, paired to immutable payload `0eb197e36e4231c6dde23001f74eabf04179cc6b`. #107 is staged on ACTIVE PROTECTED `wd/107-public-beta-tester` pending canonical Dev pairing/deployment and live Stable+Beta smoke.
