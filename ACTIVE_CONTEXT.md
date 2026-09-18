# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active architecture branch:** `wd/10-modular-bootstrap`  
**Canonical installed Dev userscript:** `Witch_Dock_DEV.user.js`  
**Stable baseline:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** issue #10 Stage C presentation extraction. v1.3.8 modal v0.1.1 automated lifecycle is PASS. Regression testing exposed stale timer-only media readiness, now repaired by Booth v27.0.6 + bootstrap v0.2.1 named readiness handoffs.

## Current priorities

1. #10 — validate Booth v27.0.6 / bootstrap v0.2.1 media-readiness handoff, then complete the already-passing v1.3.8 modal human visual gate; continue Stage C only after both pass.
2. #19 — keep Tampermonkey identity fixed as `WITCH DOCK - DEV`; version belongs in `@version` and visible Dock title.
3. #12 / #7 / #8 / #13 / #14 remain standing migration/backlog/cleanup work; do not expand scope during #10.

## Completed live milestones

- v1.3.0 privileged host: PASS; raw GM privileges not page-exposed; loader 23/23, 0 failed.
- v1.3.1 host-owned core fetch: PASS.
- v1.3.3 stable Tampermonkey identity: PASS.
- v1.3.2/v1.3.3 external compact emblem: FAIL visual gate; wrong asset.
- v1.3.4 restored known-good inline emblem: PASS.
- v1.3.5 48x48 emblem inside 54x54 button: PASS human gate.
- v1.3.6 external core CSS: PASS automated + human visual gate; one effective stylesheet, correct 48x48 emblem, loader 23/23, 0 failed.
- Booth v0.1.2 cold-start blocker: PASS final native-owned lifecycle gate after a normal manual HeroForge refresh. Cold Booth request loaded one version-matched `/gated/booth.js`, native `BT.maker.enabled=true`, runtime/engine ready, 4K/8K/WebP enabled, no error; off/on cycle kept one script and preserved defaults/persistence. Bridge requests: `hf-20260917-wd10-booth-final-activate-001`, `hf-20260917-wd10-media-controls-final-001`, `hf-20260917-wd10-booth-cycle-final-001`.

## v1.3.7 candidate — extracted About/Disclaimer UI

- New `features/core/Witch_Dock_Modals.js`, registry id `witch-dock-modals`, v0.1.0 / build `0.1.0-extracted-about-disclaimer`.
- Launcher v1.3.7 fetches core, stylesheet, and modal module in parallel through bounded `PRIVILEGED_HOST.requestText`.
- Modal module receives only bounded script metadata plus existing GitHub/Ko-fi URLs; no raw GM capability is exposed.
- Launcher guards the exact legacy modal block and all six legacy modal function names, then replaces only those implementations with thin wrappers to `UW.KWWitchDockModals`.
- `getScriptMeta()` remains in the core because the bone HUD still uses it. Header button handlers and all modal DOM ids/classes/text/close semantics remain unchanged.
- Checked-in `Witch_Dock.user.js` remains byte-identical to the Stable-derived monolith; this is another guarded runtime ownership seam, not physical source deletion yet.
- The attempted Bridge static-fetch helper failed in the helper's nested config JSON before executing candidate code; it is not candidate-failure evidence. Final syntax/runtime proof belongs to the installed v1.3.7 live gate.

## Completed blocker repair — explicit Booth handoff

- On the v1.3.7 page, an explicit Booth request remained pending for 10 seconds while bootstrap attempts stayed at 0; the 200 ms timer-only trigger had not executed.
- Booth v27.0.5 now calls optional `KW_WD_BOOTH_BOOTSTRAP.requestSession()` when session Booth is enabled.
- Runtime bootstrap v0.2.0 handles that bounded request immediately and still delegates activation to HeroForge-native `BT.setBoothMode()`; polling remains a fallback.
- No direct maker-enable bypass is reintroduced.
- Final normal-refresh validation passed: cold activation, native maker/media readiness, off/on reuse, zero duplicates, and preserved defaults/persistence.

## Protected state

- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched during task-branch validation.
- Existing storage keys, `WitchDock` public seams, module ordering/cache keys/failure isolation, Dock layout/interactions, hotkeys, undo/redo, and bone HUD contracts remain protected by `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- Correct compact emblem remains inline; `ASSETS/emblem.png` is not used.
- HeroForge retains native Booth character-readiness and maker-enable ownership.
- HF-Chat-Bridge remains development infrastructure only.

## Current blocker repair — media readiness handoff

- Booth/runtime capability is healthy, but 4K/8K/WebP polling timers failed to refresh controls even after 6 seconds.
- Manual existing named seams immediately fixed the controls: TRUE-resolution readiness `sync()` returned true and WebP `readCapabilities()` returned Ready / UI `refresh()` returned true.
- Booth v27.0.6 now refreshes those optional named seams on session transitions; bootstrap v0.2.1 refreshes them after async native Booth bootstrap completion/failure.
- Existing timers remain fallback; no capture service/UI implementation or private HeroForge internals changed.
- Required next gate: fresh-load new module cache identities and prove ON enables media without manual sync, OFF refreshes state, second ON reuses BT with zero duplicates.

## v1.3.8 modal lazy-open repair

- Fresh-page visual-gate setup proved `openAbout()` did not create its overlay unless `ensureAbout()` had already been called.
- Root cause: missing `ensureAbout()` at the start of `openAbout()`; Disclaimer already had the correct lazy-create pattern.
- `Witch_Dock_Modals.js` v0.1.1 / build `0.1.1-lazy-about-open` adds only that missing call.
- Launcher v1.3.8 pins modal v0.1.1 with a new deterministic cache identity.
- Required next gate: update v1.3.8 in place, fresh refresh, About first-open/reopen, Disclaimer mutual exclusion/reopen, then human visual confirmation.

## v1.3.8 live gate

1. Existing fixed-name Dev install updates in place to v1.3.8; Dev state reaches `running` / `error:null`, `coreModalsMode: external-bootstrap-module`, `coreModalsApplied:true`.
2. `KWWitchDockModalsInfo` and `KWWitchDockModals.getState()` report v0.1.1 / build `0.1.1-lazy-about-open` and configured=true; no modal overlays exist before first use.
3. About button creates exactly one `#kwWDAboutOverlay`; title/footer/links match prior behavior; close button, overlay click, and Escape work; reopen creates no duplicate.
4. Disclaimer creates exactly one `#kwWDDisclaimerOverlay`, closes About when opened, preserves exact content/footer, and closes via button/overlay/Escape without duplicates.
5. Loader remains 23/23 with 0 failures; v1.3.6 CSS remains healthy; Booth v27.0.6 + bootstrap v0.2.1 must pass the media-readiness handoff regression.
6. Human visual gate: About and Disclaimer look normal/unchanged.
7. Only after pass continue to bone HUD/detection extraction; do not integrate/promote Stable yet.

## Minimum continuation set

Read only: `PROJECT_CONTRACT.md`, this file, `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`, issue #10/#19, `MODULE_VERSIONING.md`, `Witch_Dock_DEV.user.js`, `manifest.json`, `DEV_DIVERGENCES.json`, `features/core/Witch_Dock_Styles.css`, `features/core/Witch_Dock_Modals.js`, `features/booth/Booth_Runtime_Bootstrap.js`, and the exact core responsibility being extracted.

Do not preload MASTER, full old logs, unrelated HISTORY files, or HeroForge.Compatibility unless current evidence requires them.
