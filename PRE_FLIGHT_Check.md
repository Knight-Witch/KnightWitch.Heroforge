# Pre-Flight Check Log

This active pre-flight log is intentionally compact. Detailed records through `PFC-2026-09-08-047` remain preserved in Git history at Dev head `4cd8d15e49aee8e02b01f519ed32af579c94a277` and earlier.

## PFC-2026-09-12-050 — Native texture-quality Dev acceptance complete

Date: 2026-09-12

### Reviewed

- current WITCH_DEV_UI texture-quality service/UI v0.1.0;
- D4 integrated acceptance/lifecycle checkpoint from PFC-049;
- Blood Moon clean Dev baseline and integrated enable/readback;
- Amanda's Blood Moon visual verdict;
- focused accessory resource probe for Discus / Short Crown Horn / Celestial Circlet;
- ordinary native `CK.character.refresh()` survival with Texture Quality ON;
- non-invasive Booth/runtime topology smoke;
- Bridge #1741, #1742, #1744, #1745, and #1746.

### Confirmed Blood Moon integrated load

Before enable:

- standalone `HFNativeTextureReconcileTest` absent;
- Dev service/UI present at v0.1.0;
- scheduler idle;
- native atlas `4096x4096`;
- no target `atlasScale` overrides;
- no body mask overrides;
- native source state BL/BU `1024 bake / 512 used`, face `1024 / 1024`.

### Confirmed Blood Moon enable

One controlled Dev enable:

- returned true and left service ON / not busy / no error;
- adopted one expected HeroForge replacement generation;
- native coherent atlas `4096x4096`;
- BL/BU/face allocations `1024x1024`;
- BL/BU/face `bakeSize=2048`, `_usedTextureSize=1024`;
- actual bodyLower/bodyUpper color-bake masks remained the exact pinned real `1024x1024` textures;
- scheduler idle after settle.

Amanda visually confirmed body texture and decals sharp, no poop/corruption, correct Discus / Celestial Circlet / Short Crown Horn channels, and no visible material/color/emissive regression.

A focused resource check found zero fallback/broken resource bindings among 16 `discus`, 2 `spikeSmall`, and 3 `starCirclet` parts.

### Confirmed native-refresh survival

With Texture Quality ON, one ordinary `CK.character.refresh()`:

- completed without error;
- service remained ON and `verify()` returned OK;
- adoption count advanced to two, proving expected replacement-generation adoption;
- atlas remained `4096x4096`;
- targets remained `bakeSize=2048 / used=1024`;
- both body mask overrides remained valid 1024 textures;
- scheduler returned idle.

### Confirmed Witch Dock / Booth integration smoke

Without changing Booth mode or component state:

- exactly one `/gated/booth.js` script existed;
- script state was `loaded` and parent was BODY;
- live `BT` runtime present;
- live `KW_WD_BOOTH_BOOTSTRAP` present;
- Texture Quality service and UI globals present;
- no duplicate Booth script/runtime load was introduced by Texture Quality or the native refresh smoke.

The generic scene traversal used in the topology probe did not enumerate named TokenBackground/TokenShadow/TokenFrame nodes, so no overlay-count claim is made from that probe. Duplicate Booth script topology—the relevant regression signal—was clean.

### Gate result

Standalone acceptance: PASS.  
WITCH_DEV_UI D4 integrated visual/lifecycle acceptance: PASS.  
WITCH_DEV_UI Blood Moon integrated visual/accessory acceptance: PASS.  
Native refresh survival: PASS.  
Non-invasive Witch Dock/Booth topology smoke: PASS.

**Dev acceptance gate: CLOSED / PASS.** The feature is ready for explicit Stable promotion review.

### Remaining risk / promotion boundary

- D4 disable intentionally promises removal/restoration of feature-owned source policy followed by a native rebuild; it does not promise exact reproduction of HeroForge's transient pre-enable `_usedTextureSize` values.
- Public `Witch_Scripts` must remain unchanged until Amanda explicitly approves Stable promotion.
- Stable promotion should be narrow: port the validated Dev service/UI + manifest wiring only, preserve the accepted architecture, and repeat a clean Stable smoke rather than reopening the investigation.

**Runtime behavior changed:** no. This is a documentation-only acceptance checkpoint.

---

## PFC-2026-09-12-049 — D4 integrated native texture-quality acceptance

Date: 2026-09-12

### Reviewed

- HeroForge.Compatibility `PROJECT_CONTRACT.md` and current `ACTIVE_CONTEXT.md`;
- current WITCH_DEV_UI texture-quality service/UI v0.1.0 from Dev commit `ee8a1a9c1ed283e95e61e64d92ac66b99695658a`;
- D4 clean integrated baseline and standalone-absent load state;
- Bridge #1735, #1737, #1738, #1739, and #1740;
- Amanda's live visual verdict on the integrated D4 result.

### Confirmed integrated load

- Dev service v0.1.0 / build `0.1.0-dev-hfc-alpha3-port` loaded once;
- Dev UI v0.1.0 / build `0.1.0-dev-texture-quality-controls` loaded once;
- standalone `HFNativeTextureReconcileTest` global was absent;
- D4 remained at native `4096x4096`, BL/BU `1024 bake / 512 used`, face `1024 / 1024`, no body mask overrides, scheduler idle before enable.

### Confirmed enable

One controlled Dev enable:

- returned true and left service ON / not busy / no error;
- adopted one expected HeroForge display/modded generation;
- verified native coherent `4096x4096` atlas;
- BL/BU/face allocations = `2048x2048`;
- BL/BU/face `_usedTextureSize = 2048`;
- actual bodyLower/bodyUpper color-bake masks = exact pinned `1024x1024` textures;
- scheduler idle after settle.

