# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-24  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #35 — **High Res diagnostic capture**  
**Paused validation bug:** issue #32 — **HR body paint zone collapse**  
**Separate open bug:** issue #34 — **HR false restore warning / native body mask verification**  
**Public Stable:** v2.0.3 / `Witch_Scripts` @ `0a5ee9c99f1ca999ead93baa39948d8595830064`  
**Public immutable payload:** `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`  
**Canonical Dev launcher:** v1.5.4 / payload `6aee7fd8716d986e39b7415cf8927fa7043e776b`

## Current route

Build the smallest usable Dev-only High Res Diagnostic Capture v1 under issue #35 before resuming #32.

Implementation branch: `wd/35-hr-diagnostic-capture`.

Initial provider scope:
- immutable/current read-only snapshot;
- figure/part/slot inventory;
- model `paints` / `paintByIntent` values + signatures;
- atlas dimensions/allocations;
- body mask/material bindings and referenced resources;
- color-bake structural/target state;
- Texture Quality public + narrow private diagnostic state;
- explicit coverage/missing-data manifest;
- compact deterministic summary;
- local JSON export;
- controlled Native OFF → High Res ON comparison with at-most-once lifecycle transitions and restoration readback.

The capture layer records evidence; it must not narrow collection around a presumed #32 cause.

## First real validation fixture

Issue #32 Robot — config `59568049`.

Pause manual #32 probing. After #35 static/live startup validation, use Robot as the first Native OFF → HR ON differential capture. If the capture fails to expose any meaningful divergence while the visual bug reproduces, treat that as evidence that the diagnostic surface is missing a layer and extend #35 before brute-forcing the remaining #32 fixture matrix.

## Scope boundaries

- #35 does not fix #32.
- #35 does not fix or reinterpret #34.
- #24 remains resolved unless its actual visual ON→OFF tint defect returns.
- Public Stable stays untouched.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.

## Protected state

- Keep `Witch_Scripts` public Stable.
- Keep `WITCH_DEV_MAIN` canonical Dev.
- Preserve Texture Quality v0.3.7 behavior while adding only the backward-compatible read-only diagnostic seam required by #35.
- Standard diagnostic capture must not mutate HeroForge/High Res state.
- Controlled comparison may use only the existing Texture Quality lifecycle APIs and must retain evidence on transition failure.
