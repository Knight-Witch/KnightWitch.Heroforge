# Active Context — issue #88 design branch

**Updated:** 2026-09-28 UTC  
**Branch:** `wd/88-diagnostic-capture-architecture`  
**Canonical Dev:** `WITCH_DEV_MAIN` @ `a16e547f4eb9dc04dd804fc453c131f054bccae7` · v1.10.3 / immutable payload `a0fe5d89777877c90b2e5ffd7e17bb92f68d3abc`  
**Public Stable:** `Witch_Scripts` v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`  
**This branch:** issue #88 — general diagnostic capture architecture + provider contract — **v1 design baseline complete / cross-repo review open**

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
- `docs/diagnostics/providers/BONE_HUD.md` — Bone HUD detector/selection-seam provider v1 design;
- `docs/diagnostics/providers/SCRIPT_COMPAT.md` — allowlisted external HeroForge script compatibility provider v1 design.

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
- JSON v1 covers both bulk-backup mechanics and general/ReCK character-JSON workflow capability/operation evidence while explicitly excluding editor/file contents and raw save JSON.
- Core Runtime v1 is optional beyond General: ordinary snapshot deepens bootstrap/module/registry state; issue #7-style network/toast correlation uses an explicitly armed bounded failure watch, never permanent traffic logging.
- Rendering Performance v1 is snapshot + explicit short sample; it aggregates rAF timing/long tasks/memory/renderer/scene complexity without reloads, GC, renderer resets, or continuous profiling.
- Bone HUD v1 exists because #26 proves module/UI health and detector functional health are different boundaries; the provider reports detector strategy/candidates/source state without cementing the legacy scene-index approach.
- Script Compatibility v1 was added from new real reports involving post-update high-kitbash/extra-slot behavior. It fingerprints allowlisted HeroForge effects from external scripts without making them Witch Dock dependencies.
- Booth settings JSON operation evidence is now an immediate #59 requirement: retained save/load result, format classification, capability state, before/after settings shape/hash, and sanitized failure code.
- #32's missing AAID facts are promoted as reusable Texture Quality resource invariants; #34 motivates retained pre-cleanup verifier inputs.
- No runtime implementation under #88.

## Design status

v1 design baseline remains complete, with a 2026-09-28 additive amendment for newly reported JSON/external-script compatibility failures.

Coverage/duplication/privacy audit result:
- General is the always-present compact baseline.
- `core-runtime` owns deep startup/module/network-failure evidence instead of duplicating it in General.
- `rendering-performance` owns frame/long-task/memory/renderer sampling; tool providers expose only operational busy state.
- tool providers own only their feature-specific evidence.
- Bone HUD was added because #26 exposed a real uncovered functional boundary.
- `script-compat` was added because newly reported kitbash/extra-slot failures occur in external userscripts and cannot be represented truthfully by Witch Dock module health alone.
- Notifications, Developer Mode, UI plumbing, Utilities, and separate media modules do not get redundant v1 providers.

No shared HF.Status contract change is currently required.

## Next step

Issue #59 owns implementation. Prioritize the newly reported capture gaps before lower-value provider completion:
1. Booth retained settings JSON save/load evidence;
2. JSON provider support for ReCK/general character JSON workflow evidence;
3. `script-compat` provider for high-kitbash + extra-slot runtime effect health;
4. resume remaining provider rollout.

Do not begin runtime implementation on #88.

Issue #59 remains the eventual implementation owner for public-Stable Generic Bug Capture.

## Branch hygiene

This branch is a **documentation source branch, not a runtime merge source**. Only diagnostic design docs/router/log records are intentional #88 delta; runtime implementation is taken from current `WITCH_DEV_MAIN` under #59.

## Protected state

- No runtime/module/manifest/public behavior changes under #88 design.
- #34 remains a separate open product bug.
- HF.Status owns intake/storage/triage/backend; do not redesign it here.
- HF.Status must never become a Witch Dock runtime dependency.
- HF-Chat-Bridge remains development infrastructure only.
