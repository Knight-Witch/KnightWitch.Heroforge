# Texture Quality — Native Reconcile

**Status:** Public Stable v0.1.0 accepted; Dev v0.2.0 persistence candidate awaiting live validation.  
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

- Stable: v0.1.0 / build `0.1.0-dev-hfc-alpha3-port`;
- Dev candidate: v0.2.0 / build `0.2.0-dev-persistent-preference`;
- global `KWTextureQualityNativeReconcile`;
- v0.2.0 adds boolean persistent preference storage, fresh per-figure automatic enable, bounded single-flight readiness, and page-session temporary suppression;
- APIs include enable, disable, setPersistent, reconcile, refresh, verify, getState, capabilities, onChange, dispose.

`features/rendering/Texture_Quality_Native_Reconcile_UI.js`

- Stable: v0.1.0 / build `0.1.0-dev-texture-quality-controls`;
- Dev candidate: v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- visible `Texture Quality` controls remain under Utilities;
- v0.2.0 adds the Utilities-style `Persistent` checkbox and moves `Reconcile Now` into a collapsed `Advanced` section;
- UI still polls `service.refresh()` every 250 ms and reflects ON/OFF/error/verification state.

The public Stable runtime still uses the accepted v0.1.0 blobs:

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

## Persistence behavior

### Public Stable v0.1.0

Stable stores no persistent preference: same-figure native renderer refresh stays ON, figure change discards the active session and goes OFF, and page reload starts OFF/inert.

### Dev v0.2.0 candidate

Amanda-approved semantics now implemented in `WITCH_DEV_UI`:

- first-time/default preference is OFF;
- `Persistent` stores only a boolean desired preference in local storage;
- enabling persistence immediately schedules the existing safe enable path after fresh HeroForge renderer readiness;
- page reload recreates all JavaScript/session state but rereads the boolean and creates a completely fresh reconcile session;
- figure change discards the old session first, then automatically creates a fresh session for the replacement figure;
- automatic enable is single-flight and records one failed attempt per current figure identity to avoid retry loops;
- manual Disable while persistence is checked sets only an in-memory page-session suppression, so High Res stays OFF until manual Enable or reload;
- manual Enable clears that suppression;
- unchecking persistence stops future automatic enable but leaves an already-enabled current session alone;
- no snapshots, masks, atlas/display/modded references, or other renderer objects are persisted.

`Reconcile Now` remains the same recovery action: reapply the active source policy, run HeroForge's native rebuild/refresh lifecycle, settle, then verify. It is now hidden under the collapsed in-tool `Advanced` section because ordinary users should rarely need it.

Dev static validation passes; live Bridge regression and Amanda's visual/UX gate remain pending before any Stable promotion.

## Known nuance

On D4, disabling removed all feature-owned scale/mask overrides and rebuilt natively, but HeroForge recalculated transient `_usedTextureSize` to 1024/1024/1024 instead of reproducing the original 512/512/1024 values. This is native post-restore recalculation, not retained Witch Dock ownership. Exact transient baseline reproduction is not part of the disable contract.

Older detailed probe-by-probe history remains preserved in Git history before this compact rewrite.