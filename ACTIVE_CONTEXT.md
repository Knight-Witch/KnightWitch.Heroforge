# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-21
**Canonical Dev:** `WITCH_DEV_MAIN`
**Active task:** issue #20 — Booth JSON import/export repair
**Current task branch:** `wd/20-booth-json-repair`
**Release status:** issue #28 COMPLETE — public modular v2.0.0 promoted and Stable-smoke validated
**Public Stable:** `Witch_Scripts` @ `95b5cdae4c8840d950d984c73bce101ba887011e`
**Public payload:** `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`
**Rollback archive:** `archive/Witch_Scripts-pre-modular-20260920` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`
**Canonical Dev launcher candidate:** v1.5.2 / payload `22d9f9e0bbf90675b52474eb736663fd8d5df7ea` — issue #20 live validation pending

## Current state

Branch retirement is complete. The obsolete `WITCH_DEV_UI` and `WITCH_DEV` refs are deleted; `WITCH_DEV_MAIN` is the only canonical Witch Dock Dev branch.

The cleanup left exactly six protected/operational long-lived refs: public Stable, canonical Dev, rollback archive, two immutable payload refs, and Dev Auto Host. One additional short-lived issue branch now exists for the selected Booth JSON repair: `wd/20-booth-json-repair`.

Issue #20 source/runtime diagnosis is underway. Lob's legacy Booth JSON path is separate from ordinary character JSON and still depends on obsolete Booth serialization assumptions. Current implementation work must use the live HeroForge Booth ownership/state seams rather than restoring the old `TN.tokenizer.effectState.toJson/fromJson` path blindly.

## Next work

1. Finish issue #20 Booth JSON import/export on `wd/20-booth-json-repair`, validate in Dev, then follow the normal promotion/janitorial flow.
2. Immediately after #20, prioritize issue #24 submitted High Res regression fixtures.
3. Then continue issue #25 targeted High Res expansion for objects / KB items / tails / hair with VRAM/performance measurement and optimization.

Do not resume issue #10 or the retired legacy-Dev migration work.

## Protected state

- Keep `Witch_Scripts` as public Stable.
- Keep `WITCH_DEV_MAIN` as the sole canonical Dev branch.
- Keep `archive/Witch_Scripts-pre-modular-20260920` as the pre-modular Stable rollback.
- Keep `wd/28-public-payload-2.0.0` and `wd/payload-1.5.1` because public Stable and canonical Dev pin their immutable commits.
- Keep `wd/dev-auto-host` as operational Dev infrastructure.
- `wd/20-booth-json-repair` is short-lived issue-scoped work and should be deleted after validated integration/promotion cleanup.
- Preserve issue #19 canonical Dev identity/routing.
- HF-Chat-Bridge remains development infrastructure only and never a Witch Dock runtime dependency.
