# Pre-Flight Check Log

This active Stable pre-flight log is intentionally compact. Detailed prior records through `PFC-2026-09-08-030` remain preserved in Git history at Stable head `2d0304dccc241ae5d493563bdca00a036257e362` and earlier.

## PFC-2026-09-14-033 — Accepted multi-figure Texture Quality Stable promotion

Date: 2026-09-14

### Scope

Promote only the accepted Texture Quality service/UI from `WITCH_DEV_UI` into public `Witch_Scripts`, plus the required two registry entries, two Stable cache-keyed loader URLs, and release logs. Do not merge unrelated Dev work or the separate Texture Quality beta notice.

### Reviewed

- `PROJECT_CONTRACT.md`, `ACTIVE_CONTEXT.md`, and `MODULE_VERSIONING.md` on `WITCH_DEV_UI`;
- Dev head `29758cd2f7830624a18720a55e92e1adbd8fc8af`;
- protected Stable parent `c93485d741fe9d1801b0f6924b7204a8d922792c`;
- accepted runtime commit `edd276b21af4ee4ce354857b09e5e7340fd007ad`;
- exact Dev Texture Quality service/UI and corresponding Stable v0.1.0 files;
- Stable `manifest.json`, `CHANGELOG.md`, and this pre-flight log.

### Exact promoted source identity

- service v0.3.4 / build `0.3.4-dev-native-color-material-setup`, blob `cf2f5974177a65bc6a5419ace824cc9565b79710`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`, blob `863b5ccb4f76ffac105f2e0f8d3f46ac8a37ff94`;
- Stable candidate reuses those accepted Dev blobs byte-for-byte; no runtime logic is rewritten during promotion.

### Static / manifest gate

Before moving Stable:

- `node --check` passed on both exact Dev runtime blobs;
- local Git blob hashing reconfirmed both source SHAs exactly;
- candidate `manifest.json` parses successfully;
- module registry IDs are unique and tool IDs are unique;
- candidate Texture Quality URLs point to `Witch_Scripts`, never `WITCH_DEV_UI`;
- cache keys match service v0.3.4 and UI v0.2.0 build identities;
- public shell and every unrelated Stable module remain inherited byte-for-byte from parent.

### Changed-file whitelist

The promotion candidate may differ from Stable parent in exactly five files:

1. `features/rendering/Texture_Quality_Native_Reconcile.js`;
2. `features/rendering/Texture_Quality_Native_Reconcile_UI.js`;
3. `manifest.json`;
4. `CHANGELOG.md`;
5. `PRE_FLIGHT_Check.md`.

No `HISTORY` file is required by the current router; no unrelated Dev feature is part of this promotion.

### Validated behavior being preserved

- primary-only `Data.change()`;
- HeroForge parent-owned child display propagation;
- session-global first snapshots for shared Part objects;
- native `colorBake.paints.setupMaterials('color')` material refresh;
- dynamic three-figure membership handling;
- persistent preference with fresh readiness/reconcile per page/figure;
- owned-state restore without direct atlas/uniform/sim takeover;
- atlas scale 4, bake target 2048, source/allocation floor 1024, with native promotion toward 2048 when atlas pressure permits.

The accepted 1030% stress result is explicitly valid when a pressured target remains at 1024 while other allocations promote to 2048.

### Post-promotion gate

After the branch move, load actual `Witch_Scripts` Stable and use HF-Chat-Bridge for the narrow runtime smoke: confirm service/UI identity, renderer readiness/idle state, High Res enable across the current scene if available, verification/material sanity, Disable/restore, and final state. Bridge mutations remain at-most-once; if execution is uncertain, read state back before any retry.

If Stable differs from the accepted Dev behavior, stop and diagnose rather than widening public scope.

### Rollback

Revert this single Stable promotion commit or fast-forward Stable to a clean revert of it. No unrelated module is included, so rollback is limited to the two Texture Quality blobs, their manifest wiring, and these release records.

**Runtime behavior changed:** yes — Texture Quality advances from public v0.1.0 to accepted service v0.3.4 / UI v0.2.0.

---

## PFC-2026-09-12-032 — Final public Stable Texture Quality acceptance

Date: 2026-09-12

### Scope

Close the public release gate after the promoted Texture Quality v0.1.0 service/UI passed a clean Stable runtime smoke and Amanda's final visual confirmation.

### Reviewed

- Stable promotion commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`;
- public Stable service/UI exact promoted blobs;
- Bridge #1747 clean public baseline/topology;
- Bridge #1748 one controlled Stable enable/readback;
- Bridge #1750 targeted accessory/topology smoke;
- Amanda's final public visual verdict: “looks great!”

