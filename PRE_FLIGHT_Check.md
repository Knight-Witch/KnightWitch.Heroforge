# Pre-Flight Check

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-09-30 — #97 Bug Capture UI v0.4.4 staging payload

**PASS — diagnosis and static candidate gate; immutable launcher pairing/live exact-source regression remain; NOT approved for Stable**

- Root cause reproduced: outside Photo Booth, `BT.maker` is absent, so v0.4.3 rejected the 2K action before capture.
- The maintained fallback uses HeroForge's existing `CK.Capture.renderToImage(2048, 2048, activeCamera, 1, true)` seam; bounded live probe `wd97-20260930-native-editor-2k-probe-001` returned an exact 2048×2048 canvas.
- When Photo Booth is open, the existing `BT.maker.takeScreenshot(2048, 2048)` path remains preferred and now accepts either synchronous canvas or Promise return.
- Typography baseline `wd97-20260930-2k-font-baseline-001` confirmed reporter buttons computed as browser-default Arial/800 while labels used the system stack. v0.4.4 explicitly inherits the reporter's Witch Dock system stack, aligns buttons to 12px/600, labels to 600, and strong values to 650.
- Bug Capture source parses; `manifest.json` parses; module version/build metadata matches v0.4.4 / `0.4.4-native-2k-typography`.
- Feature-registry impact: **no registry impact**. Public Stable is untouched; `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty.
