# Changelog

## Latest repository change — 2026-10-09

- **#111 live proof, documentation-only:** Dev Decals v1.2.3 native RGB/RGBA temporary highlight changed 172 pixels in the actual D5 bodyUpper color atlas (max channel delta 253/255), restoring the atlas exactly after rollback; saved coordinates and colors remain original. Bridge #4789. The original first UV preview was visually unchanged, so alignment correctness remains unproved. Next gate: owner loads D5 manually and judges temporary green markers. Stable unaffected.
- No runtime/module/manifest/public behavior changed in this documentation commit.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 feature.
