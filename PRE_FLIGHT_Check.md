# Pre-Flight Check

## 2026-10-05 — HFJSON upstream-target correction

- PASS: `npm --prefix tools/witchdock-runtime test` — 12/12 route-contract tests pass.
- PASS: all eight aliases return temporary `307` responses with `Cache-Control: no-store`; the five supplied Lob targets match Amanda's exact GitGud URLs, ReCK targets the upstream GitHub latest-release userscript, and the two unsupplied existing targets are unchanged.
- PASS: `/HFJSON/` root redirect, alias case-insensitivity, HEAD behavior, runtime health contract, and unknown-alias 404 behavior remain intact.
- PASS: `git diff --check` reports no whitespace errors.
- PENDING: explicit approval before deploying the public `witchdock-runtime` edge and performing live alias smoke.
- No Stable launcher/module/manifest change. Canonical Dev Worker source only; public behavior remains unchanged until deployment.
