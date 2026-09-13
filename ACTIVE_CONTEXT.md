# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-12  
**Current task:** Texture Quality follow-up — decide and design persistent user preference / safe automatic re-enable behavior.  
**Runtime posture:** public Stable Texture Quality v0.1.0 is released and visually accepted; next behavior change must return to `WITCH_DEV_UI` first.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md`
4. `features/rendering/Texture_Quality_Native_Reconcile.js`
5. `features/rendering/Texture_Quality_Native_Reconcile_UI.js`
6. `MODULE_VERSIONING.md` only if code/version changes are about to be committed

Do not preload the full `MASTER.md`, changelog, pre-flight log, session log, standalone references, Booth history, or HeroForge.Compatibility history unless a new question specifically routes there.

## Current public release — PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Texture Quality public modules:

- `texture-quality-native-reconcile` v0.1.0 / build `0.1.0-dev-hfc-alpha3-port`
- `texture-quality-native-reconcile-ui` v0.1.0 / build `0.1.0-dev-texture-quality-controls`

Stable Blood Moon smoke passed after Dev and standalone scripts were disabled:

- clean OFF/native baseline: 4096 atlas, BL/BU used 512, face used 1024, no scale or mask overrides;
- one Stable enable: service ON, no error, one expected native generation adoption, coherent 4096 atlas, BL/BU/face allocations+used 1024, exact pinned 1024 body masks, scheduler idle;
- accessory scan: zero broken/fallback bindings across 16 Discus, 2 Short Crown Horn, and 3 Celestial Circlet instances;
- Booth topology remained one `/gated/booth.js` runtime with BT/bootstrap intact;
- Amanda visually confirmed the public Stable result looks great.

Bridge evidence: #1747, #1748, #1750. Full details are already recorded in Stable `CHANGELOG.md` / `PRE_FLIGHT_Check.md`; do not reload raw issue payloads unless a regression needs them.

## Confirmed current persistence behavior

Texture Quality v0.1.0 stores no persistent user preference.

- **Same figure, ordinary native renderer refresh:** stays ON; validated in Dev.
- **HeroForge figure change:** `handleStaleFigure()` drops the old session, clears `enabled`, and reports `OFF — figure changed; enable again for this figure.` The UI polls `service.refresh()` every 250 ms, so this state is surfaced automatically.
- **Page reload:** module state is recreated and starts OFF/inert.

This behavior was intentional during safety validation: stale snapshots from one figure must never be restored or replayed into another figure.

## Exact handoff point

Amanda asked whether users would have to toggle Texture Quality on each time. The answer immediately before this handoff was:

> Right now it is not persistent. Reloading the page starts OFF, and switching figures also turns it OFF. Same-figure native refreshes stay ON. The clean next improvement is a persistent **desired preference**: remember that High Res should be enabled, but still create a fresh safe session/reconcile for each page/figure rather than reusing old snapshots.

Amanda said she already has her response ready once the next chat is caught up. **Do not assume she has approved that design yet; let her give that response first.**

## Likely design boundary if approved

Supported direction, not yet committed:

- persist only a boolean user intent/preference, never session objects, snapshots, masks, display/modded references, or atlas objects;
- a fresh page/figure must resolve fresh HeroForge capabilities/parts/masks before enabling;
- figure change must discard the old session before any automatic action on the replacement figure;
- auto-enable should single-flight and wait for renderer readiness rather than racing character load;
- failures should leave that figure safely OFF with a visible status/error rather than retry-looping or reusing stale state;
- manual Disable should plausibly turn the persistent preference OFF, but exact UX/storage semantics await Amanda's response;
- implement/test in `WITCH_DEV_UI`; Stable v0.1.0 remains protected until Dev + human acceptance.

## Validated architecture that must not regress

Keep HeroForge native atlas/generation ownership. Texture Quality owns only source policy and exact real 1024 body-mask overrides for the active session. Do not reintroduce custom `CK.Atlas`, `buildAtlas` wrapping, direct atlas assignment, giant-atlas forcing, persistent atlas ownership, or stale cross-figure snapshots.

## Cross-repo routing

The engine investigation is complete. `Knight-Witch/HeroForge.Compatibility` is upstream evidence only and should not be loaded for this persistence follow-up unless a new HeroForge-internal question appears. Witch Dock now owns the product/integration behavior.