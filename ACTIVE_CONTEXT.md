# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-21
**Canonical Dev:** `WITCH_DEV_MAIN`
**Active task:** issue #20 — Booth JSON import/export repair
**Current task branch:** `wd/20-booth-json-repair`
**Dev gate:** PASS — automated + human real-file export/import validation complete
**Promotion state:** awaiting explicit narrow Stable promotion authorization
**Public Stable:** `Witch_Scripts` @ `95b5cdae4c8840d950d984c73bce101ba887011e`
**Rollback archive:** `archive/Witch_Scripts-pre-modular-20260920` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`
**Canonical Dev launcher:** v1.5.2 / issue #20 candidate payload pinned in current launcher

## Current state

Branch retirement is complete. `WITCH_DEV_MAIN` is the sole canonical Dev branch.

Issue #20 is implemented and Dev-validated:
- Booth tool v27.1.0 uses Hero Forge-owned current Booth save/load seams;
- Witch Dock full Booth JSON round-trip passed live;
- legacy Lob effect-only Booth JSON is accepted through the current effects persistence path;
- invalid/unrecognized JSON fails closed before mutation;
- Loader completed 23/23 modules with zero failures;
- Amanda confirmed the new UI looks normal and independently confirmed real file export + load both work.

Public Stable has not been modified for issue #20.

## Exact next step

Wait for explicit authorization for the **narrow issue #20 Stable promotion**.

Once authorized, perform only the normal release flow:
1. promote the validated Booth JSON scope to `Witch_Scripts`;
2. run Stable smoke;
3. perform automatic Dev reconciliation/janitorial cleanup under the standing release authorization;
4. close #20 and remove the short-lived task branch when safely reachable.

After #20 release closeout, immediately prioritize:
1. issue #24 submitted High Res regression fixtures;
2. issue #25 targeted High Res expansion for objects / KB items / tails / hair with measured VRAM/performance optimization.

Do not resume issue #10 or retired legacy-Dev migration work.

## Protected state

- `Witch_Scripts` remains public Stable until explicit issue #20 promotion authorization.
- Keep `WITCH_DEV_MAIN` as canonical Dev.
- Keep rollback/payload/Dev Auto Host refs required by the modular architecture.
- Keep `wd/20-booth-json-repair` only until issue #20 promotion cleanup completes.
- HF-Chat-Bridge remains development infrastructure only and never a Witch Dock runtime dependency.
