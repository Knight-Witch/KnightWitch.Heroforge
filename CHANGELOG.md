# Changelog

Rolling current Dev log. Older detail remains durable in Git history/issues.

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
