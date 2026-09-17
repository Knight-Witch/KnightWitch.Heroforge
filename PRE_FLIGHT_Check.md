# Pre-Flight Check Log

Rolling current Dev pre-flight record. Older detail remains in Git history.

## PFC-2026-09-17-011 — Booth cold-start compatibility candidate

Date: 2026-09-17

### Scope

Issue #10 validation blocker on `wd/10-modular-bootstrap`: make an explicit Witch Dock Booth View session request able to cold-start HeroForge's native Booth runtime without bypassing HeroForge's own character-readiness/engine-ownership rules.

### Diagnosis

- Cold page baseline: Dock and all 23 normal modules can load while native `window.BT` remains absent.
- `tools/Booth.js` can already record `sessionBoothView=true`; the v0.1.1 runtime bootstrap only reacted to persisted/saved Booth state and therefore ignored that current-session request when persistence was off.
- Native `BT.setBoothMode()` source inspection confirmed HeroForge's intended lifecycle: if the character is not ready, it stores `_pendingMode` and subscribes `_resumePendingMode` to `CharacterFinishedChanging`; once ready it re-enters `setBoothMode()` and owns `maker.enable()` itself.
- A bounded direct `maker.enable()` probe while HeroForge still reported `character.isLoading()` reproduced `TypeError: Cannot convert undefined or null to object` inside `/gated/booth.js`; that bypass is rejected and is not present in the candidate.

### Candidate

- `features/booth/Booth_Runtime_Bootstrap.js`: v0.1.2 / build `0.1.2-session-cold-start`.
- `manifest.json.moduleRegistry`: synchronized to v0.1.2 with version origin `issue-10-validation-blocker-session-cold-start-2026-09-17`.
- Manifest module URL cache key: `?v=0.1.2-session-cold-start`.
- Candidate detects `KW_WD_BOOTH.getState().sessionBoothView`, derives the requested/saved Booth mode, loads the version-matched HeroForge `/gated/booth.js` only when native Booth is absent, then delegates activation to `BT.setBoothMode(mode)`.
- Existing persistence bootstrap, polling cadence, duplicate-script guard, HeroForge version derivation, script status semantics, and failure isolation are preserved.
- No direct `maker.enable()` call remains.
- Dev launcher remains v1.3.6; its installed userscript bytes did not change in this blocker repair.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

### Live evidence

- Ready-state probe with native Booth enabled reached `BT.currentMode=portrait`, `maker.enabled=true`, 4K and 8K enabled, WebP service `Ready`, WebP button enabled after UI refresh, and module loader 23/23 with 0 failures.
- Final clean-source reload loaded the v0.1.2 candidate and module loader successfully, but HeroForge remained in its own `character.isLoading() === true`, missing-display-data state for the observation window, so the final clean-path Booth activation gate remains pending rather than being forced through that native readiness condition.

### Required final live gate

1. Start from a fresh page where HeroForge's character/display state has reached its normal ready condition.
2. Confirm native `BT` is absent before the Booth request.
3. Toggle Witch Dock Booth View on once.
4. Confirm one version-matched `/gated/booth.js` exists, `BT` appears, `BT.currentMode` is the requested mode, and the native maker becomes enabled without any bootstrap error.
5. Confirm 4K, 8K, and Capture WebP controls are enabled/ready and module loader remains 23/23 with 0 failures.
6. Confirm turning Booth View off/on on the now-live native runtime does not create a duplicate Booth script or alter existing persistence/default behavior.

Do not merge this blocker repair into canonical `WITCH_DEV_MAIN` until the clean native-owned live gate passes.

**Runtime/module/manifest/public behavior changed:** task-branch Booth runtime bootstrap and manifest module version/cache key changed; public Stable unchanged.

---

## PFC-2026-09-17-010 — External core stylesheet candidate

Date: 2026-09-17

### Scope

Issue #10 on `wd/10-modular-bootstrap`: move core Dock CSS runtime ownership out of the monolithic core and into a GitHub-owned stylesheet applied by the bounded privileged bootstrap, while preserving the validated v1.3.5 appearance and interaction contracts.

### Prior live evidence

- v1.3.5 Dev state: running / error null / task-branch provenance correct.
- Correct inline emblem source preserved; icon computes to 48x48.
- Module loader: 23/23 executed, 0 failed, 294.8 ms.
- Amanda human gate: larger compact emblem looks better.
- HF-Chat-Bridge request: `hf-20260917-wd10-v135-live-002`.

### Static evidence for v1.3.6

