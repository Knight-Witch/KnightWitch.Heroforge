# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-13-063 — Preserve non-primary HeroForge material state

Date: 2026-09-13

### Summary

Fix Texture Quality multi-figure reconciliation by preserving HeroForge-owned non-primary `data/modded` state instead of independently rebuilding each child figure with `Data.change()`.

### Confirmed diagnosis

- A clean two-figure scene gives the non-primary Colliefolk a resolved `modded.sim` object with `materialSim="color"` and `clutPath` present.
- Texture Quality v0.3.1 independently called `Data.change()` on every figure. HeroForge's `Data.change()` replaces `this.modded` with a new object; the child rebuild retained the `materialSim` name but lost the resolved `modded.sim` object.
- The next native child update therefore failed specifically inside `applyMaterialSims()` with `Cannot read properties of undefined (reading 'clutPath')`.
- A bounded live probe that suppressed only the child's `Data.change()` made the exact v0.3.1 Enable complete with both figures finished and coherent at 4096×4096; the matching Disable/restore also completed cleanly with the child material sim preserved.

### Changes

- bump `texture-quality-native-reconcile` to v0.3.2 / build `0.3.2-dev-preserve-child-modded-state`;
- call `Data.change()` only for the primary/root figure during reconcile and restore;
- preserve non-primary HeroForge-resolved `modded` state while continuing to apply the existing Texture Quality policy and native `buildAtlas()` per figure;
- retain one root `CK.character.refresh()` so HeroForge owns child display propagation;
- update the canonical manifest version/build and cache key.

### Explicitly unchanged

No direct child `display.change()` or `display.update()`, no direct atlas assignment, no fabricated/copied material sim state, no 8192 atlas forcing, no texture recipe change, no settle/readiness timing change, no UI/persistence change, and no public Stable change.

**Runtime behavior changed:** yes — Dev Texture Quality no longer destroys required non-primary material state during native reconcile/restore.

---

## DOCK-2026-09-13-062 — Freeze Texture Quality multi-figure lifecycle handoff

Documentation-only handoff recorded the then-open non-primary display lifecycle investigation and rejected live-only child-adoption candidates. No runtime code, manifest, or Stable behavior changed.

---

## DOCK-2026-09-13-061 — Bound multi-figure body-mask loading to native capability

Texture Quality v0.3.1 selected each body mask at its real native supported size up to the existing 1024px preference and bounded mask resource readiness without awaiting HeroForge promises that can remain pending. The High Res source policy remained scale 4 / bake 2048 / used-size seed 1024.

---

## DOCK-2026-09-13-060 — Texture Quality multi-figure native reconcile

Texture Quality v0.3.0 added count-agnostic primary + `CK.character.allDisplays` figure enumeration, per-figure policy/verification, and dynamic scene membership reconciliation. The later v0.3.2 correction supersedes v0.3.0/v0.3.1's independent non-primary `Data.change()` assumption.

---

## Prior active history

DOCK-2026-09-13-059 and earlier detailed entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.
