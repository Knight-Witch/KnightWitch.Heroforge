# Pre-Flight Check

## 2026-10-06 — #25 all-part High Res v0.1.7 native priority + OFF→ON re-arm

- PASS: existing ACTIVE PROTECTED `wd/25-texture-coverage` remains the sole #25 task branch and is integrated through canonical Dev v1.17.6 before this correction.
- PASS: v0.1.6 live Counting Sheep selected 38 bindings with 7 downgrades, 33 skips, zero failures, no rollback/error, and no self-loop across the prior recurrence window.
- PASS: v0.1.6 OFF restored all 83 all-part-owned normal/atlasScale/observed-used entries exactly; every returned entry was `restored=true`, `outside=false`.
- PASS: core OFF completed with the already-known #34 bodyLower restore warning; this remains outside #25 scope.
- PASS: v0.1.6 OFF→ON exposed a real #25 gap: core returned healthy persistent ON while all-part remained at zero active bindings because the initial coverage obligation was not re-armed.
- PASS: v0.1.7 re-arms the initial obligation on disable and whenever refresh observes core OFF; regression proves the next enable runs exactly once and repeated refresh polling does not duplicate it.
- PASS: v0.1.7 uses HeroForge intrinsic ideal-texture metadata for group priority before repeat count/deficit, without using bake ceiling or current allocation as the primary importance signal.
- PASS: v0.1.6 detached native `CK.Atlas` packing preflight remains intact: unsafe density targets are downgraded/skipped before live mutation and unrelated baseline hosts may not shrink.
- PASS: full gates pass: all-part VM 18/18, inherited ownership 4/4 (22/22 combined), runtime-delivery 12/12, module syntax, manifest/divergence consistency, and git diff check.
- PENDING: new immutable Dev payload pairing and recovery parity, then Counting Sheep OFF→ON revalidation and the remaining seven-fixture/lifecycle matrix.
- No Stable/public promotion is authorized or performed.
