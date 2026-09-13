# Changelog

This active changelog is intentionally compact. Detailed prior entries through `DOCK-2026-09-08-047` remain preserved in Git history at Dev head `4cd8d15e49aee8e02b01f519ed32af579c94a277` and earlier.

## DOCK-2026-09-12-049 — D4 Dev texture-quality live acceptance

Date: 2026-09-12

### Integrated Dev result

The new WITCH_DEV_UI native texture-quality service/UI loaded exactly once on D4 with the standalone alpha absent and the service OFF. Fresh-page baseline remained native `4096x4096`, bodyLower/bodyUpper `bakeSize=1024 / used=512`, face `1024 / 1024`, with no body mask overrides.

One Dev-service enable then passed both runtime and human visual validation:

- service v0.1.0 / build `0.1.0-dev-hfc-alpha3-port` returned true and stayed ON with no error;
- one expected HeroForge generation replacement was adopted;
- native atlas remained coherent `4096x4096`;
- bodyLower/bodyUpper/face allocations and `_usedTextureSize` natively promoted to `2048x2048 / 2048`;
- actual bodyLower/bodyUpper color-bake masks remained the exact pinned real `1024x1024` textures;
- scheduler settled idle;
- Amanda confirmed D4 looks perfect: body color/paint and historical glyph channel correct, body/face and decals sharp, no poop/corruption, and no wrong material/color/emissive channels.

Bridge evidence: #1735 baseline, #1737 enable/readback.

### Lifecycle result

A controlled Dev disable returned true with no error, removed all `atlasScale` target overrides and both body `masksMapOverride` properties, left the scheduler idle, and retained a native coherent `4096x4096` atlas.

HeroForge's OFF rebuild recalculated all three target `_usedTextureSize` values to 1024 rather than reproducing D4's original `512/512/1024` baseline. This is recorded as native post-restore recalculation, not retained Witch Dock ownership: scale overrides and mask overrides were absent after readback.

A subsequent OFF -> ON enable passed again: native 4096 atlas, 2048 allocations/used on all targets, exact 1024 body masks, no error, scheduler idle.

Bridge evidence: #1738 disable, #1739 OFF readback, #1740 re-enable.

### Remaining Dev gate

- integrated Blood Moon enable/readback + human visual confirmation;
- ordinary Witch Dock/Booth smoke sufficient to detect an integration conflict;
- then review for explicit Stable promotion.

**Runtime behavior changed:** no. This is a documentation-only live-validation checkpoint. Public `Witch_Scripts` / Stable remains unchanged.

---

## DOCK-2026-09-12-048 — Add Dev native texture-quality reconcile

Date: 2026-09-12

### Upstream acceptance

HeroForge.Compatibility `rendering.texture-quality` standalone alpha.3 passed both complementary visual gates before this integration:

- Blood Moon: high-resolution body + sharp decals + correct Discus / Celestial Circlet / Short Crown Horn material/color/emissive channels + no poop;
- D4: body color/paint and historical glyph channel correct, sharp body/face and decals, no poop/corruption, no obvious wrong accessory channels;
- native HeroForge reconciliation produced coherent `4096x4096` atlases in both cases;
- Blood Moon retained `1024x1024` body/head allocations while D4 natively promoted all three targets to `2048x2048` / used `2048`;
- bodyLower/bodyUpper actual color-bake masks remained the exact real pinned `1024x1024` textures.

Canonical upstream checkpoint: HeroForge.Compatibility commit `1c5b238a21c6acc5767d3c1b7f7ab5c702bf8f75`.

### Dev integration

Added two new Dev-only modules:

- `texture-quality-native-reconcile` v0.1.0 / build `0.1.0-dev-hfc-alpha3-port` at `features/rendering/Texture_Quality_Native_Reconcile.js`;
- `texture-quality-native-reconcile-ui` v0.1.0 / build `0.1.0-dev-texture-quality-controls` at `features/rendering/Texture_Quality_Native_Reconcile_UI.js`.

The service ports the validated standalone architecture rather than the rejected Protected Textures ownership model:

- module load is inert and OFF by default;
- explicit enable seeds bodyLower/bodyUpper/face `atlasScale=4`, `bakeSize=2048`, `_usedTextureSize=1024`;
- real 1024 body masks are loaded, pinned, and verified as the actual color-bake inputs;
- HeroForge owns native `data.change -> modded.change/buildAtlas -> character.refresh/update -> display.change/update` reconstruction;
- expected replacement display/modded generations are adopted while character/data/target-part identity remains the stale-session safety boundary;
- native source/allocation promotion from 1024 through the 2048 bake ceiling is accepted;
- disable/failure restores owned source snapshots and asks HeroForge to rebuild natively; stale atlas objects are never restored;
- figure changes clear the Dev service bookkeeping OFF rather than mutating the new figure through stale snapshots;
- no custom `CK.Atlas`, buildAtlas wrapper, direct atlas assignment, persistent watcher, Compatibility runtime dependency, or HF-Chat-Bridge runtime dependency.

The UI registers `Texture Quality` under the existing Utilities tab with explicit Enable/Disable, manual Reconcile, capability/status, and compact verification diagnostics.

### Manifest / versioning

- registered both new modules in `manifest.json.moduleRegistry` at canonical v0.1.0;
- added cache-keyed WITCH_DEV_UI module URLs;
- both manifest loader entries are hidden because the UI module self-registers the visible Witch Dock tool, matching the existing service/UI pattern;
- existing Witch Dock core/loader/Booth/Spinny/True Resolution/Decals/Utilities module versions are unchanged.

### Static validation

- both new JavaScript files: `node --check` PASS;
- manifest: JSON parse PASS; module/tool IDs unique; both new modules present in registry + loader list;
- source audit PASS: no custom `CK.Atlas`, no buildAtlas replacement, no direct display/resource atlas assignment, no MutationObserver/setInterval ownership watcher in the service;
- service is explicitly OFF by default and has no HeroForge.Compatibility/HF-Chat-Bridge runtime dependency.

### Live gate

D4 integrated runtime/visual/lifecycle validation is now PASS per DOCK-049. Blood Moon integrated validation and ordinary Witch Dock/Booth smoke remain before Stable consideration.

**Runtime behavior changed:** yes, WITCH_DEV_UI only in the preceding integration commit. Public `Witch_Scripts` / Stable is unchanged.

---

## Prior active history

`DOCK-2026-09-08-047` and earlier remain preserved verbatim in Git history at Dev head `4cd8d15e49aee8e02b01f519ed32af579c94a277` and its ancestors.
