# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-15-075 -- Refresh Dev baton after public Texture Quality rollout

Date: 2026-09-15

### Summary

Housekeeping-only update after the validated Texture Quality same-figure lifecycle/projected-host patch was promoted to public Stable and passed its Stable smoke.

- Records validated Dev runtime source `d0d198cea6f8d755b79ff667c1b3d550956ea0cb`.
- Records public runtime promotion `dac34877b5d02208c99072e67bf0e59b9233b11b` and Stable closeout `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.
- Marks D4-with-wings single-figure lifecycle/projected-host validation closed: four real wing hosts selected, committed real kitbash drag visually passed, and no current muddy/green artifact reproduced.
- Records public Stable smoke success on a newly loaded figure: core v0.3.5 enabled to 8192×4096 with bodyLower/bodyUpper/face scale 4, 2048 source/bake, 2048×2048 packed allocations, and no guard/active-decal error.
- Corrects the stale Dev baton that still claimed Stable was untouched/not authorized.
- Sets the next work to the still-missing real 2–3 figure regression, deliberate figure-switch coverage, one non-wing projected-host case, and one no-projected-host control.
- Broader Enhanced Object Textures remains out of scope.

**Runtime behavior changed:** no. Documentation/housekeeping only; no runtime module, manifest, version, or public Stable behavior changes.

---

## Prior active history

DOCK-2026-09-15-074 and earlier detailed entries remain preserved in Git history.
