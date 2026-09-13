# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-13-057 — D4 promoted mask-path clamp

Date: 2026-09-13

### Scope

Repair the confirmed D4 Texture Quality enable failure without changing the validated native-reconcile ownership architecture or persistence UX.

### Reviewed

- current `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`;
- Texture Quality service v0.2.1 / `0.2.1-dev-visible-auto-enable`;
- `MODULE_VERSIONING.md` patch-bump rules;
- HeroForge.Compatibility `feature/rendering-texture-quality` evidence for the real-1024 body-mask contract and D4 native source promotion;
- Bridge #1783-#1787 live D4 diagnostics and reversible mask-resolution probe.

### Confirmed root cause

D4 persisted `Persistent=true` correctly. The failure occurred because its body parts had `_usedTextureSize=2048`; HeroForge's current `getMaskPath` only raises `_usedTextureSize`, so `getMaskPath(...,1024)` continued to resolve nonexistent 2048 mask paths. A reversible probe proved temporary exact-1024 seeding resolves and loads the real 1024 body masks while restoring the prior 2048 values immediately.

### Change

- service v0.2.2 / build `0.2.2-dev-mask-path-clamp`;
- add a narrow body-mask resolver that snapshots `_usedTextureSize`, temporarily seeds exactly 1024 for `getMaskPath`, then restores the original descriptor/value in `finally`;
- retain the existing post-load requirement that both mask textures are exactly 1024x1024;
- run rollback/native restore only when the service actually recorded owned policy mutations, so pre-policy mask failures do not trigger needless HeroForge regeneration;
- no Texture Quality UI or announcement code change.

### Protected behavior

Keep HeroForge native atlas/resource ownership, scale 4 / bake 2048 / used-size 1024 seed policy, legitimate native promotion through 2048, exact 1024 body-mask pinning, expected-generation adoption, stale-identity refusal, persistence/session-suppression semantics, and Booth boundaries.

### Required validation

Before any Stable promotion: exact service/manifest syntax and version/cache-key PASS; live D4 persistent automatic enable from the current stored `true` preference; verify coherent display/resource atlas, scale/bake/used/allocation bounds, exact pinned 1024 masks, scheduler idle and no error; Amanda visual D4 body/decal gate; cold reload persistence; fresh figure transition; then narrow Stable promotion only after explicit approval.

**Runtime behavior changed:** yes, Dev Texture Quality service patch only. Public Stable remains untouched.

---

## PFC-2026-09-13-056 — Texture Quality notice hierarchy polish

Notice v0.1.2 centered section headings, changed the title typography, and split/centered the closing block. Bridge #1779/#1781 passed static/live rendering checks and Amanda approved the result.

---

## PFC-2026-09-12-055 — Texture Quality announcement copy/layout polish

v0.1.1 passed exact syntax/manifest checks and live rendering checks through Bridge #1777/#1778.

---

## Prior current preflight

PFC-2026-09-12-054 and earlier remain preserved in Git history. Fetch only when a current task needs their specific evidence.
