# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-24  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #35 — **High Res diagnostic capture**  
**Paused validation bug:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Public Stable:** v2.0.3 / `Witch_Scripts` @ `0a5ee9c99f1ca999ead93baa39948d8595830064`  
**Public immutable payload:** `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`  
**Canonical Dev launcher:** v1.5.9 / payload `c4fe7ef7f6307578823706de552b44b8a2a378dd`

## Current route

Issue #35 is the active Dev task.

The canonical Dev launcher is pinned to canonical-main payload `c4fe7ef7f6307578823706de552b44b8a2a378dd` for the final #35 integration smoke through Amanda's installed Dev Auto Host v0.1.1. Normal loader resolution must remain immutable-payload-only with zero fallback requests.

Payload contents:
- Texture Quality Native Reconcile v0.4.0 / `0.4.0-diagnostic-state-seam`;
- High Res Diagnostic Capture v0.1.3 / `0.1.3-addressable-comparison-sections`;
- High Res Diagnostic Capture UI v0.1.0 / `0.1.0-hr-capture-v1-ui`;
- 25 manifest modules total.

The validated #35 runtime is integrated on WITCH_DEV_MAIN. Final canonical-payload smoke is pending; #32 remains paused/separate.

## First live gates

1. Reload HeroForge through Dev Auto Host.
2. Require launcher v1.5.9 / payload `c4fe7ef7f630…`.
3. Require loader 25/25, zero failures, immutable=25, fallback=0.
4. Require Texture Quality v0.4.0 with prior behavior intact.
5. Require High Res Diagnostics v0.1.0 and its Utilities UI.
6. Prove `Capture Current State` is observational.
7. Use #32 Robot config `59568049` for the first Native OFF → High Res ON differential capture.

## Scope boundaries

- #35 does not fix #32.
- #35 does not fix or reinterpret #34.
- #24 remains resolved unless its actual visual ON→OFF tint defect returns.
- Public Stable stays untouched.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.

## Protected state

- Keep `Witch_Scripts` public Stable.
- Keep `WITCH_DEV_MAIN` canonical Dev.
- Preserve Texture Quality v0.3.7 rendering/reconcile behavior while the candidate exposes only the new read-only diagnostic seam.
- Standard diagnostic capture must not mutate HeroForge/High Res state.
- Controlled comparison may use only existing Texture Quality lifecycle APIs and must retain evidence on transition failure.
