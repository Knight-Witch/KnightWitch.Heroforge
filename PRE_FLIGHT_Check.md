# Pre-Flight Check

## 2026-10-07 — #107 Public Beta Tester implementation checkpoint

- PASS: required Witch Dock contract/router/branch governance/runtime delivery/module versioning sources were read before implementation.
- PASS: GitHub issue #107 owns this workstream; sole branch `wd/107-public-beta-tester` is ACTIVE PROTECTED and was registered before material implementation.
- PASS: standalone Beta Tester v0.1.0 layers only onto normal Stable and refuses `WITCH DOCK - DEV`.
- PASS: moving Beta manifest is separate from the normal application manifest; active executable entries require exact id/version/build, immutable 40-character payload SHA, safe path, explicit status, and reversible module lifecycle.
- PASS: master/module toggles deactivate reversible modules live; `requiresReloadToDisable` prevents false hot-unload claims.
- PASS: minimum Stable version is enforced before beta source execution.
- PASS: beta provider reports bounded channel/module state and excludes module source, raw character JSON, and credentials.
- PASS: Bug Capture UI v0.4.6 accepts sanitized/bounded contextual diagnostic provider IDs for local T0/current capture while keeping those IDs out of the submitted HF.Status `sourceContext`.
- PASS: provider-independent Worker route tests prove `/beta/ref.json` resolves canonical `WITCH_DEV_MAIN` and `/beta/*` maps only to the repo `beta/` directory; existing delivery/HFJSON tests remain green.
- PASS: Beta Tester tests 8/8; reporter contextual-provider tests 3/3; Worker route tests 14/14.
- PASS: `node --check` passes for Beta Tester and Bug Capture UI; Beta/main manifests and DEV_DIVERGENCES parse; `git diff --check` passes.
- PASS: main module registry bumps only the changed active Bug Capture UI to v0.4.6. Standalone/transient Beta modules intentionally remain governed by `beta/manifest.json`, not the application module registry.
- PASS: HF.Status issue #112 owns the feature-registry-impact work for new `wd-beta-qa` / `public-beta-testing` taxonomy and Beta/QA triage classification.
- PENDING: commit/push this #107 checkpoint, integrate canonical Dev, pair a new immutable Dev payload, mirror recovery, deploy/verify the additive `/beta` Worker route, then live-smoke Beta Tester against Public Stable.
- PENDING: automatic targeted Beta provider capture inside the public Stable reporter requires a later explicit narrow Stable promotion of the generic v0.4.6 reporter seam. Beta Tester can still export targeted Beta diagnostics independently before that promotion.
- No Public Stable runtime/module promotion is authorized or performed.
