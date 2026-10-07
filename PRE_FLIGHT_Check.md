# Pre-Flight Check

## 2026-10-07 — #25 native-shadow atlas preflight

- PASS #4640–#4645: r4 v0.1.13 failed safely at the real post-rebuild collateral guard; all-part was removed and exact Stable priority 0.1.1 restored.
- PASS: live HeroForge `buildAtlas` source previously captured in #4639 uses only `this.parts`, `this.data.isUHD()`, `this.data.atlasScale`, private lexical atlas options, and assigns `this.resourceAtlas`; it is safe to invoke on a detached shadow receiver.
- PASS: all-part v0.1.14 / `0.1.14-native-shadow-preflight` uses that native shadow builder before any live density mutation.
- PASS: direct `CK.Atlas` remains a fallback only when the native shadow method returns no atlas; native shadow exceptions fail preflight rather than being ignored.
- PASS: regression permits a shield-style 512 candidate when the native builder preserves the unrelated 128 allocation.
- PASS: regression rejects/downgrades 512 when the native builder itself predicts a genuine unrelated shrink.
- PASS: existing real post-rebuild collateral/rollback tests remain green.
- PASS: module registry and Stable-compatible wrapper versions are synchronized to all-part v0.1.14 and wrapper v0.1.2.
- PASS: focused all-part/ownership/Beta suites pass 42/42.
- PENDING: immutable package commit + manifest r5 default-OFF + one controlled live replacement/readback.
- Public Stable remains unchanged; no Stable promotion is authorized.
