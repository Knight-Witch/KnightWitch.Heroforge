# Changelog

## DOCK-2026-09-05-020 — True 4K/8K Photo Booth Public Promotion

Date: 2026-09-05

### Added

- Added public feature `media.screenshot-resolution` at `features/media/Photo_Booth_True_Resolution.js`.
- Added a `High Resolution Capture` section to the Witch Dock Booth tab with direct TRUE 4K and TRUE 8K capture buttons plus an enable/disable control.
- Added `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` to keep the direct Witch Dock buttons synchronized when Photo Booth becomes ready after the provider was installed earlier in page lifetime.
- Added `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md` as the public durable feature record.

### Runtime behavior

- Existing Lob/ADP 4096 and 8192 choices in HeroForge's own Photo Booth UI are left visually untouched.
- Witch Dock intercepts only square 4096 and 8192 `BT.maker.takeScreenshot` requests and routes them through the validated true-resolution provider.
- TRUE 4K uses one genuine 4096 Effects source through HeroForge's native Booth compositor.
- TRUE 8K uses four shifted 4096 Effects sources covering the complete native 8x8/64-phase lattice; no 8192 WebGL Effects target is allocated.
- Normal lower-resolution/native captures pass through unchanged.
- The temporary `CK.Effects.renderToCanvas` wrapper is restored after each repaired capture.
- If HeroForge later supplies an already-native full-resolution Effects path, the provider passes it through rather than rebuilding it.

### Dev validation / bug fix

- Amanda tested WITCH_DEV_PHOTO with current Lob/ADP present and reported the existing HeroForge UI 4K and 8K captures worked perfectly.
- Witch Dock direct TRUE 4K/8K buttons also worked after cycling the repair toggle.
- The initial disabled-button caveat was traced to stale UI readiness: provider ownership was already healthy, so the reconcile loop returned without re-running the private UI readiness update when Photo Booth later opened.
- Public promotion keeps the validated capture provider unchanged and adds a narrow readiness adapter that updates only `.kwPBResBtn.disabled` from current provider/Photo Booth/capability state.

### Delivery

- Updated `manifest.json` to load the capture provider and readiness adapter by default.
- `Witch_Dock.user.js` remains v1.0.8; existing public installs receive the feature on HeroForge refresh through the manifest.
- Lob's script is not modified and remains compatible as a temporary native-HeroForge-UI provider for the 4096/8192 choices.
- Lob-absent HeroForge-native resolution-menu injection is not part of this promotion; Witch Dock's direct buttons provide the same capture service without Lob.

### Test status

- Standalone combined v0.6 TRUE 4K: passed.
- Standalone combined v0.6 grouped TRUE 8K: passed perfectly and reported easy on GPU.
- WITCH_DEV_PHOTO provider through Lob-injected HeroForge 4096: passed perfectly.
- WITCH_DEV_PHOTO provider through Lob-injected HeroForge 8192: passed perfectly.
- Witch Dock direct buttons after provider re-enable: passed.
- Public readiness adapter JavaScript syntax: passed.
- Public manifest JSON parse: passed.
- Public smoke test after promotion: pending clean refresh with temporary Dev/standalone test scripts disabled.

### Touched files

- `features/media/Photo_Booth_True_Resolution.js`
- `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js`
- `manifest.json`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `README.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Rollback notes

Revert this promotion commit to remove public true-resolution capture delivery. `Witch_Dock.user.js` is unchanged, and unmodified HeroForge/Lob capture remains the fallback once the provider module is no longer loaded.

---

Historical changelog records through DOCK-2026-09-05-019 remain preserved in Git history at and before public commit `1712b0ba24c8303d8d446d88cdf66199978045e7`.
