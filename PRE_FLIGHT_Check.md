# Pre-Flight Check Log

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-09-06-024 — Canonical Witch Dock module version registry

Date: 2026-09-06

### Target files

- `manifest.json`
- `features/core/Witch_Dock_Developer_Mode.js`
- `MODULE_VERSIONING.md` (new)
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- current `WITCH_DEV_UI` head `f221580fc7d3e5ecc085c15b47f7010c1f2216c9`;
- current Dev Developer Mode v0.1.0 source/API;
- current Dev manifest and all active manifest-loaded module entries;
- current public `/tools/` runtime inventory;
- current public `/HeroForge_UI/` runtime inventory, including conditional `Expanded_Decal_Slots.js`;
- existing identifiers: Witch Dock v1.0.8, Body Editor v4, Booth v24, Scroll Guards `2026-07-03-layouts`, Corrected Bound Decal Gizmo 1.1.0, High Res service 0.7.0, readiness 1.0.0, and High Res UI 0.2.0;
- user request that every Witch Dock module have an identifiable version and future module updates bump it appropriately.

### Confirmed findings

- Active modules do not currently use one consistent version source.
- Editing every Stable runtime file only to inject a version constant would create unnecessary regression surface.
- `manifest.json` is already the canonical active loading inventory and can carry ignored metadata without changing the loader contract.
- Developer Mode can read that canonical registry and combine it with runtime-declared builds.
- Archived/reference/probe files should not receive active module versions.

### Version assignment policy

- Preserve existing explicit numeric versions.
- Normalize legacy numeric tags without inventing intermediate history: Body Editor `v4` -> `4.0.0`; Booth `v24` -> `24.0.0`.
- Preserve non-semver build tags separately.
- Give active modules with no trustworthy numeric version a documented `1.0.0` tracking baseline dated 2026-09-06.
- Baselines are current tracking anchors, not historical release-count claims.

### Implementation plan

1. Add canonical `moduleRegistry` metadata to Dev `manifest.json`, covering core, all active manifest modules, and conditional Expanded Decal Slots.
2. Advance Developer Mode to v0.2.0 and display canonical module versions.
3. Preserve/display runtime build tags when available.
4. Add Developer-only `Module Versions` list in About for hidden/conditional modules too.
5. Add `MODULE_VERSIONING.md` as the binding maintenance rule.
6. Keep all Stable feature source files byte-for-byte unchanged.

### Material conflict risks

- Registry values must not be mistaken for reconstructed historical releases; provenance is recorded.
- Registry fetch failure must remain diagnostic-only.
- Dev registry URL must be changed to `Witch_Scripts` when promoted.
- Future source commits must not forget the same-commit canonical version bump.
- No HF-Chat-Bridge or active Spinny interaction is needed.

### Test status before commit

- Developer Mode v0.2.0 `node --check`: PASS.
- Dev manifest JSON parse: PASS.
- Registry ID uniqueness: PASS.
- Every Dev manifest tool ID has a registry entry: PASS.
- Live canonical-version display: pending.

### Recommended action

Commit registry, Developer Mode v0.2.0, versioning contract, and docs as one Dev-only checkpoint. Do not modify Public Stable module sources for bookkeeping alone. Smoke-test registry display before promotion.

**Runtime behavior changed:** Developer Mode Dev diagnostics only. Existing Stable Witch Dock modules and HeroForge behavior are unchanged.

---

## PFC-2026-09-05-023 — Modular Witch Dock Developer Mode

Date: 2026-09-05

- Added Developer Mode as a separate hidden module with About toggle and reversible `WitchDock.registerTool` metadata wrapper.
- Updated High Res Image Capture UI to expose provider recovery/build diagnostics only in Developer Mode.
- Local syntax checks passed; public Stable remained unchanged.

**Runtime behavior changed:** Dev-only diagnostics/presentation.

---

## PFC-2026-09-05-022 — High Res Image Capture UI cleanup and default Decals tab order

Date: 2026-09-05

- Kept Stable 4K/8K capture engine untouched.
- Added compact High Res UI target and hid provider implementation controls from normal users.
- Moved Decals before JSON in Dev registration order.

**Runtime behavior changed:** Dev-only presentation/default order.

---

## PFC-2026-09-05-021 — Record public Photo Booth smoke acceptance

Date: 2026-09-05

- Public HeroForge/Lob 4096/8192 and direct Witch Dock TRUE 4K/8K passed.
- Readiness adapter passed without repair-toggle cycling.

**Runtime behavior changed:** no.

---

Historical pre-flight records through PFC-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.
