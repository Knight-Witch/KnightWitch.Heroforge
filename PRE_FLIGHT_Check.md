# Pre-Flight Check Log

## PFC-2026-09-06-035 — Booth cross-session defaults and Utilities categories

Date: 2026-09-06

### Required material reviewed

- binding HeroForge.Compatibility project contract, architecture and active feature inventory;
- current Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`;
- `tools/Booth.js` v24 persistence/Black Canvas state machine and storage keys;
- `tools/Utilities.js` v1.1.0 category host;
- `Witch_Dock_DEV.user.js` tab-selection implementation;
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` known timing/state constraints.

### Confirmed diagnosis

- `kw.witchDock.booth.consent.v1` already persists the Booth auto-arm preference across sessions, but v24 also uses that preference as a hard gate that disables the Booth View session switch;
- Black Canvas is already independent of Booth persistence but has no saved cross-session default;
- existing automatic Booth persistence correctly waits for a real Photo Booth visit before applying;
- Black Canvas can run from the editor without a Booth visit;
- Witch Dock tab selection is internally stable but was not exposed as a host API.

### Decision

Preserve the existing Booth state machine/timing. Reinterpret the existing consent key strictly as the saved automatic Booth default, allow Booth View/Black Canvas to remain session overrides, add one saved Black Canvas default, expose a narrow `WitchDock.activateTab(name)` API for internal links, and organize Utilities into `Booth Features`, `Decal Features`, and existing `HeroForge UI Patches` categories.

### Conflict risks

- do not rewrite tokenizer teardown/re-enable timing, lighting/effect restoration, backdrop capture, Black Canvas renderer enforcement, or silent-cycle timing;
- session toggles must never rewrite the saved Utilities defaults;
- disabling a saved default must not unexpectedly tear down a deliberate session override;
- saved Booth persistence must still wait for actual Booth entry before auto-applying;
- saved Black Canvas must initialize without Booth entry;
- preserve the existing `kw.witchDock.booth.consent.v1` key for migration compatibility;
- public Stable remains untouched until Dev live validation.

### Version decision

- `booth-tool`: v25.0.0 / build `v25`;
- `utilities`: v1.2.0;
- `witch-dock-dev-loader`: v0.5.0 / userscript `1.0.8.5`.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

## PFC-2026-09-06-034 — Move bound decal gizmo host to Utilities

Date: 2026-09-06

### Requested behavior

- move the existing corrected bound decal gizmo control surface out of the Decals tab and into Utilities;
- leave the Decals tab present as a placeholder reading `New decal tools coming shortly!`;
- preserve the validated corrected-gizmo runtime, persisted enabled state, mode controls, status diagnostics, and enable/disable behavior.

### Required material reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- HFC `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`;
- Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, and current Dev `manifest.json`;
- `tools/Decals.js`, `tools/Utilities.js`;
- `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` and its exported `enable`, `disable`, `setMode`, `refresh`, and `getState` service boundary;
- corrected gizmo delivery/history record.

### Confirmed findings

- the gizmo service owns its persisted preference at `kw.witchDock.decals.boundGizmo.enabled`;
- the Decals tool is only a presentation host for the corrected-gizmo service;
- moving that presentation does not require changing the validated gizmo runtime or its storage key;
- Utilities already hosts optional HeroForge UI controls and is the more coherent domain for this toggle/control block.

### Target files

- `tools/Decals.js`
- `tools/Utilities.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`

### Conflict risks

- do not modify `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` or its source fragments;
- do not duplicate the control in both Decals and Utilities;
- preserve the gizmo service-owned enabled state and Move/Rotate/Scale calls;
- keep the Decals tab registered so future decal tools have a stable host;
- Dev manifest must load the changed Dev copies of Decals and Utilities rather than the Stable copies during smoke testing.

### Version decision

- `decals-dev`: `1.0.0 -> 1.1.0` (meaningful presentation change / placeholder host);
- `utilities`: `1.0.0 -> 1.1.0` (adds the bound decal gizmo control surface).

### Decision

Proceed Dev-only and require a small live host smoke before Stable promotion.

**Runtime behavior changed:** yes, Dev presentation/host ownership only. Corrected gizmo runtime behavior is unchanged.

---

## PFC-2026-09-06-033 — Developer Mode public-readiness

Date: 2026-09-06

### Required material reviewed

- binding HeroForge.Compatibility project contract, architecture/inventory/compatibility/ownership/testing state;
- Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, current `manifest.json`;
- `features/core/Witch_Dock_Developer_Mode.js` v0.2.0 behavior;
- Dev loader manifest ownership;
- validated tab cleanup and High Res service/UI cleanup;
- Spinny Developer-Mode Short Test consumer and High Res Developer-Mode recovery consumer.

