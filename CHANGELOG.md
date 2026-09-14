# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-14-065 -- Refresh pinned color-bake materials

Date: 2026-09-14

### Summary

Fix Texture Quality verification/rendering when a shared-Part multi-figure scene keeps a native 512px body mask in an existing color-bake material after the 1024px override is pinned.

### Confirmed diagnosis and validation

- With primary + Seya, v0.3.3 pinned the correct 1024px body mask but the primary material `masksMap` remained 512px.
- HeroForge native `colorBake.paints.getMask()` prefers `masksMapOverride`; a bounded probe showed native `paints.setupMaterials('color')` immediately moved the actual material uniform from 512px to the exact pinned 1024px texture.
- A live-only v0.3.4 candidate explicitly refreshed HeroForge-owned color materials after policy install and during restore.
- Three-figure Seya Enable PASS: all display/resource atlases coherent at 4096×4096, both primary body masks 1024×1024 and pinned, Seya `materialSim` / `clutPath` intact.
- Matching Disable PASS: renderer idle, all three figure atlases coherent, Seya material state intact, source-restored OFF status.

### Changes

- bump Texture Quality service to v0.3.4 / build `0.3.4-dev-native-color-material-setup`;
- invoke HeroForge-owned `colorBake.paints.setupMaterials('color')` after mask policy application;
- perform matching native color-material setup during restore after fresh primary generation adoption;
- update manifest registry/build/cache key.

### Explicitly unchanged

Texture recipe, atlas target, body-mask capability ceiling, readiness/settle timing, persistence semantics, primary-only `Data.change()` ownership, child display ownership, and public Stable are unchanged.

**Runtime behavior changed:** yes -- Dev color-bake material refresh correction.

---

## DOCK-2026-09-14-064 -- Deduplicate shared HeroForge Part snapshots

Date: 2026-09-14

### Summary

Fix Texture Quality restore and dynamic-membership handling when separate HeroForge figures share the same underlying Part object instances.

### Confirmed diagnosis and validation

- The two Colliefolk extras had distinct data, modded, display, and mesh objects, but their bodyLower and bodyUpper Part objects were the same object references.
- v0.3.2 stored snapshots per figure pipeline. A later pipeline could therefore snapshot an already-promoted shared Part and overwrite the first figure's native restore with contaminated 2048 values.
- v0.3.3 stores one first-seen native snapshot per shared Part object for the whole session, and newly joined figures derive mask capability from that stored native bake ceiling.
- Live Dev passed Enable -> Disable -> immediate Enable, 3->2 removal while High Res stayed ON, 2->3 addition while High Res stayed ON, and Disable after the dynamic add. Both Collies restored bodyLower=1024 and bodyUpper=512 and retained materialSim=color.

### Changes

- bump Texture Quality service to v0.3.3 / build `0.3.3-dev-shared-part-snapshots`;
- deduplicate Part snapshots across all figure pipelines by object identity;
- use the stored native Part bake ceiling when loading masks for figures added to an active High Res session;
- update manifest registry/build/cache key.

### Explicitly unchanged

Texture recipe, atlas target, readiness/settle timing, primary-only Data.change ownership, persistence semantics, UI API, direct child display ownership, and public Stable are unchanged.

**Runtime behavior changed:** yes -- Dev shared-Part snapshot/restore correction.

---

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
