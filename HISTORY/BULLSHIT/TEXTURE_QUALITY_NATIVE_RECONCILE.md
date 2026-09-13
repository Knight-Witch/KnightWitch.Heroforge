# Texture Quality — Native Reconcile

Date: 2026-09-12  
Status: Witch Dock Dev candidate; standalone validated  
Upstream feature ID: `rendering.texture-quality`

## Purpose

Prevent HeroForge's complexity-driven body/head texture collapse without reintroducing the stale-generation/material-channel failures caused by the old persistent Protected Textures architecture.

## Provenance

Validated upstream source: `Knight-Witch/HeroForge.Compatibility` standalone `rendering-texture-quality-native-reconcile.user.js` v0.2.0-alpha.3.

Standalone acceptance checkpoint commit: `1c5b238a21c6acc5767d3c1b7f7ab5c702bf8f75`.

The Dev service is a vendored port; Witch Dock has no runtime dependency on HeroForge.Compatibility.

## Why the old architecture was rejected

The old Protected Textures v0.1.5 path wrapped `modded.buildAtlas`, constructed/assigned custom giant atlases, and persistently watched/reasserted atlas ownership. Live investigation showed this could preserve a high-resolution-looking but generation-incoherent state where accessory material/color/emissive channels were wrong.

A native HeroForge reconciliation event repaired all affected accessory channels while preserving high-resolution source policy. That established that persistent custom atlas ownership was unnecessary and likely interfered with the native resource-selection/repack lifecycle.

## Validated native architecture

On explicit enable only:

1. resolve current bodyLower/bodyUpper/face and validate required named native lifecycle capabilities;
2. load real 1024 bodyLower/bodyUpper masks using each current part's `getMaskPath(..., 1024)`;
3. snapshot every source object/field the feature will own;
4. seed `atlasScale=4`, `bakeSize=2048`, `_usedTextureSize=1024` for bodyLower/bodyUpper/face;
5. pin bodyLower/bodyUpper mask overrides to the real 1024 textures;
6. call native `data.change({})`, reapply the source policy to the refreshed generation, call native `modded.buildAtlas()`, then `character.refresh()`;
7. wait for HeroForge's scheduler/display/resource atlas to settle coherently;
8. adopt replacement display/modded generation objects while requiring the same character/data and target-part identities;
9. accept native used/allocation sizes from 1024 through 2048;
10. require the actual body color-bake `masksMap` to remain the exact pinned 1024 texture.

No custom `CK.Atlas` construction, buildAtlas replacement, direct atlas assignment, or persistent watcher is used.

## Standalone live acceptance

### Blood Moon

Native potato baseline: 4096 atlas; BL/BU 256; face 512; bake 1024; used 256/256/512.

Accepted result: native coherent 4096 atlas; scale 4/4/4; BL/BU/face 1024 allocations; bake 2048; used 1024; exact 1024 masks. Amanda confirmed excellent body/decal quality, no poop, and correct Discus / Celestial Circlet / Short Crown Horn channels.

### D4

Native baseline: 4096 atlas; BL/BU bake 1024 used 512; face bake 1024 used 1024.

Accepted result: native coherent 4096 atlas; scale 4/4/4; BL/BU/face 2048 allocations; bake 2048; native-promoted used 2048 on all three; exact 1024 body masks. Amanda confirmed the historically sensitive body paint/glyph channel is correct, body/face and decals are sharp, no poop/corruption, and no obvious wrong accessory channels.

## Dev module layout

`features/rendering/Texture_Quality_Native_Reconcile.js`

- v0.1.0 / build `0.1.0-dev-hfc-alpha3-port`;
- hidden manifest-loaded service;
- global: `KWTextureQualityNativeReconcile`;
- OFF/inert on load;
- APIs: enable, disable, reconcile, refresh, verify, capabilities, getState, onChange, dispose;
- figure change clears stale session bookkeeping OFF without replaying old snapshots into the new figure.

`features/rendering/Texture_Quality_Native_Reconcile_UI.js`

- v0.1.0 / build `0.1.0-dev-texture-quality-controls`;
- hidden loader module that self-registers visible Witch Dock tool `texture-quality-native-reconcile` under Utilities;
- explicit Enable/Disable and Reconcile controls;
- shows capability, atlas/target sizes, native promotion, body masks, adoption count, and errors.

## Dev acceptance gate

Standalone remains canonical until the integrated Dev copy passes:

- clean load with feature OFF and no renderer mutation;
- Blood Moon enable + visual acceptance;
- disable/restore readback;
- D4/body-glyph enable + visual acceptance;
- no conflict with existing Witch Dock/Booth behavior.

Public Stable remains unchanged until explicit promotion approval.
