# Changelog

## DOCK-2026-09-06-022 — Release Witch Dock v1.1.0 with Spinny Mini WebP

Date: 2026-09-06

### Summary

Promoted the explicitly approved, integrated Dev-tested `media.spinny-mini-webp` feature into public Witch Dock Stable as a narrow accepted delta. Public userscript version advances from 1.0.8 to 1.1.0.

### Public runtime changes

- added `features/media/Spinny_Mini_WebP.js` v0.5.1 / build `0.5.1-witch-dock-stable-download-scroll-guard`;
- added `features/media/Spinny_Mini_WebP_UI.js` v0.1.1 / build `0.1.1-stable-download-ux`;
- added 1024px, 2048px and validated TRUE-3K 3072px animated WebP profiles;
- retained Standard / Slow / Slower / Very Slow profiles at 40 ms per encoded frame;
- added safe frame-boundary Pause/Resume and cancel-while-paused behavior;
- added continuity guards for camera/Booth interaction;
- wheel/scroll attempts during capture are silently suppressed;
- other continuity-invalidating interactions retain Keep Capture / Cancel Capture warning behavior;
- added the validated shared-state draggable Spinny popout;
- added dark dropdown styling and plain public resolution labels;
- public `Witch_Dock.user.js` now grants/exposes `GM_download` as the confirmed Blob download boundary;
- Short Test remains hidden in ordinary Stable because Developer Mode is not part of this promotion;
- 4096 animated WebP remains deferred.

### Validation

Prior standalone and Dev validation covered native lower-resolution capture, TRUE-3K 3072 repair, full 250/500-frame production runs, parser/mux output, rotation restoration, ETA, Pause/Resume, cancel, popout, interaction guards and repeated use.

Final integrated Dev re-smoke immediately before approval:

- silent scroll block: PASS;
- privileged WebP download: PASS;
- remaining integrated behavior: user reported everything works perfectly;
- optional transient in-panel completion flash: not observed and explicitly treated as non-gating.

### Excluded Dev work

This is not a merge of `WITCH_DEV_UI`. Developer Mode, compact High Res UI, module-version registry, Dev loader and unrelated ordering/UI work remain outside this Stable release.

### Rollback

Revert this release commit to restore v1.0.8, remove the two Spinny manifest/modules, and remove the `GM_download` host. Existing true-resolution still capture and other Stable modules are otherwise unchanged.

**Runtime behavior changed:** yes — public Stable feature release.

---

## DOCK-2026-09-05-021 — Public Photo Booth Smoke Acceptance

Date: 2026-09-05

### Summary

Documentation-only checkpoint recording final public acceptance of `media.screenshot-resolution` after the Stable promotion.

### Confirmed public result

- Temporary standalone v0.6 and WITCH_DEV_PHOTO test scripts were disabled for the clean public test.
- Public readiness adapter worked without requiring the repair toggle to be cycled.
- Existing Lob-injected HeroForge 4096 capture routed through public Witch Dock and passed perfectly.
- Existing Lob-injected HeroForge 8192 capture routed through public Witch Dock and passed perfectly.
- Public Witch Dock direct TRUE 4K capture passed perfectly.
- Public Witch Dock direct TRUE 8K capture passed perfectly.
- Amanda reported the public integration works perfectly.

### Status

- `media.screenshot-resolution`: **Witch Dock Stable validated**.
- TRUE 4K maintained architecture: one 4096 Effects source.
- TRUE 8K maintained architecture: four shifted 4096 Effects sources; no 8192 WebGL Effects target.
- Lob/ADP remains unchanged and compatible as the current HeroForge-UI source for 4096/8192 choices.
- Lob-absent HeroForge-native resolution-menu injection remains future work and does not block Stable status.

### Runtime impact

**No runtime behavior changed.** No JavaScript, manifest, userscript shell, or capture behavior changed in this checkpoint.

### Touched files

- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

---

Historical changelog records through DOCK-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.