### Confirmed public load

With Witch Dock Dev disabled and the standalone Native Texture Reconcile test absent:

- Stable Texture Quality service/UI v0.1.0 loaded successfully;
- feature started OFF/inert;
- no target `atlasScale` override existed;
- no body `masksMapOverride` existed;
- Blood Moon baseline was native coherent `4096x4096`;
- bodyLower/bodyUpper were `bakeSize=1024 / used=512`, face `1024 / 1024`;
- scheduler was idle;
- exactly one `/gated/booth.js` runtime remained, with BT and Booth bootstrap present.

### Confirmed public enable

One controlled call to `KWTextureQualityNativeReconcile.enable()`:

- resolved true;
- service remained ON / not busy / no error;
- `lastVerification.ok=true`;
- one expected native HeroForge generation replacement was adopted;
- display/resource atlas identity was coherent at `4096x4096`;
- bodyLower/bodyUpper/face allocations = `1024x1024`;
- bodyLower/bodyUpper/face `_usedTextureSize = 1024`;
- actual bodyLower/bodyUpper color-bake masks = exact pinned `1024x1024` textures;
- both mask overrides matched the pinned expected resources;
- scheduler returned idle.

### Confirmed public accessory / integration smoke

Targeted read-only scan after Stable enable found:

- 16 Discus instances, 0 broken/fallback resource sets;
- 2 Short Crown Horn / `spikeSmall` instances, 0 broken/fallback resource sets;
- 3 Celestial Circlet / `starCirclet` instances, 0 broken/fallback resource sets;
- exactly one Booth runtime still loaded;
- BT/bootstrap still present;
- Texture Quality still ON.

Amanda visually confirmed the final Stable Blood Moon result looks great, including body texture, decals, accessory color/material/emissive channels, and no poop/corruption.

### Persistence behavior recorded

v0.1.0 is intentionally non-persistent:

- normal renderer refresh on the same figure can remain ON and adopt the replacement generation;
- page reload creates a fresh OFF service;
- figure change is detected by the service/UI refresh loop, clears stale session bookkeeping, and reports OFF for the new figure;
- this prevents stale figure snapshots crossing character boundaries.

A persistent user preference with fresh per-figure reconciliation is the logical next enhancement, but is explicitly outside this release closeout and requires a separate Dev-first change/test cycle.

### Decision

Public Stable Texture Quality v0.1.0 release gate: **PASS / CLOSED**.

No additional runtime edits are required for this release. The promoted runtime remains exactly the Dev-validated blobs.

**Runtime behavior changed by this checkpoint:** no. Documentation only.

---

## PFC-2026-09-12-031 — Stable native Texture Quality promotion

Date: 2026-09-12

### Scope

Promote only the fully Dev-validated Texture Quality native-reconcile service/UI from `WITCH_DEV_UI` into public `Witch_Scripts` after explicit user authorization.

### Reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md` and refreshed `ACTIVE_CONTEXT.md`;
- Compatibility release checkpoint `9bced7c9042133f766bfd47b672bdfcd845fbcd0`;
- current Stable head `2d0304dccc241ae5d493563bdca00a036257e362`;
- current Stable `manifest.json`, public shell v1.2.1 loader contract, `MODULE_VERSIONING.md`, `CHANGELOG.md`, and `PRE_FLIGHT_Check.md`;
- Dev Texture Quality service/UI v0.1.0 exact source blobs;
- Dev integrated D4 and Blood Moon runtime/visual/lifecycle evidence;
- Dev refresh/topology smoke;
- Amanda's explicit “go for it” approval for Stable promotion.

