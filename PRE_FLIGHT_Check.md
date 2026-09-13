# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-13-058 — Persistent High Res stable-readiness gate

Date: 2026-09-13

### Scope

Repair heavy-figure Persistent High Res transition failures without changing the validated texture-quality reconcile transaction.

### Reviewed

- current `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`;
- Texture Quality service v0.2.2 / `0.2.2-dev-mask-path-clamp`;
- `MODULE_VERSIONING.md` patch-bump rules;
- current native scheduler/display readiness contract used by `settle()`;
- Bridge #1797-#1800 heavy Twilight Soak diagnostics and one bounded settled-state enable.

### Confirmed root cause

Twilight Soak failed during automatic persistence with a reconcile timeout and one recorded 512x512 bodyLower allocation, but the restored native figure later reported an idle scheduler, finished/resources-ready display and coherent 4096x4096 atlas. Running the unchanged v0.2.2 manual Enable once after that settled state succeeded in ~3.9 seconds with 2048x2048 target allocations and exact 1024 body masks. Seya showed the same user-visible pattern of an early failure followed by later recovery.

This supports an automatic-start readiness defect rather than a motherload atlas-capacity failure for these tested figures.

### Change

- service v0.2.3 / build `0.2.3-dev-stable-auto-readiness`;
- automatic Persistent enable now waits for scheduler idle, resources/finished not false and display/resource atlas identity;
- require the same character/data/display/modded/atlas plus full part signature and target allocations to remain unchanged for 1200 ms before calling the existing `enable({automatic:true})` path;
- reset the stability window on any generation/signature change;
- exit the pending auto wait if HeroForge becomes hidden so foreground `visibilitychange` can reschedule normally;
- retain the existing 30-second readiness bound;
- manual Enable, texture policy, mask resolution, native lifecycle, verifier and rollback remain unchanged.

### Required validation

Before advancing beyond Dev: exact service syntax and manifest parse/version/cache-key consistency; live v0.2.3 auto-enable on a settled current figure; then fresh heavy transitions Seya and Twilight Soak with Persistent checked and no manual Enable. Require no early failure, successful automatic ON state, coherent native atlas, valid 2048-or-supported target allocations, exact 1024 body masks and idle scheduler. Amanda supplies visual confirmation. Public Stable remains untouched pending explicit promotion approval.

**Runtime behavior changed:** yes, Dev automatic-persistence readiness only.

---

## PFC-2026-09-13-057 — D4 promoted mask-path clamp

v0.2.2 fixed D4 mask resolution after 2048 source promotion and passed D4 live automatic/manual enable plus cold reload persistence. The High Res ownership architecture remained native-reconcile based.

---

## PFC-2026-09-13-056 — Texture Quality notice hierarchy polish

Notice v0.1.2 centered section headings, changed the title typography, and split/centered the closing block. Amanda approved the result.

---

## Prior current preflight

PFC-2026-09-12-055 and earlier remain preserved in Git history. Fetch only when a current task needs their specific evidence.