- Task launcher parses successfully through `new Function` in Bridge static probe `hf-20260917-wd10-v136-static-002`.
- Launcher registry: v1.3.6 / build `1.3.6-extracted-core-css`.
- New stylesheet registry: `witch-dock-styles` v0.1.0 / build `0.1.0-extracted-core-css`.
- Manifest structure: 28 registry entries, 1 hidden bootstrap tool, 23 normal modules.
- `features/core/Witch_Dock_Styles.css` exists and carries the 48px compact-icon rule.
- Launcher fetches core and stylesheet through bounded repository requests and contains an exact CSS parity guard.
- Launcher removes the temporary v1.3.5 post-core icon-size override.
- External stylesheet is applied before core evaluation; runtime transformation converts the legacy `addStyles()` implementation to a no-op to prevent duplicate style insertion.
- Known-good inline compact emblem remains untouched.
- Checked-in `Witch_Dock.user.js` remains Stable-derived; this step changes runtime ownership through the temporary guarded migration seam rather than rewriting unrelated monolith code.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

### Required live gate

1. Existing fixed-name Dev install updates in place to v1.3.6; Dock title is `WITCH DOCK - DEV v1.3.6`.
2. Bootstrap must reach `status: running` with `error: null`; a CSS parity/seam failure must instead surface visibly and stop startup.
3. `KWWitchDockDevChannel.getState()` reports `coreStylesMode: external-bootstrap-css`, `coreStylesApplied: true`, and the v0.1.0 stylesheet URL/build.
4. `KWWitchDockStylesInfo` reports applied=true, owner=`privileged-bootstrap`, parity=`legacy-core-css-plus-48px-compact-icon`.
5. Verify only one effective Dock style insertion, correct 48x48 inline emblem, and normal Dock dimensions/classes.
6. Module loader remains 23/23 with zero failures.
7. Human visual/interaction gate: normal Dock appearance, tabs, About/Disclaimer, minimize/restore, compact launcher, and larger correct emblem.

Do not continue to the next extraction if this gate fails; repair or roll back only the CSS ownership seam.

**Runtime/module/manifest/public behavior changed:** task-branch core-style ownership, launcher v1.3.6, and new registered style component v0.1.0 changed; public Stable unchanged.

---

## PFC-2026-09-17-009 — Larger compact emblem inside unchanged button

Date: 2026-09-17

### Scope

Issue #10 on `wd/10-modular-bootstrap`: apply Amanda's requested compact-button presentation adjustment after v1.3.4 restored the correct emblem.

### Static evidence for v1.3.5

- Task launcher version is v1.3.5; fixed Tampermonkey `@name WITCH DOCK - DEV` is preserved.
- Manifest launcher registry is synchronized at v1.3.5 / build `1.3.5-larger-compact-emblem`.
- Compact button footprint remains 54x54 in the Stable-derived core.
- The task launcher adds only a post-core style override for `#kwWDCompactIcon`, increasing its rendered width/height from 40px to 48px.
- The override uses the existing bounded `PRIVILEGED_HOST.styles.add` capability and does not rewrite the checked-in monolithic core.
- Dev diagnostics expose `compactIconSizePx: 48` for live verification.
- The known-good inline compact-emblem data URL remains unchanged; `ASSETS/emblem.png` is not substituted.
- No storage, registration, drag/minimize, hotkey, bone-HUD, module-loader, or feature lifecycle behavior changes in this patch.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

### Required live gate

1. Existing fixed-name Dev install updates in place to v1.3.5; visible Dock title is `WITCH DOCK - DEV v1.3.5`.
2. Dev state reports `compactIconSizePx: 48`, `presentationAssetMode: inline-core-emblem-restored`, `status: running`, `error: null`.
3. `#kwWDCompactIcon` computes to 48x48 while `#kwWDCompact` remains 54x54.
4. Module loader remains 23/23 with zero failures.
5. Human visual gate: compact emblem is still correct and the larger size looks appropriate.
6. After this gate, continue dedicated CSS extraction as a separate architecture step.

**Runtime/module/manifest/public behavior changed:** task-branch compact-icon size and launcher/manifest version changed; public Stable unchanged.

---

## Current prior pre-flights

- **PFC-2026-09-17-008:** v1.3.4 restored the known-good inline compact emblem after `ASSETS/emblem.png` failed the human visual gate; original emblem later visually confirmed restored.
- **PFC-2026-09-17-007:** v1.3.3 stabilized Tampermonkey identity as fixed `WITCH DOCK - DEV`; runtime/loader passed 23/23.
- **PFC-2026-09-17-006:** v1.3.2 external compact-emblem candidate; runtime passed but later failed visual validation.
- **PFC-2026-09-17-005:** v1.3.1 host-owned bootstrap core fetch; live passed.
- **PFC-2026-09-17-004:** v1.3.0 privileged-host seam; live passed.
- **PFC-2026-09-17-003:** issue #10 monolith contract freeze.
