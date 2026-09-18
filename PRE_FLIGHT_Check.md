# Pre-Flight Check Log

Rolling current Dev pre-flight record. Older detail remains in Git history/issues.

## PFC-2026-09-17-015 — Event-driven media readiness handoff

Date: 2026-09-17

### Diagnosis

- v1.3.8 launcher/modal baseline: running/error null; modal v0.1.1 configured; loader 23/23 / 0 failed in 345.1 ms.
- Fresh modal lifecycle: About first-open/reopen and Disclaimer mutual exclusion/reopen passed with one overlay each; all six close paths (button/backdrop/Escape for both) passed.
- Booth v27.0.5 / bootstrap v0.2.0 remained native-ready/error-null with one Booth script, but 4K/8K/WebP stayed disabled after 2.5 s and 6 s.
- Manual existing readiness seams immediately corrected UI: TRUE-resolution readiness `sync()` returned true; WebP capability returned Ready; WebP UI `refresh()` returned true; all three capture surfaces became enabled.
- This confirms stale timer-driven UI synchronization, not unavailable capture capability.

### Candidate

- Booth -> v27.0.6 / build `v27.0.6-media-readiness-handoff`.
- Booth Runtime Bootstrap -> v0.2.1 / build `0.2.1-media-readiness-handoff`.
- Booth transition invokes optional `KWPhotoBoothTrueResolutionReadiness.sync()` and `KWSpinnyMiniWebPUI.refresh()`.
- Bootstrap completion/failure invokes the same optional capability seams after clearing in-flight state.
- Polling timers remain as fallback; no capture service/UI source changed.
- Manifest registry and deterministic URLs/cache keys synchronized.

### Required live gate

1. Fresh-load the new Booth/bootstrap module identities.
2. With HeroForge ready and Booth OFF, turn Booth ON once.
3. Confirm native Booth ready, one Booth script / zero duplicates / bootstrap error null.
4. Without manual media sync calls, confirm 4K/8K/WebP become enabled.
5. Turn Booth OFF; confirm media controls refresh/disable without relying on interval polling.
6. Turn Booth ON again; confirm live-BT reuse, zero duplicates, and media controls enable again.
7. Leave Booth OFF.
8. Human modal visual gate remains required after automated regressions pass.

### Live result

PASS on a manual HeroForge reload:
- loader 23/23 / 0 failed in 221.9 ms;
- Booth v27.0.6 + bootstrap v0.2.1 loaded from the task branch;
- first ON bootstrapped native Booth, one matching Booth script / zero duplicates / no bootstrap error, and 4K/8K/WebP enabled without manual `sync()` / `refresh()`;
- OFF disabled all three media surfaces;
- second ON reused live BT, retained one Booth script / zero duplicates, and re-enabled all three;
- final state returned Booth OFF;
- About modal v0.1.1 is open for the remaining human visual gate.

**Runtime/module/manifest/public behavior changed:** task-branch Booth tool/bootstrap and cache identities changed; public Stable unchanged.

---

## PFC-2026-09-17-013 — Explicit Booth session handoff candidate

Date: 2026-09-17

### Scope

Issue #10 task branch: remove the proven dependency of an explicit Booth View request on the bootstrap's 200 ms polling timer while preserving HeroForge's native Booth ownership contract.

### Evidence / candidate

- v1.3.7 modal baseline passed: running/error null; modal v0.1.0 configured; no overlays before first use; loader 23/23, 0 failed in 499.8 ms.
- About/Disclaimer automated lifecycle passed: one overlay each, expected title/footer/content/links, mutual exclusion, no duplicate creation, and final closed state.
- Ready HeroForge page with native BT absent: explicit Booth session request remained pending for both 2.5 s and 10 s while bootstrap attempts stayed at 0; 4K/8K/WebP remained disabled. The timer-only trigger did not execute on that page.
- `booth-runtime-bootstrap` is v0.2.0 / build `0.2.0-explicit-session-handoff` and exposes bounded `requestSession()`.
- Booth is v27.0.5 / build `v27.0.5-explicit-session-handoff`; its source-local/public API version fields are also synchronized at 27.0.5.
- The source-sync correction uses a fresh deterministic build/cache identity so validation cannot reuse the earlier stale branch-ref response.
- `onUserBoothToggle(true)` invokes the optional bootstrap handoff after updating current-session state; the existing 200 ms poll remains a fallback.
- Bootstrap still loads at most one version-matched HeroForge `/gated/booth.js`, delegates activation to native `BT.setBoothMode()`, and does not directly force `maker.enable()`.
- Manifest registry and deterministic module URL cache keys are synchronized. Static syntax checks passed for both changed modules and manifest JSON.

### Required live gate

1. Fresh-load v27.0.5 / bootstrap v0.2.0.
2. From a ready page with BT absent, request Booth once; `directSessionRequests` and `attempts` must increment.
3. Confirm one Booth script, BT/maker ready, bootstrap error null, and 4K/8K/WebP enabled.
4. Loader remains 23/23 with zero failures.
5. Booth off/on creates no duplicate script and leaves saved/default settings unchanged.
6. Human gate: About and Disclaimer look/behave normal.

