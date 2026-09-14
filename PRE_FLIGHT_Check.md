# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-13-060 — Multi-figure Texture Quality candidate

Date: 2026-09-13

### Scope

Extend the validated Texture Quality native-reconcile recipe to all current HeroForge figure displays without hardcoding the vanilla figure count and without changing atlas ownership or texture policy.

### Reviewed

- current `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`;
- `MODULE_VERSIONING.md` and current manifest registry;
- Texture Quality service v0.2.4 / `0.2.4-dev-heavy-native-settle`;
- Texture Quality UI v0.2.0 compatibility with the existing service API;
- live one-, two-, and three-figure HeroForge runtime structure through HF-Chat-Bridge;
- extra-figure `data.change()` and `modded.buildAtlas()` lifecycle seams plus root `CK.character.refresh()` behavior.

### Confirmed diagnosis

Texture Quality v0.2.4 resolves only `CK.character.data` / `CK.character.display`, so it can verify the primary figure while figure 2/3 remain native-low-res. HeroForge stores extras in `CK.character.allDisplays`: figure 2 appeared as `baseItem`, figure 3 as `baseItemB`; each is `data.primary=false` with independent data/modded/meshes/atlas/resourceAtlas state. This directly explains Seya remaining visually low quality when she was the second figure.

### Candidate change

- service v0.3.0 / build `0.3.0-dev-multifigure-native-reconcile`;
- enumerate the primary display plus every unique compatible display in `CK.character.allDisplays`;
- preserve the existing per-figure High Res recipe exactly: atlasScale targets 4, bake 2048, used-size seed 1024 minimum, exact 1024 body masks;
- run each figure through its own native data/modded seams, then use one root HeroForge refresh;
- settle and verify the entire active figure set, not only the primary display;
- add count-agnostic scene membership resync for figures added/removed while High Res is active;
- keep primary-shaped verification fields for the existing UI while adding `figureCount` and per-figure verification records.

### Static checks already passed

- candidate JavaScript parses with `node --check`;
- a three-display mock runtime reports `figureCount=3`, coherent primary capability, and no initialization error;
- UI module is unchanged and remains API-compatible;
- manifest service version/build/cache key are updated to v0.3.0.

### Required live validation

1. Hot-load exact v0.3.0 on the current clean three-figure Dev scene with Texture Quality initially OFF.
2. Manual Enable must verify all three figure pipelines, exact 1024 body masks, valid target allocations, coherent native atlases and idle root scheduler.
3. While still enabled, add/remove a figure and confirm dynamic scene resync discovers the membership change without hardcoded count logic.
4. Reload a known multi-figure scene with Seya as a non-primary figure; require visible quality improvement on Seya plus per-figure technical verification.
5. Repeat a heavy extra-figure case such as Twilight Soak if practical before Stable promotion.

No Stable promotion until the multi-figure visual gate passes.

**Runtime behavior changed:** yes, Dev Texture Quality figure scope and dynamic scene reconciliation.

---

## PFC-2026-09-13-059 — Heavy native settle budget

v0.2.4 raised the native settle budget to 120 seconds while preserving scheduler/finished/resources-ready/atlas-identity/target-allocation requirements. Seya's false timeout path was closed before this multi-figure investigation.

---

## PFC-2026-09-13-058 — Persistent High Res stable-readiness gate

v0.2.3 waits for renderer/atlas quiescence and a stable figure signature before automatic Persistent enable.

---

## Prior current preflight

PFC-2026-09-13-057 and earlier remain preserved in Git history. Fetch only when a current task needs their specific evidence.
