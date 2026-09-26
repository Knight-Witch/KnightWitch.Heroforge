# Active Context — issue #88 design branch

**Updated:** 2026-09-26 UTC  
**Branch:** `wd/88-diagnostic-capture-architecture`  
**Canonical Dev:** `WITCH_DEV_MAIN` v1.10.3 / immutable payload `a0fe5d89777877c90b2e5ffd7e17bb92f68d3abc`  
**Public Stable:** `Witch_Scripts` v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`  
**This branch:** issue #88 — general diagnostic capture architecture + provider contract

## Current route

Continue documentation/design for issue #88 only. The #58/#83 release is complete; do not preserve its former active-task routing here.

Current capture design sources:
- `docs/diagnostics/CAPTURE_ARCHITECTURE.md`;
- `docs/diagnostics/PROVIDER_CONTRACT.md`;
- `docs/diagnostics/PROVIDERS.md`.

Shared serialized/intake boundary is owned by HF.Status issue #15:
`Knight-Witch/HF.Status/docs/contracts/DIAGNOSTIC_REPORT_CONTRACT.md`.

Triage is designed around manifest-first/selective retrieval. Capture must preserve stable `captureId / providerId / sectionName` addressing, explicit coverage, deterministic summaries, bounded evidence, warning/error codes, useful hashes, and truthful capture limitations.

Issue #59 remains the eventual implementation owner for public-Stable Generic Bug Capture.

## Scope boundary

Documentation/design only on this branch unless the router is explicitly advanced to implementation.

Witch Dock owns capture/core/providers. HF.Status owns report identity, intake, private evidence storage, triage state, issue linkage, and the shared submission contract. Do not redesign HF.Status backend or GPT triage logic here.

High Res Diagnostic Capture v0.1.3 remains the reference provider and must not be rewritten merely to fit the abstraction.

Use #24, #32, and #34 as architecture pressure tests for reusable evidence surfaces, not as symptom-specific provider designs.

## Protected state

- No runtime/module/manifest/public behavior changes under #88 design.
- #34 remains a separate open product bug.
- HF.Status must never become a Witch Dock runtime dependency.
- HF-Chat-Bridge remains development infrastructure only.