**Runtime/module/manifest/public behavior changed:** task-branch Booth activation handoff and module/cache-key versions changed; public Stable unchanged.

---

## PFC-2026-09-17-012 — Extracted About/Disclaimer candidate

Date: 2026-09-17

### Scope

Issue #10 on `wd/10-modular-bootstrap`: move About/Disclaimer UI implementation out of the Stable-derived monolith into a GitHub-owned bootstrap module without changing visible behavior or unrelated Dock contracts.

### Prior live evidence

- v1.3.6 external CSS automated + human visual gates passed.
- Booth v0.1.2 blocker final PASS after normal manual HeroForge refresh: one native Booth script, native maker/runtime ready, 4K/8K/WebP enabled, no error; off/on cycle created no duplicate and preserved persistence/defaults. Bridge requests: `hf-20260917-wd10-booth-final-activate-001`, `hf-20260917-wd10-media-controls-final-001`, `hf-20260917-wd10-booth-cycle-final-001`.

### Candidate

- Launcher v1.3.7 / build `1.3.7-extracted-core-modals`; fixed Tampermonkey `@name WITCH DOCK - DEV` retained.
- New `features/core/Witch_Dock_Modals.js`, registry id `witch-dock-modals`, v0.1.0 / build `0.1.0-extracted-about-disclaimer`, load role `bootstrap-module`.
- Core, CSS, and modal JS are fetched in parallel through bounded repository `requestText`.
- Modal module is configured only with bounded script metadata plus existing GitHub/Ko-fi URLs; raw Tampermonkey APIs are not exposed.
- Launcher guards exactly one legacy modal block and exactly one occurrence of each six legacy modal functions before replacing only those implementations with wrappers to `UW.KWWitchDockModals`.
- `getScriptMeta()` remains in core for bone HUD. Existing buildUI header handlers are unchanged.
- Checked-in `Witch_Dock.user.js` remains byte-identical to the Stable-derived source.
- Manifest registry is synchronized: launcher v1.3.7, modal v0.1.0, Booth v0.1.2 retained; normal manifest modules remain 23 and bootstrap loader remains unchanged.
- Attempted Bridge pre-install parser helper `hf-20260917-wd10-modals-static-001` failed in the helper's nested config JSON before candidate code executed (`ConfigError`); do not treat it as candidate syntax evidence or retry that mutation request.

### Required live gate

1. Existing fixed-name Dev install updates in place to v1.3.7 and page starts with Dev state `running`, `error:null`, `coreModalsMode:external-bootstrap-module`, `coreModalsApplied:true`.
2. `KWWitchDockModalsInfo` is v0.1.0/build `0.1.0-extracted-about-disclaimer`, applied by `bootstrap-module`; `KWWitchDockModals.getState()` is configured with no overlays before first use.
3. About creates one legacy-id overlay/modal, correct title/version/links/content, supports close button/overlay/Escape, and reopening does not duplicate it.
4. Disclaimer creates one legacy-id overlay/modal, closes About, preserves exact content/version, supports close button/overlay/Escape, and reopening does not duplicate it.
5. Module loader remains 23/23 with zero failures; external CSS and Booth/media readiness remain healthy.
6. Human visual gate: About and Disclaimer look normal/unchanged.

Do not continue to bone HUD extraction if this gate fails; repair/rollback only the modal ownership seam.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/modal ownership and manifest registry changed; public Stable unchanged.

---

## PFC-2026-09-17-011 — Booth cold-start compatibility repair

- `Booth_Runtime_Bootstrap.js` v0.1.2 / build `0.1.2-session-cold-start` reacts to current-session Booth View, loads one version-matched native Booth script, and delegates mode/engine ownership to HeroForge `BT.setBoothMode()`.
- Direct `maker.enable()` bypass experiment was rejected and removed.
- Final clean live gate PASS: normal-ready cold page -> Booth request -> one script, maker enabled, runtime/engine ready, 4K/8K/WebP enabled, zero bootstrap errors; off/on cycle no duplicate or persistence/default drift.

---

## PFC-2026-09-17-010 — External core stylesheet

- v1.3.6 / `Witch_Dock_Styles.css` v0.1.0, guarded parity, bounded host insertion, one effective stylesheet.
- Loader 23/23, 0 failed; Amanda confirmed Dock visual appearance normal.

---

## Current prior pre-flights

- **009:** 48px compact emblem in unchanged button; PASS.
- **008:** known-good inline emblem restore; PASS.
- **007:** stable Tampermonkey Dev identity; PASS.
- **006:** external emblem candidate; visual FAIL and rolled back.
- **005:** v1.3.1 host-owned core fetch; PASS.
- **004:** v1.3.0 privileged-host seam; PASS.
- **003:** issue #10 monolith contract freeze.