Amanda visually confirmed the integrated D4 result looks perfect: historical body color/glyph channel correct, body/face and decals sharp, no poop/corruption, and no wrong material/color/emissive channels.

### Confirmed disable / restore boundary

One controlled disable:

- returned true; service OFF / not busy / no error;
- all three target `atlasScale` overrides absent after native rebuild;
- bodyLower/bodyUpper `masksMapOverride` absent after native rebuild;
- atlas remained native coherent `4096x4096`;
- target `bakeSize` returned to 1024;
- scheduler idle.

HeroForge's native OFF rebuild recalculated D4 `_usedTextureSize` to `1024/1024/1024` rather than reproducing the original `512/512/1024` baseline. Because all feature-owned scale and mask overrides were absent, this is recorded as native post-restore recalculation rather than retained Witch Dock ownership. Exact baseline restoration of transient/native `_usedTextureSize` is therefore not claimed.

### Confirmed repeated lifecycle

A subsequent OFF -> ON enable passed again:

- service ON, no error;
- native 4096 atlas;
- BL/BU/face 2048 allocations and used sizes;
- exact 1024 body masks;
- scheduler idle.

### Remaining gate

Closed by PFC-050.

### Risk / unresolved nuance

The service's disable contract is now precisely stated: it removes/restores the source fields it owns and lets HeroForge rebuild natively. It does not guarantee the native engine will reproduce the exact pre-enable transient `_usedTextureSize` values after that rebuild.

**Runtime behavior changed:** no. This checkpoint only records live validation. Public Stable remains unchanged.

---

## PFC-2026-09-12-048 — Dev native texture-quality integration

Date: 2026-09-12

### Reviewed

- HeroForge.Compatibility `PROJECT_CONTRACT.md` and current `ACTIVE_CONTEXT.md`;
- `docs/policies/FEATURE_LIFECYCLE_TESTING_RELEASE.md`;
- validated standalone alpha.3 source and the standalone acceptance checkpoint;
- Blood Moon runtime/visual pass and D4 body-color/glyph runtime/visual pass;
- current Witch Dock Dev `MODULE_VERSIONING.md`, `MASTER.md`, `manifest.json`, `Witch_Dock_DEV.user.js`, Developer Mode registration pattern, and Spinny service/UI registration pattern;
- Dev baseline head `4cd8d15e49aee8e02b01f519ed32af579c94a277`.

### Confirmed upstream behavior to preserve

- high-resolution source policy does not require persistent giant/custom atlas ownership;
- native HeroForge reconciliation may settle at 1024 target allocations on high-pressure figures or promote to 2048 on lower-pressure figures;
- `_usedTextureSize=1024` is the minimum seed, not a required final value;
- bodyLower/bodyUpper masks are the critical fixed safety boundary and must remain real exact 1024 color-bake inputs;
- expected display/modded replacement during reconciliation is normal; actual character/data/target-part replacement is not;
- rollback restores owned source snapshots and rebuilds natively rather than restoring stale atlas objects.

### Decision

Promote the validated standalone behavior into WITCH_DEV_UI as two isolated v0.1.0 modules:

- a hidden service containing the native-reconcile lifecycle and diagnostics;
- a hidden loader/UI module that self-registers a visible `Texture Quality` tool under Utilities.

The service must load inert/OFF and must not change HeroForge until the user explicitly enables it.

### Target files

- `features/rendering/Texture_Quality_Native_Reconcile.js` — new;
- `features/rendering/Texture_Quality_Native_Reconcile_UI.js` — new;
- `manifest.json` — register/version/load both modules;
- `CHANGELOG.md` — this Dev runtime update;
- `PRE_FLIGHT_Check.md` — this record;
- `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md` — durable integration provenance/state.

### Conflict / preservation requirements

- Public `Witch_Scripts` must remain untouched;
- do not modify Witch Dock core, Dev loader, Booth, Black Canvas replay, Spinny, True Resolution, corrected decal gizmo, JSON, Utilities, or Developer Mode runtime source;
- no custom `CK.Atlas`, buildAtlas wrapper, direct atlas assignment, or persistent ownership watcher;
- no Compatibility/HF-Chat-Bridge runtime dependency;
- loading the module must not auto-enable texture changes;
- service failures must remain isolated and restore only state it owns;
- figure changes must not apply stale snapshots to the replacement figure;
- manifest canonical versions and source-local versions/builds must agree.

### Static gate

- service JavaScript syntax: PASS;
- UI JavaScript syntax: PASS;
- manifest JSON parse: PASS;
- unique registry/tool IDs: PASS;
- registry + loader entries for both new modules: PASS;
- forbidden ownership audit: PASS — no custom Atlas construction, buildAtlas assignment, direct atlas assignment, MutationObserver, or interval-based service watcher;
- service initial state OFF: PASS;
- exact 1024 body-mask pin/verification retained: PASS;
- native promotion 1024..2048 accepted: PASS;
- no Compatibility/Bridge runtime dependency: PASS.

### Required live Dev gate

Completed / PASS per PFC-049 and PFC-050.

### Rollback

Remove the two manifest entries and new rendering modules, or revert the single Dev integration commit. No Stable files are touched.

**Runtime behavior changed:** yes, Dev only in the preceding integration commit. Public Stable remains unchanged.

---

## Prior active history

`PFC-2026-09-08-047` and earlier remain preserved verbatim in Git history at Dev head `4cd8d15e49aee8e02b01f519ed32af579c94a277` and its ancestors.
