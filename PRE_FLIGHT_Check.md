# Pre-Flight Check

## 2026-10-06 — #25 budgeted all-part High Res Dev implementation

- PASS: live refs were verified before work: `wd/25-texture-coverage@85a0644466c82b928daa10f53498f4e586215f4c` and `WITCH_DEV_MAIN@0e6717a2396106480adbc7c0c4c9dccb13704402`; existing ACTIVE PROTECTED #25 branch reused.
- PASS: current WITCH_DEV_MAIN was merged into the issue branch before implementation; only rolling-state docs conflicted and canonical Dev runtime-delivery changes were preserved.
- PASS: new hidden module `texture-quality-all-part-promotion` v0.1.0 / `0.1.0-budgeted-normal-promotion` is registered in manifest moduleRegistry/modules after Active Decal Priority.
- PASS: service dynamically enumerates all displays/rendered URL-backed normal bindings, excludes specialized core body/face targets, resolves verified variants with positive/negative caching, shares loaded textures by URL, and budgets repeated source groups per display.
- PASS: selection never intentionally shrinks a host; post-pack verification rejects and rolls back the whole optional pass if any existing atlas allocation is downsized.
- PASS: owned `atlasScale`, `_usedTextureSize`, and normal uniform bindings snapshot exact prior state and restore only while the applied value is still owned; later outside edits are preserved.
- PASS: optional source/load/pack failures are isolated from core High Res and expose selected/downgraded/skipped/failed/restored diagnostics.
- PASS: `node --check`, JSON parsing, and `git diff --check` pass.
- PASS: focused VM tests pass 13/13 across all-part coverage plus existing Texture Quality ownership/readiness regressions.
- PASS: HF.Status feature-registry impact gate checked on `HF.Status:dev`; no new reporter-facing feature ID/path is created because this is an internal service under the existing Texture Quality feature.
- PASS: Dev launcher header/runtime and manifest registry are synchronized at v1.17.0 / `1.17.0-all-part-promotion` for the payload candidate.
- PENDING: after this candidate commit exists, pin the Dev launcher to that exact immutable payload SHA, then run the required seven-fixture HF-Chat-Bridge live regression matrix.
- No Stable/public promotion is authorized or performed.
