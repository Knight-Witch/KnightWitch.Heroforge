# Changelog

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
