# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-15
**Current task:** Post-promotion Texture Quality regression hardening across 2–3 figure scenes, figure switching, and non-wing projected hosts.
**Protected public state:** `Witch_Scripts` is live and closed at Stable head `acaf18a0cfd2c751886e85a269b9427ddfaa5040`. Do not change Stable again unless a new Dev fix passes its own gate and Amanda explicitly approves another narrow promotion.
**Validated Dev runtime source:** `d0d198cea6f8d755b79ff667c1b3d550956ea0cb`.
**Public runtime promotion:** `dac34877b5d02208c99072e67bf0e59b9233b11b`.
**Public rollout closeout:** `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.
**Current modules:** core service v0.3.5 / `0.3.5-preserve-native-source-floor`; same-figure drift guard v0.1.0 / `0.1.0-dev-stable-same-figure-repair`; active-decal priority v0.1.1 / `0.1.1-dev-projected-host-lifecycle-coordination`; UI v0.2.0 unchanged.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `MODULE_VERSIONING.md` only before further runtime/version changes;
4. `features/rendering/Texture_Quality_Native_Reconcile.js` only if core behavior must change;
5. `features/rendering/Texture_Quality_Same_Figure_Drift_Guard.js`;
6. `features/rendering/Texture_Quality_Active_Decal_Priority.js`;
7. `manifest.json` only if runtime registration/version wiring changes;
8. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not preload unrelated history. Do not consult HeroForge.Compatibility unless a new unresolved engine seam appears.

## Closed / validated work

- Real interactive D4 kitbash drag lifecycle was traced. HeroForge can emit same-figure `character.change` with `transforms` + `atlasScale`, temporarily dropping body/head scale ownership and producing the visible potato generation.
- Recovery mechanism is confirmed: the same-figure guard detects persistent policy drift only after HeroForge reaches a stable ready generation, then invokes the existing `reconcile({sceneSync:true})` once.
- Programmatic `CK.tweak` transform edits do not reproduce the interactive drag lifecycle; do not use them as an equivalent regression.
- Projected active-decal discovery now includes only real non-core hosts selected by literal `data.decals.splatter[*].filter[key] === true`.
- D4-with-wings validation passed: four wing hosts (`humanWing1L/R`, `humanWing2L/R`) were selected; core body/head ownership remained separate; committed real kitbash drag completed with no visible issue.
- Public Stable smoke passed from the actual `Witch_Scripts` loader. A newly loaded figure enabled successfully to `ON — 8192×4096`; bodyLower/bodyUpper/face finished scale 4, bake/source 2048, packed 2048×2048; HeroForge was idle/ready; drift guard and active-decal policy were idle with no error.
- Stable public source/provenance checks confirmed the three promoted runtime files are byte-identical to the validated Dev runtime blobs and load in the required order.

## Outstanding regression coverage

These are validation gaps, not confirmed active bugs.

1. Real 2-figure regression with High Res enabled: verify both figures remain coherent, core ownership stays per figure, and accessory/projected policy does not bleed between figures.
2. While 2 figures are present, perform a real kitbash drag on one figure. Confirm the same-figure guard and existing membership scene-sync do not race, loop, or degrade the untouched figure.
3. Add a third figure and repeat the relevant readback/visual checks. Exercise add/remove membership while High Res is active.
4. Figure-switch regression: intentionally exercise A -> B -> A and verify expected session/persistence behavior rather than relying on incidental figure changes.
5. Test at least one projected host family other than wings, plus one figure with no projected hosts, to confirm the selector is generic and inert when it should be.
6. The prior muddy/green leg/torso/hand artifact is currently not reproducing and is not an open standalone investigation. Reopen only if a later regression visibly reproduces it.

## Next test sequence

Use `WITCH_DEV_UI` for further regression/investigation even though the current patch is already public. Preferred order:

1. Start with a clean 2-figure scene.
2. Enable High Res and inspect both figures through HF-Chat-Bridge.
3. Exercise projected decals/accessory hosts where available.
4. Perform one real kitbash drag on one figure; human-check only what requires visual judgment.
5. Add the third figure; inspect/repeat the narrow lifecycle checks.
6. Remove/switch figures and verify ownership/session behavior.
7. Find one non-wing projected-host example and one no-projected-host example.

If any regression fails, diagnose and patch in Dev first. Do not hot-fix public Stable directly.

## Scope boundary

Broader Enhanced Object Textures remains separate future work. This task is regression coverage for the already-promoted Texture Quality lifecycle/projected-host patch, not a blanket accessory-resolution expansion.
