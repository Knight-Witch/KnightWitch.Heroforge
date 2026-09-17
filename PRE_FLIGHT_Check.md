# Pre-Flight Check Log

Rolling current Dev pre-flight record. Older detail remains in Git history/issues.

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
