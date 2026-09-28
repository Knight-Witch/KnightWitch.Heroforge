# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-27 UTC
**Canonical Dev:** `WITCH_DEV_MAIN` v1.15.1 candidate / immutable payload `132e0c47ecc89fd4bb2c8c9913eff78d656b325a`
**Public Stable:** `Witch_Scripts` v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`
**Active engineering tracks:** #59 — Generic Bug Capture provider rollout; #90 — HF.Status public status panel + cached non-blocking client
**Open unrelated product bug:** #34 — HR false restore warning / native body mask verification

## Confirmed #59 runtime baseline

### General Capture v1 — PASS

- Diagnostics Core v0.1.0 / `0.1.0-general-capture-v1`.
- Bug Capture UI v0.2.0 / `0.2.0-provider-selection`.
- General-only capture is observational, locally downloadable, and has 8 addressable SHA-256 sections.
- Provider failures are isolated; no automatic upload or HF.Status runtime dependency.

### Texture Quality provider v1 — PASS

- Provider `texture-quality` schema v1 / v0.1.0.
- Generic snapshot produced 10 provider sections with healthy High Res verification.
- Native Reconcile lifecycle state was invariant across capture.
- Existing High Res Diagnostics v0.1.3 / Native Reconcile lifecycle behavior remains unchanged.
- Retained pre-cleanup #34-style failure context is explicitly unavailable rather than fabricated.

### Booth provider v1 — PASS (Booth OFF/native runtime unloaded)

- Dev v1.13.0 / `1.13.0-booth-diagnostic-provider`, payload `1dd0d6b12eca3fa1fe00f4b9011ae3143a368999`.
- Loader 31/31, failed=0, immutable=31, fallback=0.
- Diagnostics Core providerCount=2: `booth` + `texture-quality`.
- Booth v27.2.0 read-only diagnostic seam, Bootstrap v0.2.2 read-only state, and TRUE-resolution Readiness v1.1.0 loaded successfully.
- Bug Capture UI visibly exposes Booth and High Res / Texture Quality provider choices.
- Booth-only generic capture produced 17 total sections: 8 General + 9 Booth; errorCount=0.
- Booth sections:
  - state: captured;
  - bootstrap: captured;
  - native-runtime: captured;
  - settings: unavailable because Booth runtime was not loaded (`compose-display-state-unavailable`);
  - presentation/components/media: captured-bounded;
  - failure-context: partial with explicit retained-history limitation;
  - events: not-captured with explicit normalization limitation.
- Snapshot did **not** activate or bootstrap Booth: before/after `sessionBoothView=false`, `runtimeReady=false`, bootstrap attempts=0, bootstrapCount=0, directSessionRequests=0, and global `BT` remained absent.
- TRUE-resolution readiness stayed unchanged and no media capture ran.

## Parallel #90 integration state

- HF.Status public API v1 is live-validated on HF.Status Dev.
- Public Status Client v0.1.0 / `0.1.0-etag-cache` and Public Status UI v0.1.0 / `0.1.0-compact-status-panel` are merged to canonical Dev via PR #91 / `ef931517b0d4e26dc7540713bfc29ee6bca2ed67`.
- Dev launcher v1.14.0 pins immutable payload `d338d7ace39245ce7a845d237bf7273a80bf2fc7` and exposes only the exact Dev public-status endpoint through a bounded anonymous transport.
- Static/mock gates passed: syntax, unique/load-ordered manifest entries, synchronous cache restore, ETag 304 validation, offline preservation of last-known data, 200 replacement/cache write, native Utilities registration, and no HFBR reporter-token/private triage behavior.
- Public Stable is untouched.
- Remaining #90 gate: reload canonical Dev, verify loader/network/cache behavior, then Amanda visual/interaction review of Utilities -> Script Status.

## Current route

Continue #59 provider rollout from the issue #88 architecture while #90 waits on its live Dev/human gate.

**Priority changed by new real community failures:** pause Decals rollout at its existing isolated branch checkpoint and implement capture coverage for Booth JSON, general/ReCK JSON, and external kitbash/extra-slot compatibility first.

Immediate implementation order:
1. **Staged on `wd/59-json-script-compat-capture`:** Booth settings-I/O retention, JSON/ReCK provider, and `script-compat` provider as one v1.15.0 diagnostic bundle.
2. Exact-source syntax/privacy/load-order + execution-mock gates PASS.
3. Dev v1.15.1 repins payload `132e0c47ecc89fd4bb2c8c9913eff78d656b325a` with JSON Tool v1.1.1; rerun live loader + JSON/script-compat gates.
4. Resume the already-staged Decals provider branch after these live gates.

Design amendment: `wd/88-diagnostic-capture-architecture` @ `7571d67590e75df58a0181c1e23c8f56a263fa16`.

The new community cases do not yet have formal product-bug issue IDs. Do not invent symptom-specific fixes under #59; capture the reusable evidence boundary first.

Keep HF.Status backend/storage/triage ownership separate.

## Protected behavior

- General remains usable with zero providers.
- Feature providers remain opt-in.
- Provider failure cannot block General export.
- Heavy/armed operations remain explicit.
- Booth snapshot must remain observational; settings diagnostics may observe/retain real user save/load attempts but must never retry them.
- Texture Quality/High Res lifecycle remains untouched.
- Public Stable remains untouched.
- #90 HF.Status public client remains optional and must never block Dock startup/core behavior.
- ReCK/general JSON diagnostics never capture editor text/raw character JSON.
- `script-compat` never enumerates Tampermonkey/extensions or mutates external-script/HeroForge limits.
- #34 remains separate.

## Design source

Issue #88 / `wd/88-diagnostic-capture-architecture`, especially `docs/diagnostics/providers/DECALS.md`.
