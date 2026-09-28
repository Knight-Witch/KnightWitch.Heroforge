# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-27 UTC
**Canonical Dev:** `WITCH_DEV_MAIN` v1.12.0 / immutable payload `504f5267a83a528ecbc4a6b2d797736575a74b02`
**Public Stable:** `Witch_Scripts` v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`
**Active issue:** #59 — Generic Bug Capture utility + HF.Status reproduction handoff
**Open unrelated product bug:** #34 — HR false restore warning / native body mask verification

## Confirmed #59 runtime baseline

### General Capture v1 — PASS

- Diagnostics Core v0.1.0 / `0.1.0-general-capture-v1`.
- Bug Capture UI v0.2.0 / `0.2.0-provider-selection` under Utilities.
- General-only capture is observational and locally downloadable.
- Eight General sections are independently addressable and SHA-256 hashed in the live browser.
- Bounded errors/events and truthful coverage are present.
- HeroForge `_needsUpdating` / `_inUpdate` remained unchanged during capture.
- No automatic upload or HF.Status runtime dependency.

### Texture Quality provider v1 — PASS

- Texture Quality Diagnostic Provider v0.1.0 / `0.1.0-legacy-diagnostic-adapter`.
- Provider registers as `texture-quality` schema v1.
- Dev loader: 30/30 executed, failed=0, immutable=30, fallback=0.
- Generic provider snapshot completed with 18 total sections: 8 General + 10 Texture Quality.
- Provider summary: figureCount=1, HR enabled=true, busy=false, persistent=true, warningCodes=[], `aaidFallback1x1Count=0`.
- Legacy High Res verification remained OK; body AAIDs were 1024×1024 and allocations remained 2048×2048.
- Native Reconcile state before/after was unchanged: enabled=true, busy=false, persistent=true, sessionSuppressed=false, status `ON — 8192×4096`, error=null.
- Retained pre-cleanup failure context is truthfully marked unavailable with reason `retained-pre-cleanup-failure-context-not-yet-implemented`.
- Existing `Texture_Quality_Diagnostics.js` v0.1.3 and Native Reconcile v0.4.1 lifecycle code were not modified.

## Current route

The Generic Bug Capture foundation and first provider are live-validated in Dev.

Next capture-side work should follow the v1 provider plan without blocking on HF.Status backend work:

1. keep the shared diagnostic envelope unchanged unless backend/triage identifies a real missing contract requirement;
2. implement the next highest-value provider through the same isolated adapter/provider boundary;
3. prefer **Booth** next because it exercises a distinct runtime/bootstrap/settings/presentation/media boundary and does not overlap Texture Quality;
4. keep provider capture opt-in and observational;
5. do not begin public Stable promotion until the report/intake workflow and provider rollout scope are explicitly ready.

HF.Status owns report identity, private evidence storage/indexing, triage state, and upload/API behavior. Witch Dock capture must not couple directly to those internals.

## Protected behavior

- General Capture remains always available with zero providers.
- Feature providers execute only when explicitly selected.
- Provider failure cannot block General export.
- Heavy/armed operations remain explicit: HR comparison, Core Runtime failure watch, Rendering Performance sample.
- Public Stable remains untouched.
- #34 remains separate; do not use #59 provider work to silently repair the restore-warning bug.

## Design source

Issue #88 / `wd/88-diagnostic-capture-architecture` remains the v1 capture/provider design baseline. HF.Status issue #15 owns the shared diagnostic-report contract.
