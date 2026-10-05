# Pre-Flight Check

## 2026-10-05 — HFJSON upstream-target correction / live-edge gate

- PASS: canonical Dev commit `159caea74078d2533bcdb1d238a5f68095b321fc` passed `npm --prefix tools/witchdock-runtime test` — 12/12 route-contract tests.
- PASS: all eight source aliases use temporary `307` / `Cache-Control: no-store`; the five supplied Lob targets match Amanda's exact GitGud URLs, ReCK targets the upstream GitHub latest-release userscript, and the two unsupplied existing targets are unchanged.
- PASS: `/HFJSON/` root redirect, alias case-insensitivity, HEAD behavior, runtime health contract, unknown-alias 404 behavior, and `git diff --check` remain valid locally.
- PASS: direct upstream smoke returned HTTP 200 for all five supplied GitGud targets and the supplied ReCK GitHub release target.
- CONFIRMED LIVE DRIFT: current public Worker deployment `1d07135d-62f9-4b49-b593-3ad4c537e7bc` returns 200 for `/health` and Stable ref resolution but 404 for `/HFJSON/` and `/HFJSON/full-res-decals.user.js`. Cause not established.
- PENDING: explicit approval before deploying the public `witchdock-runtime` edge; live alias smoke must follow deployment.
- No Stable launcher/module/manifest change. This follow-up commit is documentation-only and changes no additional public behavior.
