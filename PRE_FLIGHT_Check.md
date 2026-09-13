# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-13-059 — Heavy native settle budget

Date: 2026-09-13

### Scope

Repair false Texture Quality timeouts on heavy HeroForge generations without altering the validated High Res recipe or atlas ownership model.

### Reviewed

- current `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`;
- Texture Quality service v0.2.3 / `0.2.3-dev-stable-auto-readiness`;
- `MODULE_VERSIONING.md` patch-bump rules;
- `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md`;
- current `settle()` use across enable, rollback restore, manual Disable and Reconcile Now;
- live Seya diagnostics including the normal reconcile, projected-source experiment cleanup and final clean native baseline.

### Confirmed root cause

v0.2.3's automatic readiness gate correctly waited for a settled figure before starting, but the subsequent native reconcile could itself take much longer than the service's fixed 12-second settle window. A normal Seya reconcile returned after about 35.4 seconds with the same timeout, and a cleanup Disable/native restore took about 65.7 seconds before returning the timeout warning. HeroForge later reached `_needsUpdating=false`, `_inUpdate=false`, `finished=true`, `resourcesReady=true` and coherent 4096x4096 display/resource atlases, proving the native restore ultimately completed.

The service therefore timed out before HeroForge's heavy native work became observable as settled.

### Change

- service v0.2.4 / build `0.2.4-dev-heavy-native-settle`;
- add a 120-second bounded native settle budget;
- evaluate current renderer coherence before enforcing an expired deadline;
- if control returns after the deadline with an already-ready renderer, allow only a short bounded set of confirmation polls so the existing 3-sample stability rule can complete;
- preserve the existing scheduler/finished/resources-ready/atlas-identity/target-allocation checks.

### Excluded from this patch

No 8192 atlas forcing, broader non-body atlasScale policy, projected/splatter bake ceiling changes, verifier loosening, persistence semantic changes, UI changes or notice changes are included.

### Required validation

Before moving Dev: exact candidate JS syntax, manifest parse/version/build/cache-key consistency and diff review. Then hot-load exact v0.2.4 on the current clean Seya page with stored Persistent=true and no manual Enable; require automatic ON, no timeout, coherent native atlas, exact 1024 body masks and idle renderer. Next repeat fresh Seya/Twilight Soak transitions before any Stable promotion. Amanda supplies visual confirmation.

**Runtime behavior changed:** yes, Dev native-settle timing only.

---

## PFC-2026-09-13-058 — Persistent High Res stable-readiness gate

v0.2.3 waits for scheduler/display/atlas quiescence and a stable figure signature before automatic Persistent enable. The High Res transaction itself remained unchanged.

---

## PFC-2026-09-13-057 — D4 promoted mask-path clamp

v0.2.2 fixed D4 mask resolution after 2048 source promotion and passed D4 live automatic/manual enable plus cold reload persistence. The High Res ownership architecture remained native-reconcile based.

---

## PFC-2026-09-13-056 — Texture Quality notice hierarchy polish

Notice v0.1.2 centered section headings, changed the title typography, and split/centered the closing block. Amanda approved the result.

---

## Prior current preflight

PFC-2026-09-12-055 and earlier remain preserved in Git history. Fetch only when a current task needs their specific evidence.
