# Active Context — issue #88 design branch

**Updated:** 2026-09-26 UTC  
**Branch:** `wd/88-diagnostic-capture-architecture`  
**Canonical Dev:** `WITCH_DEV_MAIN` v1.10.3 / immutable payload `a0fe5d89777877c90b2e5ffd7e17bb92f68d3abc`  
**Public Stable:** `Witch_Scripts` v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`  
**This branch:** issue #88 — general diagnostic capture architecture + provider contract

## Current route

Continue documentation/design for issue #88 only.

Current design sources:
- `docs/diagnostics/CAPTURE_ARCHITECTURE.md` — overall ownership/architecture;
- `docs/diagnostics/GENERAL_CAPTURE_SPEC.md` — exact General Capture v1 design;
- `docs/diagnostics/PROVIDER_CONTRACT.md` — common provider rules;
- `docs/diagnostics/PROVIDERS.md` — provider inventory/order;
- `docs/diagnostics/providers/PROVIDER_TEMPLATE.md` — provider design template;
- `docs/diagnostics/providers/TEXTURE_QUALITY.md` — Texture Quality provider v1 design;
- `docs/diagnostics/providers/BOOTH.md` — Booth provider v1 design.

Shared serialized/intake boundary remains HF.Status issue #15:
`Knight-Witch/HF.Status/docs/contracts/DIAGNOSTIC_REPORT_CONTRACT.md`.

## Current design decisions

- General Capture uses a fast T0 freeze before passive enrichment; it must not wait away the broken state.
- Providers may expose optional synchronous `freeze()` state and bounded retained pre-cleanup failure records.
- Triage remains manifest-first/selective: stable `captureId / owner-or-provider / sectionName` addressing, deterministic summaries/hashes, explicit coverage, and truthful limitations.
- Texture Quality is the reference provider and has a concrete v1 section design pressure-tested against #24/#32/#34.
- Booth v1 is designed around separate state/bootstrap/settings/presentation/components/media boundaries; snapshot must not activate Booth or invoke settings save/apply.
- #32's missing AAID facts are promoted as reusable Texture Quality resource invariants; #34 motivates retained pre-cleanup verifier inputs.
- No runtime implementation under #88.

## Next design work

Design Decals using the provider template, grounded in current slot bridge / corrected bound gizmo / expanded-slot ownership and real decal regressions. Continue by real diagnostic value rather than mechanically designing every tab.

Issue #59 remains the eventual implementation owner for public-Stable Generic Bug Capture.

## Protected state

- No runtime/module/manifest/public behavior changes under #88 design.
- #34 remains a separate open product bug.
- HF.Status owns intake/storage/triage/backend; do not redesign it here.
- HF.Status must never become a Witch Dock runtime dependency.
- HF-Chat-Bridge remains development infrastructure only.
