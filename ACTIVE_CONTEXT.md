# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-13  
**Current task:** Texture Quality multi-figure scope — validate count-agnostic service v0.3.1 across vanilla 1/2/3 figures, dynamic membership, and heavy non-primary figures.  
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md` when durable engine history is needed
4. `features/rendering/Texture_Quality_Native_Reconcile.js`
5. `features/rendering/Texture_Quality_Native_Reconcile_UI.js`
6. `MODULE_VERSIONING.md` before another code/version commit

Do not preload full repo history/changelog/preflight unless a current step specifically requires them.

## Public Stable — protected PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Stable remains service v0.1.0 / `0.1.0-dev-hfc-alpha3-port` + UI v0.1.0 / `0.1.0-dev-texture-quality-controls`. Blood Moon acceptance remains closed PASS. Stable has not been modified by the current investigation.

## Current Dev candidate

- service v0.3.1 / build `0.3.1-dev-bounded-mask-capability`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls` unchanged;
- beta notice v0.1.2 / build `0.1.2-centered-sleek-title` unchanged.

Persistence semantics remain unchanged: default OFF; boolean-only Persistent intent; manual Disable while persistent is page-session suppression; manual Enable/reload clears suppression; unchecking persistence stops future automatic behavior without forcing an active session off.

## Closed prerequisites

- v0.2.2 fixed promoted 1024 body-mask path resolution on D4 and passed automatic/manual/cold-reload validation.
- v0.2.3 waits for a visible, coherent, idle, stable HeroForge generation before Persistent automatic enable.
- v0.2.4 expanded native settle to 120 seconds and checks ready state before enforcing expiry; this closed Seya's false timeout caused by heavy native work exceeding the old 12-second budget.
- v0.3.0 dynamically enumerates the primary display plus every unique compatible entry in `CK.character.allDisplays`; live mapping confirmed vanilla figure 2=`baseItem`, figure 3=`baseItemB`, each with independent data/modded/meshes/atlas state.

## Confirmed multi-figure root cause

Seya remained visually low quality because she was figure 2, while Texture Quality v0.2.4 only targeted `CK.character.data` / `CK.character.display` — the primary figure.

Live clean-scene mapping through HF-Chat-Bridge established:

- one figure: primary pipeline at `CK.character.display`;
- two figures: `CK.character.allDisplays` contains `""` plus `baseItem`; `baseItem.data.primary=false` and owns an independent coherent native atlas/resourceAtlas and independent body/head parts;
- three figures: registry contains `""`, `baseItem`, `baseItemB`; both extras are independent non-primary render pipelines;
- Colliefolk figure 2 part IDs: bodyLower 11426 / bodyUpper 11181 / face 26096;
- raccoonfolk figure 3 part IDs: bodyLower 26112 / bodyUpper 11181 / face 26130;
- each extra exposes its own `data.change()` and `modded.buildAtlas()`; root `CK.character.refresh()` remains the normal scene update request.

Therefore the service must enumerate current figure displays dynamically rather than hardcoding a count. This should naturally cover future Additional Minis figures if HeroForge registers them through the same `allDisplays` collection.

## v0.3.1 mask-capability repair

The first three-figure v0.3.0 Enable failed before policy application because both extra figures use furry bodyUpper part 11181 (`furryClaws`). Confirmed runtime/source evidence:

- native `bakeSize=512` for that bodyUpper part;
- `furryClaws_mask_512.webp` exists and loads as 512×512;
- 1024 and 2048 variants are genuine 404s;
- requiring exact 1024 body masks for every species is therefore invalid;
- the first native-size diagnostic then hung at `Preparing native reconcile…` while the HF renderer was idle because `CK.Resources.getResource()` was awaited and its promise did not resolve.

v0.3.1 keeps the v0.3.0 figure architecture and High Res source policy unchanged, but:

- selects each body mask using the part's pre-policy native bake ceiling, capped at 1024;
- triggers `getResource()` without awaiting its promise and bounded-polls `getNow()` for up to five seconds;
- records/verifies the exact selected supported mask size per body instead of hard-requiring 1024.

No 8192 atlas forcing, global-4 policy, projected/splatter overrides, custom atlas ownership, direct atlas assignment, persistence semantic change, UI change, or notice change belongs to v0.3.1.

## Next gate

1. Validate the exact v0.3.1 service blob and manifest JSON/diff, then fast-forward `WITCH_DEV_UI` only if static checks pass.
2. Load exact v0.3.1 on the clean three-figure scene with Persistent OFF.
3. Manual Enable must finish without hanging and verify all three pipelines; primary masks should remain 1024 where supported while both furry bodyUpper masks pin exact 512.
4. Confirm all three native atlases are coherent and root scheduler is idle.
5. While High Res remains ON, add/remove a figure and confirm count-agnostic scene resync.
6. Reload a scene with Seya as a non-primary figure and require Amanda visual confirmation that Seya now receives the quality improvement.
7. Heavy non-primary follow-up with Twilight Soak if practical.
8. Stable remains protected until explicit narrow promotion approval.
