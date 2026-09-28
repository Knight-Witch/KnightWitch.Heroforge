# Active Context — issue #59 Texture Quality provider branch

**Updated:** 2026-09-27 UTC
**Branch:** `wd/59-texture-quality-provider`
**Canonical Dev baseline:** v1.11.0 / immutable payload `a80c9b094824e0a9143cb46e87e20e11b4044fde`
**Public Stable:** v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`
**Active issue:** #59 — Generic Bug Capture utility + HF.Status reproduction handoff

## Confirmed live baseline

General Capture live gate PASS:
- Dev v1.11.0 loaded from the expected immutable payload.
- Loader 29/29 executed, 0 failed, immutable=29, fallback=0.
- Diagnostics Core v0.1.0 present with providerCount=0.
- Bug Capture UI visibly mounted under Utilities.
- General capture completed with 8 addressable SHA-256 sections and no diagnostic errors.
- HeroForge scene remained `_needsUpdating=false` / `_inUpdate=false`.
- Local download succeeded; diagnostic event count advanced with no error.

## Current implementation slice

Add the first generic provider without modifying the validated High Res runtime:

- Texture Quality Diagnostic Provider v0.1.0 / `0.1.0-legacy-diagnostic-adapter`;
- delegates snapshot capture to existing `KWTextureQualityDiagnostics` v0.1.3;
- freezes current Native Reconcile diagnostic state at provider T0;
- maps legacy evidence into stable generic provider section names;
- delegates comparison capability without replacing the existing comparison lifecycle;
- marks retained pre-cleanup failure context explicitly unavailable for now;
- Bug Capture UI v0.2.0 adds generic opt-in provider selection.

Dev launcher v1.12.0 / `1.12.0-texture-quality-provider` is pinned to immutable payload `504f5267a83a528ecbc4a6b2d797736575a74b02`.

## Protected behavior

- Do not modify `Texture_Quality_Diagnostics.js` v0.1.3 in this slice.
- Do not modify Native Reconcile enable/disable/comparison/restoration behavior.
- Provider snapshot must be observational.
- Feature providers run only when explicitly selected.
- Public Stable remains untouched.

## Gate

Before integration:
1. adapter/UI syntax + manifest/static checks — PASS;
2. immutable payload + Dev launcher v1.12.0 — staged/pinned;
3. reload once through Bridge;
4. loader all modules, zero failed/fallback;
5. providerCount=1 and `texture-quality` inventory present;
6. generic capture with only `texture-quality`;
7. verify provider manifest/coverage/selected sections;
8. read back Native Reconcile state and prove no High Res lifecycle change.
