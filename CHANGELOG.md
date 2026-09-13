# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-12-053 — Gate persistent auto-enable on visible HeroForge runtime

Date: 2026-09-12

### Summary

Live Bridge validation of the first Texture Quality persistence candidate found that an automatic reconcile can be started while HeroForge is in a hidden/background tab. In that state HeroForge left `_needsUpdating=true`, did not converge display/resource atlas identity, and both the reconcile and recovery restore timed out. The preference model itself was not the failure; automatic scheduling was too permissive.

### Fix

- bump Texture Quality service to v0.2.1 / build `0.2.1-dev-visible-auto-enable`;
- persistent auto-enable now refuses to start while `document.hidden` or `visibilityState !== 'visible'`;
- add a `visibilitychange` hook that schedules the existing safe automatic enable path once HeroForge becomes visible again;
- keep manual Enable behavior unchanged;
- keep the boolean-only persistence/session-suppression model unchanged;
- update manifest registry version/build/cache key accordingly.

### Validation state

The failing hidden-tab behavior is confirmed by Bridge evidence #1755/#1757/#1760. v0.2.1 static and fresh live validation are required before Amanda's visual gate. Public Stable remains untouched.

**Runtime behavior changed:** yes, Dev only.

---

## DOCK-2026-09-12-052 — Texture Quality persistent preference Dev candidate

Date: 2026-09-12

### Summary

Implement Amanda's approved Texture Quality persistence UX on `WITCH_DEV_UI` while preserving the validated native reconcile architecture and stale-figure safety boundary.

### Runtime/UI changes

- bump `texture-quality-native-reconcile` to v0.2.0 / build `0.2.0-dev-persistent-preference`;
- persist only the boolean `Persistent High Res` preference in local storage; no session, snapshot, mask, display/modded, atlas, or per-figure renderer object is persisted;
- when persistence is enabled, wait for HeroForge renderer readiness and run the existing safe `enable()` path once per figure; failures stay safely OFF for that figure instead of retry-looping;
- figure changes still discard the old active reconcile session before a fresh automatic enable is considered;
- manual Disable while persistence is checked suppresses High Res only for the current page session; manual Enable clears that temporary suppression, and reload naturally restores persistent behavior;
- unchecking persistence stops future automatic enables without forcing the currently active figure OFF;
- bump `texture-quality-native-reconcile-ui` to v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- add a Utilities-style `Persistent` checkbox and move `Reconcile Now` into a collapsed in-tool `Advanced` section with an explanation;
- update manifest registry versions/builds and deterministic Dev cache keys.

### Validation state

JavaScript syntax and manifest JSON validation passed before live testing. Live validation exposed the hidden-tab scheduler issue now addressed by DOCK-2026-09-12-053.

**Runtime behavior changed:** yes, Dev only. Public `Witch_Scripts` Stable remains Texture Quality v0.1.0 and is untouched.

---

## DOCK-2026-09-12-051 — Adopt compact Witch Dock project governance

Date: 2026-09-12

Public Texture Quality v0.1.0 is fully Stable accepted. Governance was compacted around `PROJECT_CONTRACT.md`, `ACTIVE_CONTEXT.md`, rolling logs, and Bridge-first runtime validation.

**Runtime behavior changed:** no.

---

## Prior active history

Detailed DOCK-2026-09-12-050 and earlier entries remain preserved in Git history. Do not load them unless a current task specifically needs that evidence.