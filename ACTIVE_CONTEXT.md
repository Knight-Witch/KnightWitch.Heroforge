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
- `docs/diagnostics/providers/BOOTH.md` — Booth provider v1 design;
- `docs/diagnostics/providers/DECALS.md` — Decals provider v1 design;
- `docs/diagnostics/providers/BODY_EDITOR.md` — Body Editor provider v1 design;
- `docs/diagnostics/providers/POSE.md` — current Pose/Main-Extra-swap provider v1 design;
- `docs/diagnostics/providers/JSON.md` — JSON bulk-backup provider v1 design;
- `docs/diagnostics/providers/CORE_RUNTIME.md` — optional startup/module/network-failure provider v1 design;
- `docs/diagnostics/providers/RENDERING_PERFORMANCE.md` — bounded rendering/performance provider v1 design;
- `docs/diagnostics/providers/BONE_HUD.md` — Bone HUD detector/selection-seam provider v1 design.

Shared serialized/intake boundary remains HF.Status issue #15:
`Knight-Witch/HF.Status/docs/contracts/DIAGNOSTIC_REPORT_CONTRACT.md`.

## Current design decisions

- General Capture uses a fast T0 freeze before passive enrichment; it must not wait away the broken state.
- Providers may expose optional synchronous `freeze()` state and bounded retained pre-cleanup failure records.
- Triage remains manifest-first/selective: stable `captureId / owner-or-provider / sectionName` addressing, deterministic summaries/hashes, explicit coverage, and truthful limitations.
- Texture Quality is the reference provider and has a concrete v1 section design pressure-tested against #24/#32/#34.
- Booth v1 is designed around separate state/bootstrap/settings/presentation/components/media boundaries; snapshot must not activate Booth or invoke settings save/apply.
- Decals v1 traces UI selection -> ordered layer -> model mapping -> rendered material/projector and separately exposes bound-transform/gizmo/preservation state; snapshot must create no character mutation or undo history.
- Body Editor v1 limits evidence to its transform/hand/slider subsets plus undo/commit state; no full undo entry or character JSON.
- Pose v1 is intentionally scoped to the tool's current Main/Extra swap behavior and verifies pinned Main invariants rather than claiming generic bone-pose coverage.
- JSON v1 reports backup workflow mechanics only and explicitly redacts config IDs, character/folder names, raw save JSON, ZIP paths/content, and authenticated endpoint URLs.
- Core Runtime v1 is optional beyond General: ordinary snapshot deepens bootstrap/module/registry state; issue #7-style network/toast correlation uses an explicitly armed bounded failure watch, never permanent traffic logging.
- Rendering Performance v1 is snapshot + explicit short sample; it aggregates rAF timing/long tasks/memory/renderer/scene complexity without reloads, GC, renderer resets, or continuous profiling.
- Bone HUD v1 exists because #26 proves module/UI health and detector functional health are different boundaries; the provider reports detector strategy/candidates/source state without cementing the legacy scene-index approach.
- #32's missing AAID facts are promoted as reusable Texture Quality resource invariants; #34 motivates retained pre-cleanup verifier inputs.
- No runtime implementation under #88.

## Next design work

Finish the issue #88 coverage/duplication/privacy pass across General + all provider specs. Verify ownership boundaries and implementation seams, define design-freeze/implementation-handoff criteria, then checkpoint #88 for review.

Issue #59 remains the eventual implementation owner for public-Stable Generic Bug Capture.

## Protected state

- No runtime/module/manifest/public behavior changes under #88 design.
- #34 remains a separate open product bug.
- HF.Status owns intake/storage/triage/backend; do not redesign it here.
- HF.Status must never become a Witch Dock runtime dependency.
- HF-Chat-Bridge remains development infrastructure only.
