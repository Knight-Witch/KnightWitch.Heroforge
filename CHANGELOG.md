# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-15-074 -- Add stable same-figure Texture Quality repair candidate

Date: 2026-09-15

### Summary

Add a Dev-only lifecycle repair for the confirmed kitbash same-figure atlas-policy reset and extend smart active-decal priority to projected `splatter` hosts. Stable remains untouched.

- Live Bridge tracing of a real Amanda-driven kitbash drag proved the failing lifecycle: HeroForge emitted a same-figure `character.change` containing both `transforms` and `atlasScale`; body/head `atlasScale` ownership disappeared while the current packed atlas could still momentarily report 2048 allocations; later renderer generations entered the visible potato state.
- The previously installed temporary stable guard was found still active despite the prior handoff stating it had been removed. Its initial install state had `lastResult=null`; the recovered state had `lastResult=true`; the traced real drag showed it issuing `reconcile({sceneSync:true})` after HeroForge reached a stable ready generation. This proves that guard caused the observed automatic recovery.
- All temporary observer/guard wrappers were then removed and Bridge readback confirmed only the normal Dev core/active-decal wrappers remained.
- Add `Texture_Quality_Same_Figure_Drift_Guard.js` v0.1.0 / `0.1.0-dev-stable-same-figure-repair`. It detects only already-enabled, same-figure core policy drift, defers to existing membership scene-sync when figure count changes, waits for the same 1200 ms stable renderer criteria used by the core service, then calls the existing reconcile once if drift still exists.
- Advance active-decal priority to v0.1.1 / `0.1.1-dev-projected-host-lifecycle-coordination`. It now collects real non-core projected hosts only from `data.decals.splatter[*].filter[key] === true`, and defers accessory scale mutation/reconcile while core scene sync or same-figure repair is pending.
- Manifest load order is core reconcile -> same-figure drift guard -> active-decal priority -> existing UI. Core v0.3.5 and UI v0.2.0 are unchanged.

Static validation: both changed/new JavaScript modules pass `node --check`; `manifest.json` parses and has unique registry IDs with the required load order.

Live exact-commit validation is still required on D4 with wings, including one real kitbash drag and projected wing-host verification. Multi-figure active-decal regression remains required before any Stable promotion.

**Runtime behavior changed:** yes -- Dev only. Stable unchanged.

---

## Prior active history

DOCK-2026-09-15-073 and earlier detailed entries remain preserved in Git history.
