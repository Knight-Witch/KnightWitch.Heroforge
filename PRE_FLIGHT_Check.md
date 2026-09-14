# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-13-062 — Multi-figure lifecycle handoff freeze

Date: 2026-09-13

### Scope

Freeze the exact continuation state after diagnosing Texture Quality's non-primary display-adoption gap and live-testing an uncommitted v0.3.2 candidate, without changing runtime code.

### Reviewed

- current `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`;
- committed Texture Quality service v0.3.1 source and current manifest registry;
- HeroForge root `character.refresh()` / `character.update()` source through HF-Chat-Bridge;
- extra-display `change()` / `update()` behavior through bounded live probes;
- clean three-figure baseline after reload;
- live-only v0.3.2 candidate behavior while HeroForge was backgrounded;
- at-most-once Enable result and post-failure restore readback.

### Confirmed findings

- Root HeroForge update orchestration calls `display.change(data)` for the root/primary display only; it does not independently arm every extra display after an extra figure's `modded.buildAtlas()` changes its resource atlas.
- `display.change(display.data, true)` is a valid native extra-display adoption seam: it adopted the rebuilt atlas and set `display.needsUpdate=true` without direct atlas assignment.
- Direct child `display.update()` is not safe as a service seam; the live probe threw inside HeroForge material handling (`clutPath`).
- The hot-loaded v0.3.2 candidate added native `display.change(data, true)` for non-primary reconcile/restore and eliminated the original extra-figure display/resource atlas split.
- The candidate test ran backgrounded; HeroForge did not finish the child render/update cycle before the existing 120-second settle timeout.
- Last readback (#1991) still showed root `_needsUpdating=true`; both extras were atlas-coherent at 4096×4096 but had `needsUpdate=true` and `finished=false`.

### Handoff gate

The next chat must begin with a non-mutating runtime readback. Do not replay Enable/Disable/reconcile or child lifecycle mutations blindly. If child work remains pending, foreground HeroForge and allow its normal render loop to run before re-reading state. If recovery requires a reload, verify the clean v0.3.1 OFF/native baseline before re-hot-loading or testing v0.3.2.

A v0.3.2 runtime commit is allowed only after a foreground three-figure Enable and Disable/restore both finish coherently. If committed, normal module version/build, manifest/cache key, changelog/preflight, syntax/static validation, and narrow live regression requirements apply.

Public Stable remains untouched.

**Runtime behavior changed:** no — documentation-only handoff.

---

## PFC-2026-09-13-061 — Multi-figure native mask capability + bounded loader

Date: 2026-09-13

### Scope

Keep the v0.3.0 count-agnostic multi-figure architecture, but make its body-mask prerequisite valid for HeroForge species whose real mask assets top out below 1024px and prevent resource promises from wedging Enable before native reconcile starts.

### Reviewed

- current `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`;
- `MODULE_VERSIONING.md` and current manifest registry;
- exact v0.3.0 multi-figure service source;
- live three-figure scene: primary + Colliefolk + raccoonfolk;
- body source ceilings and mask paths/resources for the two extra figures;
- Bridge/Power state after the hung diagnostic and a clean page reload.

### Confirmed diagnosis

- Multi-figure enumeration itself works: the live scene exposes `""`, `baseItem`, and `baseItemB`.
- Both extras use bodyUpper part 11181 (`furryClaws`). Its native `bakeSize` is 512.
- `furryClaws_mask_512.webp` exists and loads as 512×512; the 1024 and 2048 variants are 404.
- v0.3.0's exact-1024-mask prerequisite is therefore invalid for these otherwise supported figures.
- The first native-size diagnostic still hung at `Preparing native reconcile…` while the HF scheduler was idle because it awaited a `CK.Resources.getResource()` promise that did not resolve.
- Reload restored a clean v0.3.0 OFF scene with all three figure displays intact and Bridge Power idle/healthy.

### Candidate change

- service v0.3.1 / build `0.3.1-dev-bounded-mask-capability`;
- choose body mask size from the part's pre-policy native bake ceiling, capped at the existing 1024 preference;
- preserve High Res source policy at scale 4 / bake 2048 / used-size seed 1024;
- request masks through `CK.Resources.getResource()` but do not await its promise; bounded-poll `getNow()` for the exact expected dimensions;
- verify exact per-body pinned mask dimensions from the selected supported size.

### Required live validation

1. Load exact v0.3.1 with Persistent OFF on the clean three-figure scene.
2. Manual Enable must complete without hanging and verify all three pipelines.
3. Primary body masks should remain 1024 where supported; Colliefolk/raccoonfolk `furryClaws` bodyUpper should pin 512 exactly.
4. Confirm every figure has coherent native display/resource atlas identity, valid 1024–2048 target allocations, and idle root scheduler.
5. Exercise add/remove membership while High Res is ON.
6. Reload a known scene with Seya non-primary and require visible quality improvement before any Stable promotion.

Public Stable remains untouched.

**Runtime behavior changed:** yes, Dev Texture Quality mask capability/loading and verification.

---

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