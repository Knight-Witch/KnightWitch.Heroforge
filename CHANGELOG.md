# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change — 2026-09-30

- Bug Capture UI v0.4.4 fixes the Evidence 2K action outside Photo Booth by using HeroForge's native editor capture path when the Photo Booth maker is not mounted; the existing Photo Booth-native path remains preferred when available.
- Reporter controls now explicitly inherit the Witch Dock system type stack. Buttons use the Dock's 12px/600 control typography, reporter labels no longer use the heavier 800 weight, and strong/receipt values use the same inherited family with the Dock-aligned 650 emphasis.
- The native editor fallback was live-proved to return an exact 2048×2048 canvas from `CK.Capture.renderToImage` with the active HeroForge camera.
- This is an isolated #97 Dev correction. #59 remains capture-only, #89 remains follow-up-only, and Public Stable is untouched.
- Feature-registry impact: **no registry impact**. Existing feature/group IDs and ownership remain unchanged.
- `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`.

## Latest Stable release — v2.3.2

- Public Stable remains `Witch_Scripts` v2.3.2 with immutable payload `9e0ac579d142808016a1fa4539be3acc4c65fb82`.
- Release #94 moved Booth JSON Save/Load into its own `Booth JSON Import / Export` section; Stable smoke and Amanda's visual gate passed.
- Detailed release history: issue #94 and PR #96.
