# Texture Quality — Native Reconcile

**Status:** Public Stable accepted; persistence UX is the next Witch Dock follow-up.  
**Public release:** `Witch_Scripts` commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`  
**Upstream feature:** HeroForge.Compatibility `rendering.texture-quality`

## Purpose

Prevent HeroForge's complexity-driven body/head texture collapse while preserving native generation/resource ownership and avoiding the stale material/color/emissive failures caused by the old persistent Protected Textures architecture.

## Validated architecture

Texture Quality owns source policy for the active figure/session only:

- `atlasScale.bodyLower/bodyUpper/face = 4`;
- seed `bakeSize = 2048`;
- seed `_usedTextureSize = 1024` as a minimum; HeroForge may natively promote through 2048;
- load and pin real exact 1024 bodyLower/bodyUpper mask textures;
- use HeroForge's native data/change/buildAtlas/refresh/update lifecycle;
- adopt expected replacement display/modded generations;
- require character/data/target-part identity to remain stable during a session;
- verify display/resource atlas coherence, target source/allocation bounds, and exact pinned 1024 body color-bake masks.

Do **not** reintroduce custom `CK.Atlas`, `buildAtlas` wrapping/replacement, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.

## Module layout

`features/rendering/Texture_Quality_Native_Reconcile.js`

- v0.1.0 / build `0.1.0-dev-hfc-alpha3-port`;
- global `KWTextureQualityNativeReconcile`;
- APIs include enable, disable, reconcile, refresh, verify, getState, capabilities, onChange, dispose;
- current service starts OFF/inert on page load.

`features/rendering/Texture_Quality_Native_Reconcile_UI.js`

- v0.1.0 / build `0.1.0-dev-texture-quality-controls`;
- registers visible `Texture Quality` controls under Utilities;
- polls `service.refresh()` every 250 ms and reflects ON/OFF/error/verification state.

The public Stable runtime uses the exact Dev-validated blobs:

- service blob `f1891bb266ea1e8f03101d96b43bc9d38de3fa46`;
- UI blob `2c781d4c8e0a0ae472187512875d7db369897c7f`.

## Acceptance summary

### Standalone / upstream

Blood Moon and D4 both passed runtime + human visual gates. Blood Moon validated the high-pressure accessory/material-channel case; D4 validated the historically sensitive body color/glyph channel. Upstream architecture checkpoint: HeroForge.Compatibility `1c5b238a21c6acc5767d3c1b7f7ab5c702bf8f75` and later release-context checkpoint `9bced7c9042133f766bfd47b672bdfcd845fbcd0`.

### Witch Dock Dev

D4 passed integrated body-color/glyph visuals, exact pinned masks, disable ownership release, and repeated OFF -> ON lifecycle. Blood Moon passed integrated body/decal/accessory visuals and focused accessory resource checks. Same-figure native `CK.character.refresh()` remained verified, and Booth topology retained exactly one loaded `/gated/booth.js` runtime.

Dev acceptance head: `c8f8000d9562dbc315dc867af655358177e18d54`.

### Public Stable — PASS

Clean Stable Blood Moon validation after disabling Dev/standalone scripts:

- initial native atlas 4096x4096; no Texture Quality scale/mask overrides;
- one enable returned true, service ON / no error;
- one expected native generation adoption;
- coherent 4096x4096 display/resource atlas;
- BL/BU/face allocations and used sizes settled at 1024;
- exact pinned 1024 body color-bake masks remained active;
- scheduler idle;
- zero broken/fallback bindings across 16 Discus, 2 Short Crown Horn, and 3 Celestial Circlet instances;
- exactly one Booth runtime remained present;
- Amanda visually confirmed the public Stable result looks great with correct body texture, decals, accessory color/material/emissive channels, and no poop/corruption.

Bridge evidence: #1747 baseline/topology, #1748 enable/readback, #1750 accessory/topology smoke. Do not reload raw issue payloads unless investigating a new regression.

## Confirmed current persistence behavior

v0.1.0 does **not** persist the ON preference.

- Same figure + ordinary native renderer refresh: remains ON and adopts the replacement generation.
- Figure change: `handleStaleFigure()` detects character/data replacement, discards the old session, clears `enabled`, and reports `OFF — figure changed; enable again for this figure.`
- Page reload: JavaScript state is recreated and starts OFF/inert.

This was an intentional safety posture during validation: old snapshots/references must never be reused on a replacement figure.

## Next follow-up — user preference persistence

The last proposed direction, **not yet approved by Amanda**, is to persist only the user's desired preference (for example, “High Res should be enabled”), while continuing to build a completely fresh session for every page/figure.

If approved, the implementation should:

- persist only a simple user-intent value, never snapshots, masks, atlas/display/modded references, or per-figure session objects;
- discard the old session immediately on figure replacement;
- wait for the replacement page/figure renderer to be ready, resolve fresh parts/capabilities/masks, then run the normal safe `enable()` path;
- single-flight automatic enabling and fail safely OFF on that figure if readiness/reconcile fails;
- avoid uncontrolled retry loops;
- define manual Disable semantics for the persistent preference based on Amanda's requested UX;
- be implemented and live-tested on `WITCH_DEV_UI` before any Stable update.

Amanda has a response ready to the persistence proposal. The next chat should let her give that response before editing.

## Known nuance

On D4, disabling removed all feature-owned scale/mask overrides and rebuilt natively, but HeroForge recalculated transient `_usedTextureSize` to 1024/1024/1024 instead of reproducing the original 512/512/1024 values. This is native post-restore recalculation, not retained Witch Dock ownership. Exact transient baseline reproduction is not part of the disable contract.

Older detailed probe-by-probe history remains preserved in Git history before this compact rewrite.