### Confirmed finding

Developer Mode already satisfies the accepted product shape (About-only, persistent, default OFF), but its module registry URL is hardcoded to `WITCH_DEV_UI`. Shipping that source unchanged would make public users inspect Dev registry versions instead of the manifest actually loaded by their Witch Dock.

### Decision

Make the active loader advertise its manifest URL and make Developer Mode resolve its registry from that host-owned URL, with Stable fallback. Preserve all existing normal-mode behavior and Developer-only consumer contracts. Require live Dev smoke before any Stable promotion.

### Conflict risks

- Developer Mode failure must remain diagnostic-only;
- default OFF and existing storage key must not change;
- normal users must not see per-tool rows, Module Versions, Short Test, or provider recovery controls;
- no dependence on HF-Chat-Bridge or unstable Compatibility runtime heads;
- module versions must bump with runtime changes.

**Runtime behavior changed:** yes, Dev diagnostics/manifest-source boundary only.

---

## PFC-2026-09-06-032 — Record High Res ownership cleanup live validation

Date: 2026-09-06

### Confirmed live results

- compact normal presentation with no duplicate legacy section: PASS;
- Developer Mode diagnostics: PASS;
- provider disable -> enable recovery: PASS;
- direct TRUE 4K / 4096x4096: PASS;
- direct TRUE 8K / 8192x8192: PASS;
- Spinny coexistence: PASS;
- tab cleanup remains correct: PASS.

The v0.8.0 service-only / v0.3.0 UI-only split is validated for Dev promotion consideration. No runtime files change in this checkpoint.

**Runtime behavior changed:** no.

---

## PFC-2026-09-06-031 — High Res service/UI ownership cleanup

Date: 2026-09-06

### Required material reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`;
- current true-resolution service, compact UI adapter, readiness adapter, Developer Mode integration, and validated public provider boundary.

### Confirmed diagnosis

The Dev capture service still owned the legacy full Booth UI and registered `photo-booth-true-resolution`, while the compact presentation adapter later re-registered the same tool ID. This was the documented temporary migration technique and is no longer acceptable for Stable promotion.

### Target files

- `features/media/Photo_Booth_True_Resolution.js`
- `features/media/Photo_Booth_True_Resolution_UI.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`

### Conflict risks

- preserve validated 4K/8K Effects-source/phase-feed/provider functions byte-for-byte;
- preserve `BT.maker.takeScreenshot` provider ownership and restore/reconcile sequencing;
- preserve readiness adapter and compact button selectors;
- preserve Developer Mode provider recovery controls;
- do not modify Spinny or public Stable in this stage.

### Decision

Make the capture module service-only and the compact UI adapter the sole Witch Dock presentation owner. Require direct 4K/8K and disable/enable live regression before Stable promotion.

**Runtime behavior changed:** yes, Dev ownership/lifecycle only.

---

## PFC-2026-09-06-030 — Record Dev tab cleanup live validation

Date: 2026-09-06

### Confirmed live results

- `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`: PASS.
- Utilities cog tooltip `Utilities`: PASS.
- Correct tool opens from every tab: PASS.
- Persisted active tab restores after refresh: PASS.

The Dev core ordering/presentation change is validated and may be considered for later narrow Stable promotion. No runtime files change in this checkpoint.

**Runtime behavior changed:** no.

---

## PFC-2026-09-06-029 — Dev tab order / Utilities icon cleanup

Date: 2026-09-06

### Reviewed

- binding HeroForge.Compatibility project contract and current Witch Dock Dev tracking;
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`;
- `Witch_Dock_DEV.user.js` tab construction/order code and tab CSS;
- `manifest.json` load order and module registry;
- Body Editor / Decals / Utilities registration behavior;
- active UI follow-up queue and the newly accepted public Developer Mode direction.

### Target behavior

- display tabs as `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`;
- preserve the existing `Body Editor` internal tab key/persisted preference while displaying `Body`;
- render Utilities as an SVG cog with tooltip/ARIA label `Utilities`;
- structurally pin Utilities last even if future tabs register after it;
- keep unknown future tabs ahead of Utilities;
- keep this change Dev-only until visual smoke.

### Conflict risks

- do not alter the tool modules themselves or their HeroForge behavior;
- do not invalidate persisted active-tab values;
- do not rely only on manifest timing for the final order;
- do not promote unrelated Developer Mode/High Res Dev work in this tab-only stage.

### Version decision

`witch-dock-dev-loader` advances to v0.3.0 / build `1.0.8.3-tab-order-icon`. No Body, Pose, Decals, Booth, JSON or Utilities module version changes are required because their runtime modules are untouched.

**Runtime behavior changed:** yes, Dev shell presentation/order only.

---

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
