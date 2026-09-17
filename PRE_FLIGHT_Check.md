# Pre-Flight Check Log

Rolling current Dev pre-flight record. Older detail remains in Git history.

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
