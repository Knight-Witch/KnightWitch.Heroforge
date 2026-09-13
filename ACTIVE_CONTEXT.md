# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-12  
**Current task:** Texture Quality v0.2.0 persistence candidate — live Dev validation and UX gate.  
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched; persistence exists only in `WITCH_DEV_UI` until validation passes.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md`
4. `features/rendering/Texture_Quality_Native_Reconcile.js`
5. `features/rendering/Texture_Quality_Native_Reconcile_UI.js`
6. `MODULE_VERSIONING.md` only if another code/version change is about to be committed

Do not preload the full `MASTER.md`, changelog, pre-flight log, session log, standalone references, Booth history, or HeroForge.Compatibility history unless a new question specifically routes there.

## Public Stable — protected PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Stable modules remain:

- `texture-quality-native-reconcile` v0.1.0 / build `0.1.0-dev-hfc-alpha3-port`
- `texture-quality-native-reconcile-ui` v0.1.0 / build `0.1.0-dev-texture-quality-controls`

Stable Blood Moon validation remains accepted: coherent native atlas, BL/BU/face at high-resolution allocations, exact pinned 1024 body masks, zero sampled accessory fallback/broken bindings, one Booth runtime, and Amanda visual PASS. Bridge evidence #1747/#1748/#1750.

## Current Dev candidate

Texture Quality persistence was approved and implemented on `WITCH_DEV_UI` as:

- service v0.2.0 / build `0.2.0-dev-persistent-preference`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`.

Approved UX/semantics:

- default/first-time state is OFF;
- manual `Enable High Res` remains session-only when persistence is unchecked;
- `Persistent` stores only a boolean desired preference and automatically enables High Res after page reloads and figure changes using a fresh safe reconcile session;
- while persistence owns a pending automatic enable, the manual Enable control is disabled;
- manual Disable while persistence is checked suppresses High Res only for the current page session; manual Enable clears that suppression, and page reload restores persistent behavior;
- unchecking persistence disables future automatic enable but does not forcibly disable an already-active High Res session;
- `Reconcile Now` moved into a collapsed `Advanced` section with user-facing recovery guidance.

Safety behavior:

- no renderer/session/snapshot/mask/display/modded/atlas object is persisted;
- figure replacement still discards the old session before any new action;
- auto-enable waits for fresh renderer readiness, is single-flight, and does not uncontrolled-retry the same failed figure;
- the v0.1.0 native atlas/source-policy/restore/verify architecture remains otherwise unchanged.

## Validation state

Static validation PASS:

- both JavaScript modules pass `node --check`;
- `manifest.json` parses;
- manifest registry/build/cache-key versions are consistent at v0.2.0.

Live Dev validation is still pending. Use HF-Chat-Bridge autonomously to verify persistence startup/reload/figure-change/session-disable semantics plus atlas/mask coherence and Booth topology. Amanda is needed only for final visual/UX confirmation.

## Validated architecture that must not regress

Keep HeroForge native atlas/generation ownership. Texture Quality owns only source policy and exact real 1024 body-mask overrides for the active session. Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.

## Cross-repo routing

The engine investigation is complete. `Knight-Witch/HeroForge.Compatibility` remains upstream evidence only and should not be loaded unless a new unresolved HeroForge-internal question appears. Witch Dock owns persistence/product behavior.