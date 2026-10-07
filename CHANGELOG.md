# Changelog

## Latest repository change — 2026-10-07

- Public Beta manifest revision 6 is live and validated.
- Amanda passed the renewed human visual gate for High Res Phase 2 after the native-shadow correction.
- r6 now exposes only `high-res-phase-2` v0.1.2 / `0.1.2-native-shadow-preflight`, pinned to immutable payload `150e420e069dd1eb3cfd9872e71fe52a6ce9f063`.
- Phase 2 is `defaultEnabled: true` only for testers with no saved preference; explicit saved OFF remains authoritative.
- The obsolete `beta-channel-smoke` assignment was removed cleanly.
- Bridge #4657 verified r6 as one module/one active with no manifest error, no Stable identity change, 104 Phase 2 bindings, and no new coverage run/churn after manifest refresh.
- Public Stable source remains unchanged; Stable promotion remains separately gated.
- This documentation-only checkpoint changes no additional runtime/module/manifest/public behavior beyond the already-live r6 assignment.

## Latest Dev delivery context

Canonical Dev carries the live Public Beta r6 assignment. Continue Beta observation/feedback; HF.Status #112 remains the separate Beta/QA backend lane.
