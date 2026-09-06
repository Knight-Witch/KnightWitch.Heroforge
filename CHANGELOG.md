# Changelog

## DOCK-2026-09-06-024 — Canonical module version registry

Date: 2026-09-06

### Summary

Established a canonical numeric version for every active Witch Dock runtime module without editing Stable feature source solely for bookkeeping. Developer Mode advances to v0.2.0 and can display canonical versions for visible, hidden, core, and conditional modules.

### Added

- `manifest.json.moduleRegistry` as the canonical active-module version inventory.
- `MODULE_VERSIONING.md` as the binding module-version maintenance contract.
- Developer Mode `Module Versions` inventory inside the About developer section.
- provenance metadata distinguishing existing versions, normalized legacy tags, and 2026-09-06 tracking baselines.

### Initial canonical versions

- Witch Dock Core: `1.0.8`.
- Expanded UI Scroll Guards: `1.0.0` baseline; build `2026-07-03-layouts` preserved.
- HF UI Scroll Split Safe: `1.0.0` baseline.
- HF UI Slot Bridge: `1.0.0` baseline.
- Expanded Decal Slots: `1.0.0` baseline.
- Corrected Bound Decal Gizmo: `1.1.0`.
- Developer Mode: `0.2.0`.
- Body Editor: `4.0.0`, normalized from existing `v4` identity.
- Pose: `1.0.0` baseline.
- Booth: `24.0.0`, normalized from existing `v24` build.
- High Res Image Capture service: `0.7.0`.
- Photo Booth True Resolution Readiness: `1.0.0`.
- High Res Image Capture UI: `0.2.0`.
- Decals host: `1.0.0` baseline.
- JSON Tool: `1.0.0` baseline.
- Utilities: `1.0.0` baseline.

New `1.0.0` values are tracking baselines as of this date, not reconstructed historical release counts.

### Developer Mode update

`features/core/Witch_Dock_Developer_Mode.js` advances from `0.1.0-dev-registry-about-toggle` to `0.2.0-dev-module-version-registry`.

- reads canonical `manifest.json.moduleRegistry` metadata;
- combines canonical numeric versions with runtime-declared build tags;
- visible tools show canonical version plus build where useful;
- About exposes a Developer-only `Module Versions` list for hidden/conditional modules too;
- exposes module-registry snapshot/reload state through `KWDeveloperMode`;
- registry fetch failure remains diagnostic-only.

### Version maintenance rule

Going forward, any active module change affecting runtime behavior, UI, API, storage, compatibility, initialization/disposal, or HeroForge integration must bump that module's canonical version in the same commit. Source-local build/version identifiers must also be kept consistent when present.

### Preserved behavior

- No Stable tool/service/HeroForge UI module source changed for this bookkeeping pass.
- Public `Witch_Scripts` remains untouched.
- 4K/8K capture, Booth, Body Editor, Pose, Decals, JSON, Utilities, scroll/slot helpers, and corrected gizmo runtime behavior are unchanged.
- No HF-Chat-Bridge access or active Spinny interaction occurred.

### Test status

- Developer Mode v0.2.0 local `node --check`: PASS.
- Dev manifest JSON parse: PASS.
- Registry IDs unique: PASS.
- Registry covers every Dev manifest tool ID: PASS.
- Live v0.2.0 registry display: pending.

### Touched files

- `features/core/Witch_Dock_Developer_Mode.js`
- `manifest.json`
- `MODULE_VERSIONING.md` (new)
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

**Runtime behavior changed:** Developer Mode Dev diagnostics only. Existing Stable module behavior did not change.

---

## DOCK-2026-09-05-023 — Modular Developer Mode Dev candidate

Date: 2026-09-05

- Added standalone hidden Developer Mode module and About toggle.
- Added reversible tool metadata wrapper and shared diagnostics API.
- Updated High Res UI to consume Developer Mode for provider recovery/build diagnostics.
- Local syntax checks passed; user later confirmed standalone Developer Mode and compact High Res UI looked correct.

**Runtime behavior changed:** Dev-only diagnostics/presentation.

---

## DOCK-2026-09-05-022 — High Res Image Capture UI cleanup and Decals tab order Dev candidate

Date: 2026-09-05

- Added compact High Res Image Capture Dev UI.
- Hid provider kill switch/implementation notes from ordinary users.
- Moved Dev default Decals order before JSON.
- Stable capture engine/readiness and public branch remained unchanged.

**Runtime behavior changed:** Dev-only presentation/default order.

---

## DOCK-2026-09-05-021 — Public Photo Booth Smoke Acceptance

Date: 2026-09-05

- Public HeroForge/Lob 4096 and 8192 routes passed perfectly.
- Public Witch Dock direct TRUE 4K and TRUE 8K passed perfectly.
- Readiness adapter passed without repair-toggle cycling.
- `media.screenshot-resolution`: **Witch Dock Stable validated**.

**Runtime behavior changed:** no.

---

Historical changelog records through DOCK-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.
