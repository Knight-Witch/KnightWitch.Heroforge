# Changelog

## Latest repository change — 2026-10-09

- **#111 Dev Decals v1.3.0 independent M/N calibration:** User screenshot verifies v1.2.7 persistent vivid-green overlay correctly targets two ID1178 decals but .94 shared UV scale makes spatial placement significantly worse/asymmetric. Correct migration not established. New experimental controls separately adjust M U/V and N U/V (bounded +/- .05 each); neutral default chart scale is 1.00. Preserves existing global offsets, native compatibility checks, active-only repaint reconciliation, manual Revert/no expiry and unmodified saved JSON.
- **Dev launcher v1.17.25 / 1.17.25-independent-mn-calibration** pins immutable payload **8dbf43e217b3f01f4fe27f03689cd4441bf82534** containing v1.3.0. Canonical context, focused handoff and Dev divergence updated.
- Static and targeted tests passed incl per-side center math/bounds, full native/GPU rollback, figure switching and unchanged saved data. **Live v1.3.0 human calibration gate pending**; Public Stable unchanged.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 experimental preview.
