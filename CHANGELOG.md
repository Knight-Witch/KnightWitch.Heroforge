# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change — 2026-09-30

- Amanda confirmed the final #97 visual/interaction gate on canonical Dev v1.15.7: Evidence 2K attaches correctly and the reporter typography now matches Witch Dock.
- All scoped Dev gates are complete for Bug Capture UI v0.4.4 / `0.4.4-native-2k-typography`, immutable payload `a262fde0f88847f0021621a8c285fbee38cce2db`.
- Earlier exact-source and backend evidence remains passed: 36/36 immutable modules with zero fallback/failure and real HF.Status E2E at `HFBR-20260930-V4M8M2EA`.
- The next gate is explicit narrow Stable promotion approval. Public Stable is untouched.
- Feature-registry impact: **no registry impact**. Existing feature/group IDs and ownership remain unchanged.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty.
- This documentation-only confirmation changes no runtime, module, manifest, or public behavior.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
