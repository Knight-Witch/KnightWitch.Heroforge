# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-15-075 -- Post-promotion Dev baton housekeeping

Date: 2026-09-15

### Scope

Documentation-only cleanup after the Texture Quality lifecycle/projected-host patch was promoted from validated Dev runtime commit `d0d198cea6f8d755b79ff667c1b3d550956ea0cb` to public Stable.

### Confirmed release state

- Public runtime promotion commit: `dac34877b5d02208c99072e67bf0e59b9233b11b`.
- Public rollout closeout/current Stable head: `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.
- Stable provenance was confirmed from `Witch_Scripts/manifest.json`; the three promoted runtime files were byte-identical to the validated Dev blobs and compiled successfully.
- Public smoke on a newly loaded figure returned `enable() === true`, then read back core v0.3.5 ON at 8192×4096 with bodyLower/bodyUpper/face scale 4, bake/source 2048, packed 2048×2048, coherent resource atlas, idle HeroForge, and no lifecycle-extension errors.
- Active-decal readback selected the four D4 wing hosts and remained idle/no-error. The same-figure guard remained idle/no-error after its previously proven repair path.

### Corrected baton state

The prior `ACTIVE_CONTEXT.md` was stale after promotion: it still said Stable was untouched/not authorized and listed the 2–3 figure regression as a pre-promotion gate. This record corrects that mismatch without changing runtime behavior.

### Outstanding regression coverage

1. Real 2-figure High Res regression, including projected/accessory ownership separation.
2. Real kitbash drag on one figure while two figures are present; confirm no guard/scene-sync race or collateral degradation.
3. Add/remove a third figure and repeat the narrow lifecycle/state checks.
4. Deliberate A -> B -> A figure-switch/session behavior.
5. At least one non-wing projected-host example and one no-projected-host control.
6. Do not reopen the prior muddy/green artifact unless it visibly reproduces.

Further investigation/fixes must occur in `WITCH_DEV_UI`; public Stable is protected at the closeout head until another Dev change passes its own gate and receives explicit promotion approval.

### Validation for this commit

- Intended changed-file set: `ACTIVE_CONTEXT.md`, `CHANGELOG.md`, `PRE_FLIGHT_Check.md` only.
- No JavaScript, manifest, module version, cache key, or public Stable file is intentionally changed.

**Runtime behavior changed:** no. Documentation/housekeeping only.

---

## Prior current preflight

PFC-2026-09-15-074 and earlier detailed records remain preserved in Git history.
