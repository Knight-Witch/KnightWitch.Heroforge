# Pre-Flight Check Log

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-09-05-020 — True 4K/8K Photo Booth Public Promotion

Date: 2026-09-05

### Target files

- `features/media/Photo_Booth_True_Resolution.js`
- `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js`
- `manifest.json`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `README.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- `Knight-Witch/HeroForge.Compatibility/PROJECT_CONTRACT.md`
- Compatibility `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`
- Compatibility Photo Booth feature spec and INV-0003
- validated standalone `media.screenshot-resolution` v0.6 baseline on `heroforge07.1.9.98`
- current public Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `README.md`, `manifest.json`, `Witch_Dock.user.js`, and `tools/Booth.js`
- WITCH_DEV_PHOTO provider build `0.7.0-witch-dock-dev-provider`
- Amanda's live WITCH_DEV_PHOTO integration test with current Lob/ADP present

### Confirmed findings

- The Dev provider successfully intercepted Lob's existing HeroForge Photo Booth 4096 and 8192 UI requests without modifying Lob's script.
- Amanda reported both native-HeroForge-UI captures worked perfectly through the Witch Dock provider.
- Witch Dock's direct TRUE 4K and TRUE 8K buttons also worked, but initially remained disabled until the repair toggle was cycled off/on.
- Source review identified the direct-button issue: the provider can install before Photo Booth opens; once installed, `reconcileProvider()` returns early while ownership is healthy and does not refresh the button readiness state when `BT.maker.enabled` later becomes true.
- The capture engine itself did not require changes. The public promotion therefore preserves the exact Dev-tested provider and adds a separate UI-readiness adapter that synchronizes only the direct button disabled state.
- Public `tools/Booth.js` is build `v24` and does not need modification for this feature.

### Material conflict risks

- Do not reintroduce one-shot 8192 Effects rendering. Maintained 8K remains four shifted 4096 Effects sources.
- Intercept only square 4096 and 8192 `BT.maker.takeScreenshot` requests; all other captures must pass through untouched.
- Preserve upstream-provider ownership and fail/degrade rather than stacking a second wrapper if another script replaces `BT.maker.takeScreenshot` after installation.
- Do not modify Lob/ADP. Its current 4096/8192 HeroForge UI injection remains a compatible temporary UI provider.
- The public module does not yet inject 4096/8192 into HeroForge's native UI when Lob is absent. Lob-absent users can use Witch Dock's direct TRUE 4K/TRUE 8K buttons; native-UI injection remains a separate future adapter.
- Do not modify Persistent Booth timing, `tools/Booth.js`, Witch Dock shell behavior, bound decal features, or unrelated manifest modules.
- Amanda must disable the temporary standalone v0.6 and WITCH_DEV_PHOTO loader for a clean public smoke test after promotion.

### Recommended action

Promote the exact Dev-tested capture provider into `Witch_Scripts`, add the small public readiness adapter, and add both to the public manifest with the capture feature enabled by default. Keep `Witch_Dock.user.js` at v1.0.8 because this is manifest/module delivery. Record the accepted architecture and rollback boundary in durable docs.

---

Historical pre-flight records through PFC-2026-09-05-019 remain preserved in Git history at and before public commit `1712b0ba24c8303d8d446d88cdf66199978045e7`.
