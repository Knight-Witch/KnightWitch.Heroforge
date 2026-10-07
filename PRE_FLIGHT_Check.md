# Pre-Flight Check

## 2026-10-07 — #25 native-shadow Phase 2 Beta r5 live gate PASS

- PASS: immutable source/package commit `150e420e069dd1eb3cfd9872e71fe52a6ce9f063` is integrated into canonical Dev.
- PASS: all-part v0.1.14 / `0.1.14-native-shadow-preflight`; Stable-compatible wrapper v0.1.2 / `0.1.2-native-shadow-preflight`.
- PASS: focused all-part/ownership/Beta suites remain 42/42.
- PASS #4652: manifest r5 is loaded and the replacement module is active with no host error.
- PASS #4653/#4654: `shieldBirdWing`, `shieldBirdFlying`, and `fanBattle` are each 512×512 in the live atlas and use real 512×512 normal maps; `eyebrowL` remains 128×128.
- PASS #4655: Beta OFF removed all-part, restored exact Stable Active Decal Priority 0.1.1, and left Native Reconcile 0.3.8 ON/persistent, verified, idle, and error-free.
- PASS #4656: re-enable settled with 104 active bindings, no error, and no busy/queued/change-pending state; the coverage-run timestamp remained unchanged across a quiet 3-second interval.
- HUMAN GATE: Amanda's local r5 remains ON for renewed visual/performance smoke on the previously soft shields and hand fan plus normal interaction.
- Manifest r5 remains `defaultEnabled: false`; Public Stable source is unchanged and no Stable promotion is authorized.
- This documentation-only checkpoint changes no runtime/module/manifest/public behavior.
