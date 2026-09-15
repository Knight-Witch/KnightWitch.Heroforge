# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-15
**Current task:** Texture Quality kitbash lifecycle drift + projected `splatter` host coverage, continuing from the smart active-decal Dev candidate.
**Protected public state:** Stable service v0.3.4 / UI v0.2.0 and public notice v0.2.1 remain accepted. Stable is not the experimental environment.
**Dev runtime candidate:** commit `1da76212b352f6e4e03641d8e3e2c314eff5b111`; core service v0.3.5 / build `0.3.5-preserve-native-source-floor`; active-decal policy v0.1.0 / build `0.1.0-dev-active-decal-scale-policy`; UI v0.2.0 unchanged.
**Last pre-handoff Dev docs commit:** `0a8fa796f0b19b8fbc641a95ae3429dec96c070c` (`Record smart decal live validation`). No runtime/module/manifest source was committed during the latest investigation; all later tests were HF-Chat-Bridge runtime probes only.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `MODULE_VERSIONING.md` before any runtime/version change;
4. `features/rendering/Texture_Quality_Native_Reconcile.js`;
5. `features/rendering/Texture_Quality_Active_Decal_Priority.js`;
6. `manifest.json`;
7. `features/rendering/Texture_Quality_Native_Reconcile_UI.js` only if controls/UI change;
8. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not reopen unrelated Booth/decal-gizmo/history work. Do not consult `HeroForge.Compatibility` unless the next investigation still has an unresolved HeroForge seam after live source/runtime inspection.

## Current acceptance target

- Normal High Res should preserve the proven body/head quality and prioritize every real decal host surface, including projected `splatter` targets.
- A separate opt-in Enhanced Object Textures mode remains desired for broader wings/clothing/props/accessories instead of making normal High Res brute-force every atlas part.
- Keep the intended 8192×4096 atlas budget unless a specific test proves a larger atlas buys visible quality.

## Confirmed visual / atlas findings from this session

- Same-browser Chrome comparison against Lob's FullResDecals Extreme on the heavy figure: Amanda judged Witch Dock's body decals slightly better; the skirt pattern looked essentially the same; wing difference was uncertain because the wing decals were very large. This is a useful human result, not a universal claim that Witch Dock beats Lob on every figure.
- Making the body atlas ceiling 8192×8192 instead of 8192×4096 produced no visible body-decal improvement in repeated close comparison. Do not make square 8K the default for body quality.
- A targeted four-wing scale-4 probe can raise wing source requests to the native 1024 ceiling while leaving the atlas at 8192×4096. Actual packed wing allocation still depends on packing pressure; later reconciles showed scale 4 / used 1024 with 512×512 packed wing slots, so do not assume 1024 allocation is guaranteed just from scale 4.

## Projected decal correction

Projected decals are under `CK.character.data.decals.splatter`, not `character.data.splatter`.

On the D4-with-wings test figure:

- 35 projected `splatter` entries were present;
- 9 entries targeted `bodyLower`;
- 25 entries targeted `bodyUpper`;
- 8 entries targeted wing slots through `filter[key] === true`;
- the existing v0.1.0 smart active-decal selector does not correctly promote these projected host surfaces.

The production fix should collect only true `splatter[*].filter` host keys that correspond to real current atlas parts, excluding body/head ownership already handled by the core service. Do not promote every decal-capable part blindly.

## Kitbash lifecycle bug — confirmed

Entering kitbash / moving the figure can reset High Res atlas policy without changing the figure identity or core part IDs. The current core scene-sync gate therefore can miss it because `sameFigureSet(session)` remains true.

Earlier captured broken state after a kitbash move:

- bodyLower packed allocation fell 2048→512;
- bodyUpper fell 2048→512;
- face fell 2048→1024;
- all four wings fell 1024→512 in that probe;
- body/head `atlasScale` policy entries disappeared;
- the underlying body part `_usedTextureSize` values remained 2048.

A normal manual `KWTextureQualityNativeReconcile.reconcile()` restored bodyLower/bodyUpper/face to 2048×2048, proving the recipe itself is valid and the bug is lifecycle detection/reapplication.

Bridge #2491 captured a second clean reproduction after Amanda touched the figure in kitbash again:

- `_needsUpdating=false`, `_inUpdate=false`;
- `resourcesReady=true`, `finished=true`;
- atlas remained 8192×4096;
- `atlasScale.bodyLower`, `bodyUpper`, and `face` were missing;
- body `_usedTextureSize` remained 2048;
- all four wing scale entries were missing while wing `_usedTextureSize` remained 1024.

Immediately after that capture, Amanda reported: **"it briefly turned potato then fixed itself."** Treat that automatic recovery as a confirmed human observation, but the exact mechanism is not yet proven by Bridge readback. Do not assume which service/hook repaired it until the next chat captures the recovered state and a full before→potato→recovered lifecycle.

## Temporary probe result

A reversible drift-guard runtime probe was tested and then fully removed. It proved that immediately reconciling while HeroForge still reports an update in progress can hit the existing settle timeout. Do not weaken the accepted readiness/settle checks or replace them with a guessed timer. The durable fix must wait for a real stable HeroForge seam/state, then reconcile once.

No temporary drift-guard helper remains installed after the cleanup probe. No related source was committed.

## Weird body-color artifact

Amanda also saw muddy/greenish body-color patches around the right leg/thigh, torso, and one hand after the kitbash downgrade. It may be the same half-rebuilt color/decal bake state, but this is not proven. Keep it as a separate visual observation until a controlled post-recovery comparison shows whether it follows the texture-policy drift.

## Next exact work

1. **Before mutating anything**, use HF-Chat-Bridge to read the current recovered D4-with-wings state: core service status, body/head scale + packed allocations, active-decal service state, wing scale/source/allocations, and atlas dimensions.
2. Reproduce one fresh kitbash move and capture the full lifecycle from good → potato → automatic recovery. Identify the actual signal/hook that causes recovery; do not infer it from timing alone.
3. Fix the v0.1.0 active-decal selector so `data.decals.splatter[*].filter[key] === true` promotes real non-core projected host surfaces, then live-test the eight D4 wing-target hits.
4. Only after the lifecycle signal is proven, add a bounded same-figure drift check/reconcile that preserves current readiness, retries, settle behavior, snapshots, rollback, and ownership boundaries.
5. Recheck the leg/torso/hand color artifact visually after a clean recovery.
6. The active-decal extension still needs a real 2–3 figure live regression before any Stable promotion.

## Promotion gate

Do not promote to `Witch_Scripts` yet. Stable remains untouched. The current blocker is the same-figure kitbash lifecycle behavior plus projected `splatter` host coverage, followed by the existing multi-figure extension gate and human visual acceptance.
