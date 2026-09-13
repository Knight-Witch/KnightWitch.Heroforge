# Changelog

This active Stable changelog is intentionally compact. Detailed prior Stable entries through `DOCK-2026-09-08-030` remain preserved in Git history at Stable head `2d0304dccc241ae5d493563bdca00a036257e362` and earlier.

## DOCK-2026-09-12-031 — Promote validated native Texture Quality to Stable

Date: 2026-09-12

### Summary

Promote only the Dev-validated `rendering.texture-quality` native-reconcile service/UI into public `Witch_Scripts`. This is a narrow Stable promotion; unrelated WITCH_DEV_UI work is not merged.

### Promoted runtime

- new `texture-quality-native-reconcile` v0.1.0 / build `0.1.0-dev-hfc-alpha3-port`;
- new `texture-quality-native-reconcile-ui` v0.1.0 / build `0.1.0-dev-texture-quality-controls`;
- exact validated Dev service blob `f1891bb266ea1e8f03101d96b43bc9d38de3fa46`;
- exact validated Dev UI blob `2c781d4c8e0a0ae472187512875d7db369897c7f`;
- public module URLs point only to `Witch_Scripts` with deterministic v0.1.0 build cache keys;
- public Witch Dock shell remains v1.2.1 and byte-unchanged.

### Architecture preserved

The public feature keeps the validated native-generation contract:

- source policy only: `atlasScale=4`, `bakeSize=2048`, `_usedTextureSize=1024` minimum seed;
- bodyLower/bodyUpper use real exact 1024 masks and verify those exact textures remain actual color-bake inputs;
- HeroForge owns atlas creation/repack and display generation;
- expected display/modded generation replacements are adopted;
- native source/allocation promotion through 2048 is accepted;
- disable restores/removes only feature-owned source fields and asks HeroForge to rebuild natively;
- no custom `CK.Atlas`, buildAtlas wrapper, direct atlas assignment, giant-atlas forcing, persistent ownership watcher, HeroForge.Compatibility runtime dependency, or HF-Chat-Bridge runtime dependency.

### Dev acceptance inherited

D4 passed the body color/glyph gate, lifecycle OFF -> ON repetition, and exact pinned-mask verification. Blood Moon passed the atlas-pressure/accessory-channel gate, including zero broken/fallback resources across 16 Discus, 2 Short Crown Horn, and 3 Celestial Circlet instances. Amanda visually approved both integrated Dev figures. A normal native character refresh remained verified, and the integration topology smoke retained exactly one loaded Booth runtime.

Dev acceptance head: `c8f8000d9562dbc315dc867af655358177e18d54`.
Compatibility release checkpoint: `9bced7c9042133f766bfd47b672bdfcd845fbcd0`.

### Stable gate

Before moving `Witch_Scripts`, verify:

- candidate parent is current Stable head `2d0304dccc241ae5d493563bdca00a036257e362`;
- exact changed-file whitelist is limited to the two rendering modules, `manifest.json`, `CHANGELOG.md`, `PRE_FLIGHT_Check.md`, and the Texture Quality history file;
- candidate manifest is valid JSON, unique by module/tool ID, and differs from the current Stable manifest only by the two new module registry entries and two new loader entries;
- no public runtime URL references `WITCH_DEV_UI`;
- source blobs match the validated Dev blobs exactly.

After branch movement, perform one clean public Stable reload and narrow runtime/visual smoke before final release closeout.

**Runtime behavior changed:** yes — public Stable gains the opt-in Texture Quality native-reconcile service/UI. Existing public modules and shell are unchanged.

---

## Prior Stable history

`DOCK-2026-09-08-030` and earlier remain preserved verbatim in Git history at Stable head `2d0304dccc241ae5d493563bdca00a036257e362` and its ancestors.