### Confirmed source identity

- service blob: `f1891bb266ea1e8f03101d96b43bc9d38de3fa46`;
- UI blob: `2c781d4c8e0a0ae472187512875d7db369897c7f`;
- both are the exact Dev-validated runtime blobs; Stable promotion does not rewrite their logic;
- canonical registry versions remain v0.1.0 because promotion itself does not alter the module behavior.

### Confirmed Stable loader compatibility

- public shell is already v1.2.1 / build `1.2.1-stable-cache-keyed-loader`;
- no public shell change or version bump is required;
- manifest-loaded hidden service/UI modules are already a supported public pattern;
- new public raw URLs must use `Witch_Scripts`, never `WITCH_DEV_UI`;
- cache identity is carried in the explicit v0.1.0 build query strings.

### Candidate manifest proof

The Stable manifest was reconstructed byte-for-byte from the current public file before insertion. Removing the two Texture Quality registry entries and two Texture Quality loader entries from the candidate reproduces the current Stable manifest blob SHA exactly: `53b06b4a447adadd380ac733d819ac8d7bd6c4fe`.

Therefore the intended manifest delta is limited to:

1. `texture-quality-native-reconcile` registry entry;
2. `texture-quality-native-reconcile-ui` registry entry;
3. Stable service loader entry;
4. Stable UI loader entry.

### Preservation requirements

- no wholesale Dev merge;
- public shell v1.2.1 byte-unchanged;
- Booth, Black Canvas replay, Booth runtime bootstrap, Spinny, True Resolution, Corrected Bound Decal Gizmo, JSON, Utilities, Developer Mode, Body, Pose, Decals, and all other runtime blobs unchanged;
- no custom atlas ownership, buildAtlas wrapping, direct atlas assignment, or watcher reintroduced;
- no runtime dependency on HeroForge.Compatibility or HF-Chat-Bridge;
- source + manifest + changelog + preflight + durable history land in one atomic Stable commit.

### Dev validation inherited

D4 integrated validation passed with native 4096 atlas, target allocations/used 2048, exact pinned 1024 masks, correct body color/glyph visuals, clean disable, and repeated OFF -> ON enable.

Blood Moon integrated validation passed with native 4096 atlas, target allocations/used 1024, exact pinned 1024 masks, correct visual accessory/body/decal result, zero broken/fallback resources across the known problem families, successful native character refresh while ON, and no duplicate Booth runtime in the topology smoke.

### Stable candidate gate

Before moving `Witch_Scripts`:

- candidate parent must equal `2d0304dccc241ae5d493563bdca00a036257e362`;
- candidate changed-file whitelist must be exactly six files;
- candidate source blob SHAs must equal the Dev-validated SHAs above;
- candidate manifest JSON must parse with unique registry/tool IDs;
- public Texture Quality URLs must contain `Witch_Scripts` and no `WITCH_DEV_UI` reference;
- no unrelated runtime file may differ.

### Post-promotion gate

After moving public Stable, perform a normal public userscript update/reload with the Dev userscript disabled, verify the Stable service/UI load exactly once and start OFF/inert, then run one controlled enable/readback and human visual check on the currently loaded acceptance figure. If the Stable smoke fails, stop and repair in Dev rather than broadening the public patch.

### Rollback

Revert the single Stable promotion commit. Because no existing module is modified, rollback removes the two manifest entries and two new rendering files without migrating stored state.

**Runtime behavior changed:** yes — public Stable gains the opt-in Texture Quality service/UI only.

---

## Prior Stable pre-flight history

`PFC-2026-09-08-030` and earlier remain preserved verbatim in Git history at Stable head `2d0304dccc241ae5d493563bdca00a036257e362` and its ancestors.
