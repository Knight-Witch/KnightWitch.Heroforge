# Pre-Flight Check

## 2026-10-06 — #25 all-part High Res v0.1.5 initial-coverage race

- PASS: existing ACTIVE PROTECTED `wd/25-texture-coverage` remains the sole #25 task branch and was fast-forwarded to canonical Dev v1.17.4 before this correction.
- PASS: live v0.1.4 confirmed the exact queue/start race: core settled, all-part showed `initialCoveragePending=false` but `lastRun=idle` and `activeBindings=0`.
- PASS: only `runCoverage()`, after readiness guards pass, may now clear `initialCoveragePending`; enable/reconcile/attach/refresh queue sites no longer clear it.
- PASS: regression reproduces a queued pass rejected by a subsequent core-busy transition, proves the obligation remains, then proves one successful `attach-ready` retry and no duplicate refresh-driven run.
- PASS: v0.1.3 event-driven change observation remains intact: 600 ms outside-change debounce, owned-lifecycle suppression, reversible data-change observers, outside-edit preservation, and no renderer-signature polling.
- PASS: full static/runtime-delivery gates pass: module syntax, Texture Quality VM 19/19, inherited runtime-delivery 12/12, manifest/divergence validation, and git diff check.
- PASS: Dev launcher header/runtime and manifest launcher registry are prepared at v1.17.5 / `1.17.5-initial-coverage-race`; prior payload pin is retained until the payload candidate commit exists.
- PASS: Dev launcher pins exact immutable v1.17.5 payload candidate `07c245f16c1a869d8b680bfef2859825e0c099a4`; candidate manifest contains all-part v0.1.5 / `0.1.5-initial-coverage-race`.
- PENDING: verify recovery parity, then Counting Sheep initial-coverage + anti-loop proof and remaining fixture/lifecycle regression.
- No Stable/public promotion is authorized or performed.
