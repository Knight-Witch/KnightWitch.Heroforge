# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-13-063 — Preserve non-primary material state

Date: 2026-09-13

### Scope

Repair Texture Quality's multi-figure native reconcile/restore path without changing the validated texture recipe, renderer ownership model, persistence semantics, or public Stable.

### Reviewed

- current `PROJECT_CONTRACT.md`, `ACTIVE_CONTEXT.md`, `MODULE_VERSIONING.md`, service source, manifest registry, rolling changelog and preflight;
- clean two-figure HeroForge runtime with primary + Colliefolk extra;
- HeroForge `character.refresh()` / `character.update()`, `Data.change()`, `modded.change()`, `_applySim()`, child `display.update()` and `applyMaterialSims()` source/runtime behavior;
- exact failure-stage trace and material-state comparison through HF-Chat-Bridge;
- bounded at-most-once Enable and Disable probes with only the non-primary `Data.change()` call suppressed.

### Confirmed findings

- The clean non-primary Colliefolk owns a valid resolved `modded.sim` with `materialSim="color"` and `clutPath` present.
- v0.3.1's independent child `Data.change()` replaces the child's entire `modded` object. The rebuilt child retains `materialSim="color"` but loses resolved `modded.sim`.
- The native child update then throws exactly inside `applyMaterialSims()` on missing `.clutPath`; the failure occurs before lighting or shader sliders.
- Suppressing only child `Data.change()` made the exact v0.3.1 two-figure Enable pass: both displays finished, root scheduler idle, child sim intact, and child display/resource atlas coherent at 4096×4096.
- Under the same bounded probe, Disable/restore also passed; both displays finished and the child sim remained intact.

### Candidate committed by this preflight

- service v0.3.2 / build `0.3.2-dev-preserve-child-modded-state`;
- `Data.change()` remains primary-only during reconcile and restore;
- extras retain HeroForge-resolved `modded` state, receive the existing policy and native `buildAtlas()`, then update through the root parent-owned refresh lifecycle;
- manifest registry/build/cache key updated consistently;
- no direct child display mutation or atlas assignment introduced.

### Remaining live Dev gates

1. Reload Dev and confirm exact committed v0.3.2 is loaded with a clean two-figure OFF baseline.
2. Repeat exact two-figure Enable and Disable/restore against committed source.
3. Re-test a three-figure scene and dynamic add/remove membership while High Res is active.
4. Require a human visual gate on Seya as a non-primary figure, then a heavy non-primary case if practical.
5. Public Stable remains untouched until explicit narrow promotion approval.

**Runtime behavior changed:** yes — Dev-only non-primary lifecycle correction.

---

## PFC-2026-09-13-062 — Multi-figure lifecycle handoff freeze

Documentation-only handoff preserving the earlier live-only candidate state. Superseded by the confirmed material-state diagnosis above.

---

## PFC-2026-09-13-061 — Multi-figure native mask capability + bounded loader

v0.3.1 bounded body-mask loading to each part's real native mask ceiling and stopped awaiting resource promises that can hang. The existing scale 4 / bake 2048 / used-size seed 1024 policy was preserved.

---

## PFC-2026-09-13-060 — Multi-figure Texture Quality candidate

v0.3.0 introduced count-agnostic multi-figure enumeration and verification. Its independent non-primary `Data.change()` assumption is corrected by v0.3.2.

---

## Prior current preflight

PFC-2026-09-13-059 and earlier remain preserved in Git history.
