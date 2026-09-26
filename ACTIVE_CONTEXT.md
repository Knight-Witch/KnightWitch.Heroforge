# Active Context — issue #88 design branch

**Branch:** `wd/88-diagnostic-capture-architecture`  
**Canonical Dev remains:** `WITCH_DEV_MAIN`  
**Canonical Dev active runtime task remains:** issue #83 — reusable notification/update-alert system  
**This branch:** issue #88 — general diagnostic capture architecture + provider contract

## Scope

Documentation/design only. Do not change runtime/module/manifest/public behavior on this branch.

Deliverables:
- `docs/diagnostics/CAPTURE_ARCHITECTURE.md`;
- `docs/diagnostics/PROVIDER_CONTRACT.md`;
- `docs/diagnostics/PROVIDERS.md`.

Shared serialized/intake boundary is owned by HF.Status issue #15 at:
`Knight-Witch/HF.Status/docs/contracts/DIAGNOSTIC_REPORT_CONTRACT.md`.

Issue #59 remains the eventual implementation owner for public-Stable Generic Bug Capture.

## Protected state

Do not interfere with #83 release work. High Res Diagnostic Capture v0.1.3 remains the reference provider and must not be rewritten during design.
