# Changelog

## Latest repository change — 2026-10-07

- #25 fixes a confirmed Phase 2 coverage false-negative found by Amanda's Public Stable Beta smoke: bird shields and the battle hand fan had verified 512 source headroom but were rejected by the detached atlas safety preflight.
- Live HeroForge source proves `CK.Atlas` supports per-slot `minimumSizes`, and HeroForge's real `buildAtlas` uses the seventh constructor options argument. All-part v0.1.12 omitted those floors during detached preflight, falsely reconstructing `eyebrowL` as 32x32 versus its live 128x128 baseline.
- All-part is bumped to v0.1.13 / `0.1.13-native-baseline-preflight`: detached preflight now preserves observed live baseline allocation floors before evaluating new density.
- The actual post-rebuild no-collateral check and exact rollback remain unchanged and authoritative.
- Stable-compatible Beta package is bumped to v0.1.1 / `0.1.1-native-baseline-preflight` and embeds exact all-part v0.1.13.
- Focused all-part/ownership/Beta suites pass 41/41.
- Beta manifest r3 and Public Stable remain unchanged until the new immutable package is committed and live-gated.

## Latest Dev delivery context

The next gate is an immutable Beta payload + manifest r4, followed by Counting Sheep live proof for both shield families, the battle fan, eyebrow baseline preservation, skipped-group reduction, rollback and anti-loop behavior. No Stable promotion is authorized.
