# Pre-Flight Check Log

This active pre-flight log is intentionally compact. Detailed records through `PFC-2026-09-08-047` remain preserved in Git history at Dev head `4cd8d15e49aee8e02b01f519ed32af579c94a277` and earlier.

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

1. install/update Witch Dock Dev and disable the standalone alpha to prevent double ownership;
2. clean reload: verify service/UI load exactly once, service OFF, and native figure baseline unchanged;
3. enable once on Blood Moon; verify native coherence and human visual result;
4. disable once and verify native restore/idle state;
5. enable once on D4 or equivalent body-glyph figure; verify exact pinned masks, accepted native promotion, and human body color/glyph result;
6. smoke Witch Dock/Booth/other existing tools for obvious regression;
7. only then consider an explicit Stable promotion.

### Rollback

Remove the two manifest entries and new rendering modules, or revert the single Dev integration commit. No Stable files are touched.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

## Prior active history

`PFC-2026-09-08-047` and earlier remain preserved verbatim in Git history at Dev head `4cd8d15e49aee8e02b01f519ed32af579c94a277` and its ancestors.
