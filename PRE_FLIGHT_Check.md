# Pre-Flight Check

## 2026-10-07 — #25 shield/fan false-preflight correction

- PASS: user visual report reproduced in runtime evidence rather than inferred from appearance.
- PASS #4633/#4634: `shieldBirdWing`, `shieldBirdFlying`, and `fanBattle` each resolve a valid 512 normal source and are blocked only by detached native packing preflight.
- PASS #4635: each rejection reports the same false collateral: live `eyebrowL` baseline 128x128 reconstructed as 32x32.
- PASS #4636/#4637: live shield/fan metadata is eligible; `eyebrowL._usedTextureSize` is 128 and its live atlas allocation is 128x128.
- PASS #4638/#4639: live HeroForge source confirms `CK.Atlas` consumes `options.minimumSizes` and real `buildAtlas` supplies the seventh options argument; v0.1.12 detached preflight did not.
- PASS: all-part v0.1.13 / `0.1.13-native-baseline-preflight` supplies observed live baseline allocation edges as detached native minimum floors.
- PASS: existing real-collateral rejection regression remains green; new false-preflight regression proves a valid shield-style promotion reaches 512 while preserving the unrelated baseline floor.
- PASS: manifest/module version references and Stable-compatible Beta wrapper are updated to all-part v0.1.13; wrapper v0.1.1 / `0.1.1-native-baseline-preflight`.
- PASS: focused all-part/ownership/Beta suites pass 41/41.
- PENDING: commit immutable package, stage Beta manifest r4 default-OFF, then live prove shield/fan density plus collateral/rollback/anti-loop behavior.
- Public Stable remains unchanged; no Stable promotion is authorized.
