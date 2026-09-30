# Pre-Flight Check

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-09-30 — #97 canonical Dev v1.15.7 corrective candidate

**PASS — immutable Dev candidate/static delivery gate; exact-source live and narrow human confirmation remain; NOT approved for Stable**

- Launcher v1.15.7 pins immutable payload `a262fde0f88847f0021621a8c285fbee38cce2db`; its manifest carries matching launcher metadata and Bug Capture UI v0.4.4.
- Outside Photo Booth, v0.4.3 failed because `BT.maker` is absent. v0.4.4 preserves the Photo Booth path when available and otherwise uses HeroForge's native `CK.Capture.renderToImage` with the active camera.
- Bounded live probe `wd97-20260930-native-editor-2k-probe-001` returned an exact 2048×2048 canvas from that editor-native fallback.
- Typography baseline `wd97-20260930-2k-font-baseline-001` confirmed the mismatch: reporter buttons computed as Arial/800 while labels used the system stack. The candidate explicitly applies the Witch Dock system family and aligned control/emphasis weights.
- `@name` remains `WITCH DOCK - DEV`, namespace remains `KnightWitch`, `@version`/runtime/manifest launcher version and build match, update/download URLs still target `WITCH_DEV_MAIN`, and JavaScript/JSON parse checks pass.
- Exact-source v1.15.7 reload/regression and Amanda's narrow 2K/typography visual confirmation remain.
- Feature-registry impact: **no registry impact**. Public Stable is untouched; `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty.
