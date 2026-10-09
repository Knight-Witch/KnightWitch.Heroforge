# Changelog

## Latest repository change — 2026-10-09

- **#111 Dev-only:** Decals v1.2.2 opt-in high-contrast legacy torso UV preview temporarily renders selected faint circle-gradient layer green to discriminate if live visible nipple marks are controlled by the candidate shader layers. Existing original gradient palette, UV uniform objects, native atlas and cached pixels are restored on Revert/timeout/failure, with no figure data modifications or permanent Apply.
- Prior v1.2.1 live GPU readback: 19 changed pixels (UV scale .94) / 11 (large U offset), max intensity delta 3/255; restored pixel-perfect. This explains why Amanda saw no movement; first human gate FAIL, not a visual pass.
- Mock UV, vivid-palette, pixel-readback and native-rollback tests PASS. Dev launcher v1.17.19 pinned to immutable contrast payload 1da92c1c99e96668823bdfa6cd48ee433704f1bf. No Stable/public change.

## Latest Stable release context

Stable v2.4.3 carries no #111 code.
