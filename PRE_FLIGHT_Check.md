# Pre-Flight Check

## 2026-10-07 — #107 Public Beta delivery proof + lifecycle closeout policy

- PASS: ACTIVE PROTECTED `wd/107-public-beta-tester` remains the sole #107 task branch and is fast-forwarded to canonical Dev v1.17.13.
- PASS: canonical Dev v1.17.13 / `1.17.13-public-beta-channel` remains paired to immutable payload `8b92fc76f6ed6715b103d026338da5b0694d5a21`; this commit changes documentation/process only.
- PASS: GitHub `WITCH_DEV_MAIN` and Bitbucket recovery `WITCH_DEV_MAIN` have identical delivered trees; recovery retains canonical GitHub ancestry.
- PASS: live `https://witchdock.knightwitch.dev/beta/ref.json` returns canonical Dev head and 200.
- PASS: live `/beta/manifest.json` and `/beta/Witch_Dock_Beta_Tester.user.js` return 200 with `Access-Control-Allow-Origin: *`, `Cache-Control: no-cache, max-age=0`, and provider-independent Witch Dock origin headers.
- PASS: focused Beta Tester + contextual reporter tests pass 11/11; runtime Worker route tests pass 14/14.
- PASS: Beta host rejects moving/non-immutable module refs, enforces Stable minimum version, supports live reversible master/module OFF, refuses false live-disable for reload-required modules, visibly marks modules IN BETA, and registers bounded beta-only diagnostics.
- PASS: `DEV_WORKFLOW.md` now makes Beta reconciliation part of normal post-Stable closeout: one manifest revision of disabled `graduated` state, then removal on the next normal Beta maintenance pass; Git history is the archive.
- PASS: feature-registry impact remains owned by HF.Status #112; no taxonomy duplication is added inside Witch Dock.
- PENDING: real Stable+Beta browser smoke with normal Stable still authoritative.
- PENDING: HF.Status #112 Dev implementation/validation and, if Amanda authorizes it separately, narrow public Bug Capture UI v0.4.6 promotion for automatic Beta-specific diagnostic provider capture inside the canonical reporter.
- No runtime/module/manifest/public behavior changed in this documentation/process commit. Public Stable remains unchanged.
