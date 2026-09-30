# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change — 2026-09-30

- Canonical Dev launcher v1.15.7 pins immutable payload `a262fde0f88847f0021621a8c285fbee38cce2db` with Bug Capture UI v0.4.4 / `0.4.4-native-2k-typography`.
- Evidence 2K now preserves the existing Photo Booth native path when mounted and falls back to HeroForge's native editor renderer when Photo Booth is not open. The fallback was independently proved to return an exact 2048×2048 canvas.
- Reporter buttons and form controls explicitly inherit the Witch Dock system font stack; buttons align to 12px/600, labels to 600, and strong/receipt values to 650.
- Exact-source v1.15.7 Bridge regression and Amanda's narrow 2K/typography confirmation remain. Public Stable is untouched.
- Feature-registry impact: **no registry impact**. Existing feature/group IDs and ownership remain unchanged.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
