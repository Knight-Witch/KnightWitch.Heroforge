# Pre-Flight Check Log

Rolling current Dev pre-flight record. Older detail remains in Git history/issues.

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
