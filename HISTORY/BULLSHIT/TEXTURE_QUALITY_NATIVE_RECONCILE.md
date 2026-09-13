# Texture Quality — Native Reconcile

Date: 2026-09-12  
Status: Stable promotion candidate; standalone + Dev validation PASS  
Feature ID: `rendering.texture-quality`

## Purpose

Prevent HeroForge's complexity-driven body/head texture collapse without reintroducing the stale-generation/material-channel failures caused by the old persistent Protected Textures architecture.

## Provenance

Validated upstream standalone: `Knight-Witch/HeroForge.Compatibility` `rendering-texture-quality-native-reconcile.user.js` v0.2.0-alpha.3.

Compatibility acceptance/release checkpoint: `9bced7c9042133f766bfd47b672bdfcd845fbcd0`.

Witch Dock Dev integrated acceptance head: `c8f8000d9562dbc315dc867af655358177e18d54`.

Stable promotes the exact Dev runtime blobs:

- service `f1891bb266ea1e8f03101d96b43bc9d38de3fa46`;
- UI `2c781d4c8e0a0ae472187512875d7db369897c7f`.

Witch Dock has no runtime dependency on HeroForge.Compatibility or HF-Chat-Bridge.

## Rejected architecture

The old Protected Textures v0.1.5 path wrapped `modded.buildAtlas`, constructed/assigned custom giant atlases, and persistently watched/reasserted atlas ownership. Live investigation showed this could preserve high-resolution-looking body/decals while leaving accessory material/color/emissive channels generation-incoherent.

A native HeroForge reconciliation repaired those channels while retaining high-resolution source policy. The maintained design therefore keeps the source policy but returns atlas/display ownership to HeroForge.

## Maintained architecture

On explicit enable only:

1. resolve current bodyLower/bodyUpper/face and validate the required native lifecycle capabilities;
2. load real 1024 bodyLower/bodyUpper masks from each current part's supported mask path;
3. snapshot only the source fields the feature will own;
4. seed `atlasScale=4`, `bakeSize=2048`, `_usedTextureSize=1024` for bodyLower/bodyUpper/face;
5. pin bodyLower/bodyUpper mask overrides to the real 1024 textures;
6. call HeroForge's native data/modded/atlas/refresh lifecycle rather than constructing a custom atlas;
7. wait for scheduler/display/resource-atlas coherence;
8. adopt expected replacement display/modded generations while requiring character/data/target-part identity stability;
9. accept native target source/allocation promotion from 1024 through the 2048 bake ceiling;
10. require actual body color-bake `masksMap` inputs to remain exact pinned 1024 textures.

No custom `CK.Atlas`, buildAtlas replacement/wrapper, direct atlas assignment, giant-atlas forcing, or persistent watcher is used.

## Standalone validation

### Blood Moon

The native-reconcile candidate produced a coherent 4096 atlas with 1024 target allocations/used, bake 2048, exact 1024 body masks, sharp body/decals, no poop, and correct Discus / Celestial Circlet / Short Crown Horn channels.

### D4

D4 produced a coherent 4096 atlas with native-promoted 2048 target allocations/used, bake 2048, exact 1024 body masks, and correct historical body paint/glyph behavior.

Amanda visually accepted both.

## Witch Dock Dev validation

### D4 — PASS

Clean Dev load started OFF/inert with no standalone global. One enable produced native 4096, target allocations/used 2048, exact pinned 1024 masks, one expected generation adoption, and no error. Amanda confirmed body color/glyph, body/face, decals, and material/color/emissive channels correct.

One controlled disable removed all target scale and body mask overrides and rebuilt natively. HeroForge recalculated transient OFF-generation used sizes to 1024/1024/1024 instead of the original 512/512/1024; because all feature-owned overrides were absent, this is recorded as native recalculation rather than leaked ownership. A subsequent OFF -> ON cycle passed again.

Bridge evidence: #1735, #1737, #1738, #1739, #1740.

### Blood Moon — PASS

Clean Dev load started from native 4096 with no feature-owned target scale or body mask overrides. One enable produced native 4096, target allocations/used 1024, exact pinned 1024 masks, one expected generation adoption, and no error.

A targeted resource scan found zero broken/fallback resources across 16 Discus, 2 Short Crown Horn, and 3 Celestial Circlet instances. Amanda visually confirmed body texture, decals, no poop, and accessory material/color/emissive channels all correct.

A normal native `CK.character.refresh()` while ON remained verified and adopted the replacement generation. A non-invasive topology smoke found exactly one loaded `/gated/booth.js`, with BT/bootstrap and Texture Quality service/UI present and no duplicate Booth runtime introduced.

Bridge evidence: #1741, #1742, #1744, #1745, #1746.

## Stable module layout

`features/rendering/Texture_Quality_Native_Reconcile.js`

- canonical v0.1.0;
- build `0.1.0-dev-hfc-alpha3-port` retained as the validated source build identity;
- hidden manifest-loaded service;
- global `KWTextureQualityNativeReconcile`;
- OFF/inert on load;
- explicit enable, disable, reconcile, verify, diagnostics, change subscription, and dispose APIs.

`features/rendering/Texture_Quality_Native_Reconcile_UI.js`

- canonical v0.1.0;
- build `0.1.0-dev-texture-quality-controls` retained as the validated source build identity;
- hidden manifest loader module that self-registers the visible `Texture Quality` control under Utilities;
- explicit Enable/Disable, manual Reconcile, and compact diagnostics.

## Stable promotion boundary

This release must not merge unrelated WITCH_DEV_UI work. Public shell v1.2.1 and every existing runtime module remain byte-unchanged. Only the two new rendering files, four manifest records, and required tracking documentation are promoted.

After branch movement, a clean public Stable smoke is required before marking the release fully Stable-validated.
