# Pre-Flight Check

## 2026-10-06 — #25 all-part High Res v0.1.1 correction

- PASS: existing ACTIVE PROTECTED branch `wd/25-texture-coverage` remains the sole #25 task branch; current canonical Dev history is integrated locally before the correction.
- PASS: live v0.1.0 fault was diagnosed from Bridge/runtime evidence, not visual guesswork: core High Res was stable on two figures while all-part repeatedly ran `scene-change` coverage and accumulated 82 restores.
- PASS: source confirmed the feedback path: Native Reconcile UI calls `service.refresh()` every 250 ms, while v0.1.0's refresh wrapper included display generation, atlas allocation, and normal-source state in its scene signature.
- PASS: faulty optional all-part v0.1.0 was disposed once; readback confirmed its global removed and HeroForge settled with no active update while core/display readiness remained intact.
- PASS: v0.1.1 no longer writes generic `_usedTextureSize`; density is requested through owned `atlasScale` plus the existing Native Reconcile lifecycle, with native used-size changes observed solely for exact rollback.
- PASS: source-only upgrades bind verified higher normal resources without unnecessary atlas rebuild/reconcile.
- PASS: structural scene signature excludes display generations, atlas dimensions/allocations, normal bindings, scales, and used sizes, while still changing for figure/part identity changes.
- PASS: figure-replacement rollback reconciles against the current live display set, restores old owned state exactly, and does not wait on stale display identities.
- PASS: focused VM Texture Quality tests pass 17/17, including polling-loop prevention, figure replacement, failure isolation, cache reuse, repeated-instance budgeting, collateral detection, outside-edit preservation, multi-display enumeration, and disposal.
- PASS: full static/runtime-delivery gates pass: module syntax, JSON/manifest/divergence validation, git diff check, Texture Quality VM 17/17, inherited runtime-delivery 12/12.
- PENDING: new immutable Dev payload pairing, provider-independent parity, then Counting Sheep revalidation and the remaining required fixture/lifecycle matrix.
- No Stable/public promotion is authorized or performed.
