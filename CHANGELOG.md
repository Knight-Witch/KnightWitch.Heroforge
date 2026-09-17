# Changelog

Rolling current Dev log. Older detail remains durable in Git history/issues.

## DOCK-2026-09-17-010 — Extract core Dock CSS behind privileged bootstrap

Date: 2026-09-17

### Summary

Advanced issue #10 after v1.3.5 passed both live runtime checks and Amanda's human compact-icon gate.

- v1.3.5 live PASS: Dev state running/error null, correct inline emblem at 48x48, and module loader 23/23 with 0 failures in 294.8 ms.
- Bumped the task launcher to v1.3.6 / build `1.3.6-extracted-core-css`.
- Added `features/core/Witch_Dock_Styles.css`, registry id `witch-dock-styles`, v0.1.0 / build `0.1.0-extracted-core-css`.
- Launcher now fetches the legacy core and extracted stylesheet in parallel through `PRIVILEGED_HOST.requestText`, then injects styles through bounded `PRIVILEGED_HOST.styles.add` before UI construction.
- Added a guarded parity check: the external stylesheet must match the legacy inline CSS exactly except for the already-human-approved compact-icon size change from 40px to 48px.
- Runtime source transformation replaces the legacy `addStyles()` implementation with a no-op so only the externally owned stylesheet is applied.
- Removed the temporary v1.3.5 post-core 48px override; 48px is now owned by the extracted stylesheet.
- Static parser/manifest check passed: launcher v1.3.6, styles v0.1.0, 28 registry entries, 1 bootstrap tool, 23 normal modules; old size-override block absent.
- Checked-in `Witch_Dock.user.js` remains Stable-derived during this bounded migration seam; physical deletion of duplicated legacy CSS waits for the later true core split.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch style ownership, launcher v1.3.6, and new registered core-style v0.1.0 changed; public Stable unchanged.

---

## DOCK-2026-09-17-009 — Enlarge compact emblem inside existing button

Date: 2026-09-17

### Summary

Applied Amanda's requested compact-button presentation adjustment after the v1.3.4 known-good emblem was visually confirmed restored.

- Human gate for v1.3.4 passed: the original Witch Dock emblem is visibly correct again.
- Bumped the task launcher to v1.3.5 / build `1.3.5-larger-compact-emblem`.
- Preserved the compact button at 54x54 and increased only `#kwWDCompactIcon` from 40x40 to 48x48.
- Applied the 48px size as a narrow post-core style override through the already-validated bounded host `styles.add` capability; this avoids rewriting the Stable-derived monolith before the dedicated CSS extraction step.
- Added `compactIconSizePx: 48` to Dev diagnostics for live verification.
- The known-good inline emblem source remains unchanged; `ASSETS/emblem.png` remains excluded from runtime compact-icon ownership.
- No storage, registration, drag/minimize, hotkey, bone-HUD, module-loader, or feature lifecycle behavior changed.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch compact-icon presentation size and launcher/manifest version changed; public Stable unchanged.

---

## DOCK-2026-09-17-008 — Restore known-good compact emblem after visual failure

Date: 2026-09-17

### Summary

Corrected the first presentation-asset extraction after the external compact emblem failed its required human visual gate.

- Dev v1.3.3 passed runtime validation: correct task provenance/title, privileged-host boundary intact, `status: running`, `error: null`, and module loader 23/23 with 0 failures in 167.9 ms.
- Human compact-button validation failed: the button rendered as a dark square with only a short white line instead of the Witch Dock emblem.
- HF-Chat-Bridge confirmed the external image loaded successfully at 256x256 and rendered at 40x40, ruling out a missing-resource/CSP failure.
- A pixel probe proved `ASSETS/emblem.png` itself is the wrong visual asset for compact mode: only 156 non-transparent pixels, almost all bright, bounded to x=41..255 and y=23..24.
- Bumped the task launcher to v1.3.4 / build `1.3.4-restore-inline-compact-emblem`.
- Removed the runtime substitution of `ASSETS/emblem.png` and restored the exact known-good inline `COMPACT_EMBLEM_URL` data URL already present in the Stable-derived core.
- Retained the validated privileged-host/bootstrap work and exact guarded inline-emblem declaration check.
- No CSS or other application ownership moved in this repair; checked-in `Witch_Dock.user.js` remains unchanged.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch compact-emblem source ownership was rolled back to the known-good inline core data URL and launcher/manifest version advanced to v1.3.4; public Stable unchanged.

---

## DOCK-2026-09-17-007 — Stabilize Tampermonkey Dev identity

Date: 2026-09-17

### Summary

Corrected the Dev userscript identity contract after confirming versioned Tampermonkey `@name` values were causing repeated raw installs to appear as new scripts instead of normal updates.

- Bumped the task launcher to v1.3.3 / build `1.3.3-stable-tampermonkey-identity`.
- Fixed Tampermonkey `@name` as `WITCH DOCK - DEV`; `@namespace` remains `KnightWitch`.
- Kept version reporting in `@version`, runtime `DEV_VERSION`, manifest registry, and visible Dock title `WITCH DOCK - DEV v1.3.3`.
- Updated `PROJECT_CONTRACT.md`, `MODULE_VERSIONING.md`, `DEV_DIVERGENCES.json`, ACTIVE_CONTEXT, and issue #19 so future work cannot reintroduce versioned Tampermonkey names.
- Preserved the v1.3.2 external compact-emblem extraction unchanged; no CSS or additional monolith ownership moved in this correction.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch Dev launcher metadata/version and identity contract changed; public Stable unchanged.

---

## DOCK-2026-09-17-006 — Externalize compact emblem ownership

Date: 2026-09-17

### Summary

Advanced issue #10 after Stage C passed live validation.

- Stage C passed on Dev v1.3.1: host-owned bootstrap confirmed, correct task provenance/title, `status: running`, `error: null`, and module loader 23/23 with 0 failures in 458 ms.
- Bumped task launcher to v1.3.2 / build `1.3.2-external-compact-emblem`.
- Reused existing `ASSETS/emblem.png` rather than creating a duplicate asset.
- Added an exact guarded runtime seam that replaces the single legacy inline base64 `COMPACT_EMBLEM_URL` declaration with the task-branch asset URL; unexpected seam counts fail visibly.
- Added Dev diagnostics for compact-emblem URL and `presentationAssetMode: external-compact-emblem`.
- No CSS, storage, registry, interaction, hotkey, bone-HUD, or module-loader ownership moved in this step.
- Checked-in `Witch_Dock.user.js` remains unchanged; this is a bounded runtime-ownership extraction through the temporary migration seam.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch Dev presentation-asset ownership and launcher/manifest version changed; public Stable unchanged.

---

## Current prior milestones

- **DOCK-2026-09-17-005:** Dev v1.3.1 made `PRIVILEGED_HOST.requestText` own bootstrap core fetching; monolith unchanged.
- **DOCK-2026-09-17-004:** Dev v1.3.0 introduced bounded privileged host seam; monolith unchanged.
- **DOCK-2026-09-17-003:** froze monolith contracts in `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- **DOCK-2026-09-17-002:** established canonical Dev identity/routing and automatic post-Stable-smoke cleanup rules.
- **DOCK-2026-09-17-001:** established clean Stable-derived `WITCH_DEV_MAIN` governance baseline.
