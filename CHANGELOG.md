# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-12-054 — Add one-time Texture Quality Phase 1 announcement

Date: 2026-09-12

### Summary

Add a first-run Witch Dock announcement for the Texture Quality beta without modifying the already-working Texture Quality Utilities UI or service architecture.

### Changes

- add `features/rendering/Texture_Quality_Beta_Notice.js` v0.1.0 / build `0.1.0-phase1-announcement` as an isolated optional module;
- show `Nat 20: New Beta Unlocked!` once after Witch Dock and the Texture Quality service are available;
- use a Witch Dock-style scrollable modal with explicit `OK` acknowledgement;
- write only the versioned acknowledgement marker `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack` after `OK`, so later refreshes do not repeat the notice;
- keep notice state completely separate from `Persistent High Res` and renderer/session state;
- preserve the existing Texture Quality UI v0.2.0 unchanged, including `Persistent` and collapsed `Advanced > Reconcile Now`;
- register the notice as a hidden manifest-loaded module with its own deterministic Dev cache key.

### Copy scope

The announcement explains Phase 1 capabilities and limits, expected texture settle time, future optimization/tier work, crash-state recovery, and the FRD/T handoff. It explicitly tells users to turn off only FRD/T's three Decal Resolution toggles, not the whole script.

### Validation state

Service v0.2.1 static validation passed via Bridge #1761 and restarted transport health passed #1762/#1763. The clean restarted runtime briefly reported a cold-start mask-load failure at #1764, then self-recovered on the final figure identity and verified ON at #1765 with coherent 4096x4096 native atlas and 2048 target allocations. Cold-reload behavior remains part of the final Dev gate; no architecture change is justified from that single self-recovering transition.

**Runtime behavior changed:** yes, Dev announcement only. Public Stable remains untouched.

---

## DOCK-2026-09-12-053 — Gate persistent auto-enable on visible HeroForge runtime

Service v0.2.1 / build `0.2.1-dev-visible-auto-enable` prevents automatic persistence from starting in hidden HeroForge tabs and schedules the normal safe path on `visibilitychange`. Bridge #1755/#1757/#1760 diagnosed the hidden-tab failure; #1761 confirmed the exact corrective service/manifest static PASS.

---

## DOCK-2026-09-12-052 — Texture Quality persistent preference Dev candidate

The approved boolean-only persistence model and Advanced reconcile UI were implemented on `WITCH_DEV_UI`. Public Stable was not changed.

---

## Prior active history

DOCK-2026-09-12-051 and earlier entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.
