# Changelog

## Latest repository change — 2026-10-07

- #25 High Res Phase 2 completed the renewed human visual gate after the native-shadow correction; Amanda confirmed the previously soft shields and hand fan now look good.
- Public Beta manifest revision 6 makes `high-res-phase-2` v0.1.2 / `0.1.2-native-shadow-preflight` the sole active Beta module, pinned to immutable payload `150e420e069dd1eb3cfd9872e71fe52a6ce9f063`.
- Phase 2 is now `defaultEnabled: true` for testers with no saved module preference; an explicit saved OFF preference remains authoritative.
- The obsolete `beta-channel-smoke` assignment is removed. The Beta host's existing manifest-removal contract deactivates/disposes a loaded removed module before deleting its runtime record.
- Public Stable source remains unchanged; Stable promotion remains separately gated.

## Latest Dev delivery context

Canonical Dev is preparing manifest r6 as the actual Public Beta assignment for Phase 2. HF.Status #112 remains the separate Beta/QA backend lane; Beta reporting continues to degrade safely until that backend/public reporting path is promoted.
