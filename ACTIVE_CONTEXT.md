# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-14
**Current task:** Texture Quality smart active-decal priority Dev candidate is technically live-validated; human visual gate is pending.
**Protected public state:** Stable service v0.3.4 / UI v0.2.0 and public notice v0.2.1 remain accepted. Stable is not the experimental environment.
**Dev candidate commit:** `1da76212b352f6e4e03641d8e3e2c314eff5b111`.
**Dev candidate:** core service v0.3.5 / build `0.3.5-preserve-native-source-floor`; active-decal policy v0.1.0 / build `0.1.0-dev-active-decal-scale-policy`; existing UI v0.2.0 unchanged.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `MODULE_VERSIONING.md` before runtime/version changes;
4. `features/rendering/Texture_Quality_Native_Reconcile.js`;
5. `features/rendering/Texture_Quality_Active_Decal_Priority.js`;
6. `manifest.json`;
7. `features/rendering/Texture_Quality_Native_Reconcile_UI.js` only if UI behavior/controls are being changed;
8. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not reopen unrelated Booth/decal-gizmo/history work. Do not consult HeroForge.Compatibility unless a new HeroForge engine seam remains unresolved after live source/runtime inspection.

## Confirmed diagnosis and implementation

- HeroForge exposes actual applied per-figure decal slots through `figureData.decals`; this is a cleaner selector than promoting every decal-capable part.
- The heavy primary figure has six part-backed active decal slots but 37 decal-capable parts.
- `k_9` / `clothVDress` had a 2048 baked ceiling but was allocated 1024×1024 because the accessory slot still requested scale 1.
- Increasing only the atlas ceiling to 8192×8192 did not improve it.
- Selective scale 4 on actual accessory decal slots promoted `k_9` to used=2048 / allocation=2048×2048.
- The dress remained 2048×2048 at the intended 8192×4096 atlas ceiling, so a square 8K atlas is unnecessary for this validated heavy figure.
- Core v0.3.5 makes `USED=1024` a floor rather than forcing an already-higher native source back to 1024.
- The isolated active-decal policy owns only non-core active accessory scales plus atlas-max settings it actually changes; body/head ownership stays in the accepted core service.
- Hardware capability is read through WebGL `MAX_TEXTURE_SIZE`; unknown capability fails closed instead of raising HeroForge maxima.

## Live Dev validation

Exact committed active-decal source from `1da76212...` was hot-loaded through HF-Chat-Bridge against the exact v0.3.5 core blob already active from the same source candidate.

- Bridge #2327/#2328: exact commit source loaded; hardware texture limit 16384; active budget 8192×4096; active accessory slots `k_6`, `k_7`, `k_9`; `k_9` scale 4 / used 2048 / allocation 2048×2048; core verification PASS; no runtime error.
- Bridge #2330/#2331: rebuilt a clean absent-property accessory-scale baseline and reloaded the exact committed policy; all three active accessory slots were promoted back to scale 4; `k_9` remained 2048×2048; verification PASS.
- Bridge #2332/#2333: High Res disable restored `k_6`, `k_7`, and `k_9` scale ownership exactly to absent properties; extension figure ownership cleared; core disabled cleanly with no error.
- Bridge #2334/#2335: manual re-enable cleared session suppression, repopulated active accessory ownership, restored scale 4, and returned `k_9` to 2048×2048; core verification PASS.
- Bridge #2336/#2337: bounded dynamic remove/restore probe on the real `k_9` decal collection worked. Removing the active decal dropped `k_9` from policy ownership and allocation to 1024×1024; restoring the exact original decal object re-added ownership and returned allocation to 2048×2048. Original decal object identity was restored; no errors remained.

The current browser scene exposes only the primary figure to the new policy, so this exact extension has not yet received a live multi-figure scene regression in this phase. The accepted core multi-figure lifecycle remains protected, and the extension uses the same `character.display` + `allDisplays` enumeration seam. Do not claim the new extension's multi-figure path is live-validated until a multi-figure scene is available.

## Next gate

1. Amanda visually checks the current figure, especially the decal-bearing dress/accessories, for any visual regression and confirms the sharper result looks correct.
2. Before Stable promotion, run one live multi-figure extension regression when a 2–3 figure scene is available; no need to repeat the completed core engine investigation.
3. If both gates pass, promote only the v0.3.5 core patch, v0.1.0 active-decal service, and manifest entries to `Witch_Scripts`, then run Stable smoke.

Do not promote to Stable without explicit approval.

## Deferred follow-on

A broader opt-in object/global texture-quality feature remains desired separately. Lob's FRD global ×4 behavior can improve arbitrary object textures (user report: the “egg”), but normal High Res should remain the targeted active-decal path. Design the heavier object mode as a separate toggle after this candidate is accepted; add graphics-tier controls only if testing shows they are needed.
