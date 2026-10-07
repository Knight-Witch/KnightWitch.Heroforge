# Changelog

## Latest repository change — 2026-10-07

- #25 High Res Phase 2 manifest r5 live machine gate PASSED on Public Stable v2.4.2.
- r5 uses wrapper v0.1.2 / `0.1.2-native-shadow-preflight` from immutable payload `150e420e069dd1eb3cfd9872e71fe52a6ce9f063`, embedding all-part v0.1.14 / `0.1.14-native-shadow-preflight`.
- Both bird-shield families and `fanBattle` now receive 512×512 atlas allocations and verified 512×512 normal maps; unrelated `eyebrowL` remains 128×128.
- OFF restored exact Stable Active Decal Priority 0.1.1 and left Stable Native Reconcile 0.3.8 verified; re-enable returned to 104 active bindings with no error.
- Quiet 3-second readback retained the same coverage-run timestamp with no busy, queued, or change-pending state.
- Amanda's local r5 is left ON for renewed human visual/performance smoke. Manifest r5 remains `defaultEnabled: false` for everyone else.
- Public Stable source remains unchanged.
- This documentation-only checkpoint changes no runtime/module/manifest/public behavior.

## Latest Dev delivery context

Canonical Dev carries the native-shadow package and manifest r5. The next gate is Amanda's renewed human visual/performance confirmation; no Stable promotion and no default-ON Beta rollout is authorized.
