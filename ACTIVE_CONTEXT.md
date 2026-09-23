# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-21
**Canonical Dev:** `WITCH_DEV_MAIN`
**Active task:** issue #24 — submitted High Res regression fixtures
**Public Stable:** v2.0.1 / `Witch_Scripts` @ `33ff83599951a896d4bfcec180081a9b400a7f0b`
**Public immutable payload:** `f773cd9607d12a4479e31951973f288fa282543a`
**Canonical Dev launcher:** v1.5.2 / payload `22d9f9e0bbf90675b52474eb736663fd8d5df7ea`
**Issue #20:** COMPLETE — Booth JSON repair promoted and validated on public Stable

## Current state

Issue #20 is fully released:
- Booth v27.1.0 / `v27.1.0-booth-json-file-io`;
- Dev automated + human real-file gates passed;
- public Stable v2.0.1 smoke passed with Loader 23/23 and zero failures;
- Amanda confirmed real public Save Settings export and Load Settings restore both work;
- current Hero Forge / Witch Dock Booth JSON behavior is now the maintained canonical implementation.

Post-release parity check:
- all 39 shared active/runtime JS/CSS blobs are byte-identical between `WITCH_DEV_MAIN` and public Stable;
- only the intentional Dev launcher/channel identity differs;
- two Dev-only JS files are archived issue #26 bone-detection references under `HISTORY/REFERENCES`, not runtime modules;
- issue #20 is removed from `DEV_DIVERGENCES.json`.

## Active work — issue #24

Execution plan: `docs/investigations/ISSUE_24_TEXTURE_REGRESSION_PLAN_2026-09-22.md`

Begin controlled reproduction on the actual submitted High Res fixtures before changing Texture Quality architecture. The 2026-09-22 controlled color-channel suite and AAT75R/Lob cases are incorporated into issue #24 and the plan above.

Required order:
1. reproduce each submitted fixture on current canonical Dev;
2. record before-enable / enabled / disabled / native-idle behavior;
3. capture figure/host/material ownership and classify each result;
4. distinguish Witch Dock regression, uncovered texture host, HeroForge rebake/channel behavior, or upstream-only behavior;
5. use `Knight-Witch/HeroForge.Compatibility` branch `feature/rendering-texture-quality` only when unresolved engine evidence or validated compatibility work is directly required.

Do not reopen old artifact conclusions on historical evidence alone.

After #24, continue issue #25 targeted coverage expansion for objects / KB items / tails / hair with measured VRAM/performance optimization.

## Release janitorial state

Issue #20 branch cleanup is COMPLETE. Work deleted the four temporary issue #20 refs and verified the live repository contains exactly the six protected branches. No issue #20 janitorial work remains.

## Protected state

- Keep `Witch_Scripts` as public Stable.
- Keep `WITCH_DEV_MAIN` as the sole canonical Dev branch.
- Keep `archive/Witch_Scripts-pre-modular-20260920` as rollback.
- Keep `wd/dev-auto-host` as Dev infrastructure.
- Keep `wd/payload-1.5.1` and `wd/28-public-payload-2.0.0` as known-good prior immutable rollback payload refs until a separate rollback-retention decision changes that policy.
- HF-Chat-Bridge remains development infrastructure only and never a Witch Dock runtime dependency.
