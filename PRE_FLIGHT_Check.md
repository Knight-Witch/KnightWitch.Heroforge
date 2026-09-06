# Pre-Flight Check Log

## PFC-2026-09-06-028 — Spinny Dev download/UX hardening

Date: 2026-09-06

### Reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`, architecture, feature inventory, Spinny feature spec, maintained v0.5.0 source/status;
- current Witch Dock Dev `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, manifest registry;
- `Witch_Dock_DEV.user.js` host/grant boundary;
- `Spinny_Mini_WebP.js` final mux/download boundary and guard dispatcher;
- `Spinny_Mini_WebP_UI.js` select/popout/status presentation;
- user live smoke results from the integrated Dev build.

### Confirmed diagnosis

The Spinny service's capture/mux code reached its completion path, but Witch Dock reused the standalone page-anchor save routine. The standalone source uses the same routine successfully, so the failure is isolated to the final download initiation boundary in the Witch Dock userscript-hosted integration rather than the validated render/mux engine. The Dev loader now owns a privileged Tampermonkey download adapter with explicit completion/error callbacks.

### Target files

- `Witch_Dock_DEV.user.js`
- `features/media/Spinny_Mini_WebP.js`
- `features/media/Spinny_Mini_WebP_UI.js`
- `manifest.json`
- `MASTER.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Conflict risks

- Do not alter frame production, TRUE-3K phase-feed math, RIFF mux/parser, timing, rotation restoration, or High Res still-provider ownership.
- Download completion must not be reported until the host API confirms it.
- Wheel must remain blocked before HeroForge receives it even though its warning modal is removed.
- Other guarded actions must retain the existing confirmation behavior.
- Public Stable must remain untouched.

### Decision

Apply a Dev-only privileged download host plus surgical service/UI corrections. Bump all affected active-module versions in the same commit and require live re-smoke before Stable promotion.

**Runtime behavior changed:** yes, Dev branch only.

---

# Pre-Flight Check Log

## PFC-2026-09-06-027 - Isolated Dev installer for Spinny smoke

Date: 2026-09-06

Reviewed current Dev integration, public core loader, manifest URL ownership, module-version contract, and Stable/Dev separation.

Risk: the public-named userscript loads Stable manifest/update URLs. Decision: create a distinct Dev userscript with WITCH_DEV_UI manifest/update/download URLs. No public core edit.

---

# Pre-Flight Check Log

## PFC-2026-09-06-026 — Witch Dock Dev Spinny integration

Date: 2026-09-06

### Reviewed

- current `WITCH_DEV_UI` head and manifest/module registry;
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`;
- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`;
- Developer Mode v0.2.0;
- compact High Res Image Capture UI and 0.7.0 provider service;
- exact validated HFC Spinny v0.5.0 source and standalone live validation results.

The Witch Dock repository has no separate `ARCHITECTURE.md` / `FEATURE_INVENTORY.md` at this Dev head; `MASTER.md`, module registry, module-version contract and durable HISTORY records are the active repo architecture/inventory sources.

### Target files

- `features/media/Spinny_Mini_WebP.js` (new)
- `features/media/Spinny_Mini_WebP_UI.js` (new)
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`

### Material risks checked

- do not replace/displace High Res still provider ownership of `BT.maker.takeScreenshot`;
- preserve TRUE-3K phase-feed capture logic and validated timing/state sequencing;
- one service shared by dock and popout; no duplicate capture engine;
- popout drag must remain inside Spinny-owned guard surface;
- Developer Mode controls Short Test visibility only;
- 4K Spinny remains deferred;
- public Stable remains untouched.

### Decision

Proceed with Dev-only service/UI integration and require live user smoke before promotion.

---

# Pre-Flight Check Log

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-09-06-025 — Preserve Witch Dock UI / Spinny follow-up queue

Date: 2026-09-06

### Target files

- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md` (new)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- current `WITCH_DEV_UI` head `85fe0037cd0ba45644751c19420ea1ef58a6b283`;
- current Developer Mode v0.2/module-version registry state;
- current compact High Res Image Capture Dev UI state;
- current Dev manifest tab ordering;
- current High Res service/UI migration caveat;
- current standalone Spinny/WebP decisions, including 3072 as the high-resolution target and 4096 deferral;
- user reports that the standalone compact High Res UI looked correct, Developer Mode worked, canonical build/version rows were visible, and the About `Module Versions` list was visible;
- user report that the 3072px Spinny run has finished, with detailed result intake still pending.

### Confirmed findings

- The side-project discussion produced several accepted UX/architecture decisions that must remain visible after work returns to Spinny.
- Standalone visual smoke for compact High Res UI and Developer Mode/version display is complete.
- Direct 4K/8K regression through the new compact UI, provider disable/re-enable recovery, and integrated `WITCH_DEV_UI` manifest loading have not been explicitly validated and must not be marked passed.
- The Dev manifest contains the intended `Booth -> Decals -> JSON` default registration order, but integrated tab-order smoke remains pending.
- High Res same-ID UI replacement remains a temporary Dev migration technique; explicit service/UI ownership cleanup is still required before Stable promotion.
- Spinny popout, Pause/Resume, and capture-invalidating interaction guards remain unimplemented.
- 4096px animated WebP remains explicitly deferred because of the confirmed 4096 still-provider collision; 3072px is the current high-resolution Spinny ceiling.
- No HF-Chat-Bridge access is required to preserve this queue.

### Recommended action

Record a dedicated durable follow-up document covering the remaining Witch Dock integration, popout, Pause/guard, tab-order, and promotion tasks. Update high-level tracking so the completed 3K execution and Developer Mode/version-display smoke are no longer described as pending. Then return immediately to intake of the completed 3072px Spinny result.

**Runtime behavior changed:** no. Documentation-only checkpoint; no module version bumps required.

---

## PFC-2026-09-06-024 — Canonical Witch Dock module version registry

Date: 2026-09-06

- Added canonical `manifest.json.moduleRegistry` coverage for all active runtime modules.
- Established `MODULE_VERSIONING.md` as the binding version-bump policy.
- Advanced Developer Mode to v0.2.0 with canonical version display and About module inventory.
- Local syntax/manifest/registry checks passed; public Stable remained unchanged.

**Runtime behavior changed:** Developer Mode Dev diagnostics only. Existing Stable Witch Dock modules and HeroForge behavior unchanged.

---

## PFC-2026-09-05-023 — Modular Witch Dock Developer Mode

Date: 2026-09-05

- Added Developer Mode as a separate hidden module with About toggle and reversible `WitchDock.registerTool` metadata wrapper.
- Updated High Res Image Capture UI to expose provider recovery/build diagnostics only in Developer Mode.
- Local syntax checks passed; public Stable remained unchanged.

**Runtime behavior changed:** Dev-only diagnostics/presentation.

---

## PFC-2026-09-05-022 — High Res Image Capture UI cleanup and default Decals tab order

Date: 2026-09-05

- Kept Stable 4K/8K capture engine untouched.
- Added compact High Res UI target and hid provider implementation controls from normal users.
- Moved Decals before JSON in Dev registration order.

**Runtime behavior changed:** Dev-only presentation/default order.

---

## PFC-2026-09-05-021 — Record public Photo Booth smoke acceptance

Date: 2026-09-05

- Public HeroForge/Lob 4096/8192 and direct Witch Dock TRUE 4K/8K passed.
- Readiness adapter passed without repair-toggle cycling.

**Runtime behavior changed:** no.

---

Historical pre-flight records through PFC-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.
