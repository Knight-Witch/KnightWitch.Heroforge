# Changelog

## DOCK-2026-09-05-022 — High Res Image Capture UI cleanup and Decals tab order Dev candidate

Date: 2026-09-05

### Summary

Added a Dev-only presentation adapter for the already-validated `media.screenshot-resolution` service and changed the Dev manifest default tab registration order so `Decals` sits between `Booth` and `JSON`. The Stable 4K/8K capture engine and readiness adapter are unchanged.

### Added

- `features/media/Photo_Booth_True_Resolution_UI.js` build `0.1.0-dev-compact-ui`.
- The adapter is both a standalone Tampermonkey test and a future manifest-loadable module.
- It re-registers the existing `photo-booth-true-resolution` Witch Dock tool ID as a presentation-only host while calling the existing `KWPhotoBoothTrueResolution` service API.

### Dev UI changes

Normal user presentation now targets:

- tool/section title `High Res Image Capture`;
- compact `Capture: [4K] [8K]` row;
- visible violet hover highlight on enabled capture buttons;
- idle status `Active — click 4K or 8K to begin image capture`;
- no ordinary-user repair-provider checkbox;
- no ordinary-user provider implementation line;
- no ordinary-user Lob/provider explanatory blurb.

The adapter reuses the public `.kwPBResBtn` readiness path and does not duplicate 4K/8K renderer capability logic.

### Kill-switch direction

The existing service-level `enable()` / `disable()` behavior remains intact. The provider checkbox is being removed from normal presentation because it is a troubleshooting kill switch, not an everyday capture control. User-approved direction is to expose it later only through Witch Dock-wide Developer Mode.

### Default tab order

- Moved `decals-dev` in the Dev manifest so first-load registration order becomes `... Booth → Decals → JSON → Utilities`.
- This does not alter the Decals tool itself or any capture/runtime code.

### Preserved behavior

- `features/media/Photo_Booth_True_Resolution.js` is unchanged.
- `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` is unchanged.
- TRUE 4K remains one 4096 Effects source.
- TRUE 8K remains four shifted 4096 Effects sources with no 8192 Effects target.
- Existing provider ownership/restoration, failure isolation, direct capture functions, and Lob coexistence remain unchanged.
- Public `Witch_Scripts` is untouched.
- Spinny/WebP runtime and the active 3K validation capture are untouched.

### Known Dev-only migration caveat

The presentation adapter replaces the visible tool container by registering the same tool ID. The Stable service still retains references to its now-detached legacy UI nodes until reload. Before public promotion, the final integration should make UI ownership explicit rather than shipping this as a permanent duplicate-host arrangement.

### Touched files

- `features/media/Photo_Booth_True_Resolution_UI.js` (new)
- `manifest.json`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Test status

- Source/architecture review: complete.
- Standalone UI adapter live test: pending until the active 3K Spinny capture completes.
- Direct 4K/8K regression through the new UI: pending.
- Default Decals tab-order smoke: pending future Dev-manifest loading.

**Runtime behavior changed:** Dev-only presentation/default order. Public Stable behavior did not change.

---

## DOCK-2026-09-05-021 — Public Photo Booth Smoke Acceptance

Date: 2026-09-05

### Summary

Documentation-only checkpoint recording final public acceptance of `media.screenshot-resolution` after the Stable promotion.

### Confirmed public result

- Temporary standalone v0.6 and WITCH_DEV_PHOTO test scripts were disabled for the clean public test.
- Public readiness adapter worked without requiring the repair toggle to be cycled.
- Existing Lob-injected HeroForge 4096 capture routed through public Witch Dock and passed perfectly.
- Existing Lob-injected HeroForge 8192 capture routed through public Witch Dock and passed perfectly.
- Public Witch Dock direct TRUE 4K capture passed perfectly.
- Public Witch Dock direct TRUE 8K capture passed perfectly.
- Amanda reported the public integration works perfectly.

### Status

- `media.screenshot-resolution`: **Witch Dock Stable validated**.
- TRUE 4K maintained architecture: one 4096 Effects source.
- TRUE 8K maintained architecture: four shifted 4096 Effects sources; no 8192 WebGL Effects target.
- Lob/ADP remains unchanged and compatible as the current HeroForge-UI source for 4096/8192 choices.
- Lob-absent HeroForge-native resolution-menu injection remains future work and does not block Stable status.

### Runtime impact

**No runtime behavior changed.** No JavaScript, manifest, userscript shell, or capture behavior changed in this checkpoint.

### Touched files

- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

---

Historical changelog records through DOCK-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.
