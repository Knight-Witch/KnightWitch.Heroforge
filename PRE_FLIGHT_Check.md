# Pre-Flight Check

## 2026-10-07 — #25 native-shadow Phase 2 Beta manifest r5

- PASS: immutable source/package commit `150e420e069dd1eb3cfd9872e71fe52a6ce9f063` is integrated into canonical Dev.
- PASS: all-part v0.1.14 / `0.1.14-native-shadow-preflight`; Stable-compatible wrapper v0.1.2 / `0.1.2-native-shadow-preflight`.
- PASS: focused all-part/ownership/Beta suites pass 42/42, including native-shadow safe and genuine-collateral discriminator tests.
- PASS: manifest revision 5 pins the exact 40-character payload and remains `defaultEnabled: false`.
- LIVE GATE: one at-most-once r5 refresh/readback on Counting Sheep; prove activation, shield/fan selection or bounded downgrade, no unrelated allocation regression, rollback/settle, anti-loop, and re-enable for Amanda visual smoke.
- Public Stable remains unchanged; no Stable promotion is authorized.
