# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-24  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #34 — **HR false restore warning / native body mask verification**  
**Separate active bug:** issue #32 — **HR body paint zone collapse**  
**Public Stable:** v2.0.3 / `Witch_Scripts` @ `0a5ee9c99f1ca999ead93baa39948d8595830064`  
**Public immutable payload:** `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`  
**Canonical Dev launcher:** v1.5.4 / payload `6aee7fd8716d986e39b7415cf8927fa7043e776b`

## Current route

Issue #24 — **HR ON/OFF body visual paint tint change** is resolved and promoted.

Public v2.0.3 live smoke confirms Stable identity v2.0.3 / `2.0.3-issue-24-colorbake-restore`, immutable payload `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`, loader 23/23 with 0 failures, and Texture Quality v0.3.7 / `0.3.7-refresh-native-color-bake`. Amanda confirmed the Stable ON→OFF body-tint result is visually correct.

During that smoke, an intermittent `OFF / restore warning — primary: bodyLower native color-bake mask was not adopted` was captured while the resulting native state remained visually correct and structurally coherent. That warning is isolated as **#34** and must not reopen #24 unless an actual visual tint regression returns.

For #34, start with the captured verifier hypotheses:
1. restore verification may incorrectly derive expected body-mask size from `nativeSources.usedTextureSize` when the supported native mask is smaller;
2. HeroForge shared-resource cache identity may make a correctly restored native mask object equal the previously loaded HR mask object, falsely triggering the retained-override assertion.

Bridge evidence: HF-Chat-Bridge #3391, #3392, #3394, #3395.

## #24 reconciliation / janitorial state

- Dev and Stable Texture Quality source blob are identical: `09d92a14595077d49ec928263c6aab7ca3ef468a`.
- All 36 shared non-launcher runtime JS/CSS paths were checked byte-for-byte with zero mismatches.
- Non-launcher module registry parity is restored; issue #24 is removed from `DEV_DIVERGENCES.json`.
- Temporary #24 branches are queued for exact mechanical deletion through `docs/BRANCH_DELETION_HANDOFF_ISSUE_24_2026-09-24.md`.
- Janitorial branch deletion is tracked by issue #14. Do not re-audit unless live branch state contradicts the handoff.

## Scope boundaries

- #32 — **HR body paint zone collapse** remains separate from #34.
- #34 is a restore-verification/warning problem unless evidence proves an actual restore failure.
- #29 — HF Core Tweaks console flood remains unrelated.

## Protected state

- Keep `Witch_Scripts` public Stable.
- Keep `WITCH_DEV_MAIN` canonical Dev.
- Keep the exact protected branches listed in the #24 deletion handoff.
- HF-Chat-Bridge remains development infrastructure only and never a Witch Dock runtime dependency.
