# Texture Quality — Native Reconcile

Date: 2026-09-12  
Status: Witch Dock Dev accepted; ready for explicit Stable promotion review  
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

## Integrated Dev validation

### D4 — PASS

Clean Dev reload with the standalone disabled confirmed:

- service/UI loaded exactly once;
- service started OFF/inert;
- standalone global absent;
- D4 baseline stayed native `4096x4096`, BL/BU `1024 bake / 512 used`, face `1024 / 1024`, no body mask overrides, scheduler idle.

One Dev enable then produced:

- service ON, no error, one expected generation adoption;
- native coherent `4096x4096` atlas;
- BL/BU/face allocations `2048x2048` and used `2048`;
- exact pinned real `1024x1024` body masks as actual color-bake inputs;
- scheduler idle after settle.

Amanda visually confirmed the integrated result looks perfect, including the historically sensitive body color/glyph channel, body/face sharpness, decals, no poop/corruption, and no wrong material/color/emissive channels.

Bridge evidence: #1735, #1737.

### D4 disable / repeated lifecycle — PASS with native-recalculation nuance

Controlled disable returned true and removed every feature-owned target scale override and both body mask overrides. HeroForge rebuilt natively at 4096 atlas / bake 1024 with scheduler idle.

The rebuilt D4 generation settled at `_usedTextureSize=1024/1024/1024`, not its original `512/512/1024`. Because feature-owned scale/mask properties were confirmed absent, this is native post-restore recalculation rather than retained Witch Dock ownership. The disable contract therefore means "restore/remove owned source policy and rebuild natively," not "guarantee identical transient native used-size values."

A subsequent OFF -> ON enable passed again at native 4096 atlas, 2048 allocations/used, exact 1024 masks, no error, scheduler idle.

Bridge evidence: #1738, #1739, #1740.

### Blood Moon — PASS

Clean Dev reload with the standalone disabled confirmed:

- Dev service/UI present;
- scheduler idle;
- native atlas `4096x4096`;
- no target `atlasScale` overrides;
- no body mask overrides;
- native source state BL/BU `1024 bake / 512 used`, face `1024 / 1024`.

One Dev enable produced:

- service ON, no error, one expected generation adoption;
- coherent native `4096x4096` atlas;
- BL/BU/face allocations `1024x1024`;
- `bakeSize=2048`, `_usedTextureSize=1024` on all three;
- exact pinned real `1024x1024` body masks remained the actual color-bake inputs;
- scheduler idle after settle.

Amanda visually confirmed Blood Moon looks correct: sharp body texture and decals, no poop/corruption, correct Discus / Celestial Circlet / Short Crown Horn color/material/emissive channels, and no visible regression elsewhere.

A focused resource probe found zero fallback/broken bindings among 16 `discus`, 2 `spikeSmall`, and 3 `starCirclet` parts.

Bridge evidence: #1741, #1742, #1744.

### Ordinary native-refresh survival — PASS

With Texture Quality still ON, one ordinary `CK.character.refresh()` completed cleanly. The service adopted the replacement display/modded generation, `verify()` remained OK, adoption count advanced from one to two, atlas stayed `4096x4096`, target bake/used state stayed `2048 / 1024`, both body mask overrides remained valid 1024 textures, and the scheduler returned idle.

This confirms the service survives an ordinary native regeneration without a persistent watcher or custom atlas ownership.

Bridge evidence: #1745.

### Witch Dock / Booth topology smoke — PASS

Without changing Booth mode or component state, a topology probe found:

- exactly one `/gated/booth.js` script;
- script state `loaded`, parent BODY;
- live `BT` runtime;
- live `KW_WD_BOOTH_BOOTSTRAP`;
- live Texture Quality service and UI globals.

No duplicate Booth script/runtime load was introduced by Texture Quality or the native-refresh smoke. The generic scene traversal in this probe did not enumerate named TokenBackground/TokenShadow/TokenFrame nodes, so no overlay-count assertion is made from that specific probe.

Bridge evidence: #1746.

## Dev acceptance disposition

Standalone Blood Moon + D4: PASS.  
Integrated D4 visual/body-color/glyph gate: PASS.  
Integrated D4 OFF -> ON lifecycle / ownership release: PASS.  
Integrated Blood Moon accessory/material-channel gate: PASS.  
Ordinary native refresh survival: PASS.  
Non-invasive Witch Dock/Booth topology smoke: PASS.

**WITCH_DEV_UI acceptance gate is CLOSED / PASS.**

The validated behavior target is now the Dev service/UI v0.1.0 architecture above. Do not return to persistent custom atlas ownership, giant-atlas forcing, custom `CK.Atlas`, buildAtlas wrapping, direct atlas assignment, or automatic ownership watching.

## Stable promotion boundary

Public `Witch_Scripts` remains unchanged until Amanda explicitly approves promotion.

When promotion is approved:

- port only the accepted Dev service/UI and required manifest wiring;
- preserve the current service/UI versions/build contracts unless the Stable packaging convention requires a narrow release-version bump;
- do not reopen the underlying texture investigation absent a new regression;
- repeat a clean Stable load/enable smoke on Blood Moon or equivalent before declaring public release complete.
