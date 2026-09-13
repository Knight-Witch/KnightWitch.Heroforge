# Pre-Flight Check Log

This active Stable pre-flight log is intentionally compact. Detailed prior records through `PFC-2026-09-08-030` remain preserved in Git history at Stable head `2d0304dccc241ae5d493563bdca00a036257e362` and earlier.

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
