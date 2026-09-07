# Changelog

## DOCK-2026-09-07-039 — Add Dev Booth runtime bootstrap

Date: 2026-09-07

### Summary

Added a separate hidden Dev compatibility module that closes the saved-Booth fresh-page circular dependency without modifying Booth v27, Utilities v1.2.1, or the validated Black Canvas display replay.

### Confirmed diagnosis

- fresh HeroForge startup has no `BT` global before the native gated Booth core is loaded;
- Booth v27 still gates saved `CK.data.custom` Booth inspection behind an existing BT runtime;
- saved Booth Persistence can therefore be enabled while v27 cannot see the saved configuration needed to activate Booth;
- current public v27 reproduced the failure after the stale-manifest problem was cleared by hard refresh, proving this is a real v27 startup issue rather than old v24 code;
- the earlier standalone bootstrap probe already proved HeroForge's same-origin `/gated/booth.js` plus named `BT.setBoothMode(savedMode)` is a viable runtime activation seam.

### Changes

- added hidden `booth-runtime-bootstrap` v0.1.0 / build `0.1.0-dev-native-booth-bootstrap` at `features/booth/Booth_Runtime_Bootstrap.js`;
- bootstrap reads the existing saved Booth Persistence default and independently inspects `CK.data.custom` for strong saved Booth signals;
- bare camera state is explicitly excluded from eligibility;
- bootstrap requires four consecutive 200 ms observations of the same `CK.data` object, mode, and signal signature to avoid acting on HeroForge's transient figure-load state;
- when eligible and BT is absent, bootstrap loads only HeroForge's own same-origin gated `booth.js`;
- current HeroForge version is derived from loaded script/resource URLs rather than hard-coded;
- named `BT.setBoothMode(savedMode)` is required and used; no minified/Webpack seam is added;
- native engine enablement is verified through `BT.liveEngine || BT.maker`;
- after runtime activation, the existing `KW_WD_BOOTH` API reconciles default-owned Booth View and saved Black Canvas;
- module work is single-flight and exposes diagnostics plus `dispose()` through `KW_WD_BOOTH_BOOTSTRAP`;
- Dev manifest orders bootstrap before Booth and adds version query keys to Dev Booth, Utilities, replay, and bootstrap module URLs so module fetches cannot reuse older responses once the current manifest is loaded.

### Preserved boundaries

- `tools/Booth.js`: unchanged v27.0.0 / build `v27`;
- `tools/Utilities.js`: unchanged v1.2.1;
- `features/booth/Black_Canvas_Display_Replay.js`: unchanged v0.1.0 Dev runtime;
- Corrected Bound Decal Gizmo, Spinny Mini WebP, High Res Image Capture, JSON, Developer Mode, Decals host, and tab infrastructure unchanged;
- public `Witch_Scripts` unchanged;
- HF-Chat-Bridge remains development-only and is not a runtime dependency.

### Validation

- JavaScript syntax: PASS.
- Saved-figure mock: PASS — native `portrait` mode bootstrap, engine enable verification, Black Canvas reconciliation.
- Fresh-camera-only mock: PASS — no script insertion/bootstrap.
- Live Dev startup validation: pending.
- Public shell/manifest cache-busting repair: still pending separately; this commit only adds version keys to Dev module URLs after manifest load.
- No Dev GitHub Actions workflow exists; no CI claim is made.

### Rollback

Remove/disable the `booth-runtime-bootstrap` manifest entry or revert this Dev commit. Booth v27 and the Black Canvas replay are not modified by this feature.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

Historical changelog through DOCK-2026-09-07-038 remains preserved in Git history at Dev commit `12383ca5a551acb1a6bf330f7cfad8ea68a82ad1`.
