# Changelog

## DOCK-2026-09-05-023 — Modular Developer Mode Dev candidate

Date: 2026-09-05

### Summary

Added Witch Dock Developer Mode as a standalone hidden module rather than editing the public core shell. Updated the compact High Res Image Capture Dev UI to consume that shared mode for its provider kill switch and build/provider diagnostics.

### Added

- `features/core/Witch_Dock_Developer_Mode.js`
- build `0.1.0-dev-registry-about-toggle`
- persistent default-off Developer Mode state via `kw.witchDock.developerMode.v1`
- `Developer Mode` checkbox injected into the existing Witch Dock `?` / About modal
- reversible `WitchDock.registerTool` wrapper that records declared tool metadata
- per-tool developer rows showing `DEV · <tool-id> · build <declared-build>` while Developer Mode is on
- explicit `build unreported` when a tool does not declare build/version metadata
- shared global `KWDeveloperMode` API with set/toggle/listener/registry/lifecycle methods
- dedicated architecture record `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`

### High Res Image Capture update

`features/media/Photo_Booth_True_Resolution_UI.js` advanced from `0.1.0-dev-compact-ui` to `0.2.0-dev-developer-mode`.

Normal mode remains deliberately minimal:

- `High Res Image Capture`
- `Capture: [4K] [8K]`
- violet hover highlight
- compact status line

Developer Mode additionally reveals:

- `Repair provider enabled` kill switch, backed by the existing service `enable()` / `disable()` methods;
- compact UI build;
- Stable capture-service build;
- readiness-adapter build;
- provider ownership/state;
- implementation note for HeroForge/Lob 4096/8192 routing.

### Manifest behavior

- Developer Mode is loaded as a hidden module before visible tools on `WITCH_DEV_UI` so subsequent tool registrations can be observed.
- Existing Dev default order keeps `Decals` before `JSON`.
- Public `Witch_Scripts` manifest is unchanged.

### Preserved behavior

- `Witch_Dock.user.js` is unchanged.
- `features/media/Photo_Booth_True_Resolution.js` is unchanged.
- `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` is unchanged.
- TRUE 4K/8K capture architecture and provider ownership behavior are unchanged.
- Developer Mode does not touch HeroForge `CK`, `BT`, Webpack, bundle code, character state, camera state, or Photo Booth renderer state.
- Developer Mode is not required for ordinary Witch Dock operation.
- Active Spinny/WebP 3072px validation was not queried or disturbed.

### Test status

Before commit:

- `Witch_Dock_Developer_Mode.js` local `node --check`: PASS.
- High Res UI v0.2.0 local `node --check`: PASS.
- live About-toggle / registry / provider-control smoke: pending after the active 3K Spinny capture completes.

### Known limitations / next gate

- Older tools that do not declare `build` or `version` accurately display `build unreported`; metadata should be added incrementally rather than inferred.
- No Developer Mode hotkey exists in this first candidate.
- High Res UI same-ID re-registration remains a Dev migration technique; explicit service/UI ownership cleanup is still required before Stable promotion.

### Touched files

- `features/core/Witch_Dock_Developer_Mode.js` (new)
- `features/media/Photo_Booth_True_Resolution_UI.js`
- `manifest.json`
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md` (new)
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

**Runtime behavior changed:** Dev-only diagnostics/presentation. Public Stable behavior did not change.

---

## DOCK-2026-09-05-022 — High Res Image Capture UI cleanup and Decals tab order Dev candidate

Date: 2026-09-05

### Summary

Added a presentation-only Dev adapter for the Stable `media.screenshot-resolution` service and changed the Dev manifest default registration order so `Decals` sits between `Booth` and `JSON`.

### Dev UI target

- `High Res Image Capture`
- `Capture: [4K] [8K]`
- visible violet hover highlight
- idle status `Active — click 4K or 8K to begin image capture`
- provider kill switch and implementation notes hidden from ordinary users

### Preserved behavior

- Stable capture engine/readiness adapter unchanged.
- TRUE 4K/8K implementation unchanged.
- Public `Witch_Scripts` untouched.
- Spinny/WebP runtime untouched.

### Known Dev caveat

Same-ID UI replacement leaves detached legacy UI references in the Stable capture service until reload; final Stable integration must make UI ownership explicit.

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
