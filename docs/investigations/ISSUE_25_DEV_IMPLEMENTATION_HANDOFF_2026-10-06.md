# #25 — bounded all-part High Res Dev implementation handoff, 2026-10-06

**Disposition:** investigation complete enough for Dev implementation. No Stable promotion is authorized.

This handoff continues the [coverage closure](ISSUE_25_COVERAGE_CLOSURE_2026-10-04.md) and does not replace its earlier fixture evidence. The implementation owner must not repeat the completed source/allocation/normal-map discriminators.

## Narrow implementation objective

Extend Witch Dock High Res in Dev so that every eligible rendered part can receive:

1. the highest supported normal-map source appropriate to the selected quality target; and
2. enough per-host atlas/bake allocation to preserve that source detail;

without a global CreationKit patch, item-name allowlist, blanket scale multiplier, unbounded atlas growth, or quality loss on unrelated hosts.

Preserve the existing body/face owned path, mask/AAID behavior, multi-display lifecycle, rollback, readiness, and failure isolation. HF-Chat-Bridge remains development infrastructure only.

## Confirmed causal boundary — do not re-investigate

- Higher mask/AAID source files and larger atlas rectangles alone do not reproduce Lob's Full Res Decals quality.
- On Counting Sheep, the Corvidae Herald pauldrons and Celestial Circlet still displayed their 128 normal maps while occupying verified 512 atlas regions with 512 mask/AAID inputs.
- Replacing only those displayed normal bindings with verified 512 normal resources produced the accepted visual result; Amanda reported both looked phenomenal.
- This rejects `pixelsPerUnit`, output dimensions, a larger global atlas, and mask/AAID promotion as independently necessary for that observed gain.
- Lob's matching upstream behavior is the global source-selection multiplier (`var l=a?2:1` to `var l=4`). Witch Dock must reproduce the bounded result through owned resource loading and binding, not by intercepting or globally patching CreationKit.
- Source resolution and atlas density are both required. Increasing either one without the other can produce no meaningful improvement.

## Runtime census result

Seven fixtures were scanned through every entry in `CK.character.allDisplays`, every rendered mesh, and every `material.uniforms.normalMap` binding:

| Group | Fixture | Config |
|---|---|---:|
| NSFW nudes | Aowyn Nude v23 | `537376254` |
| NSFW nudes | Brandis Nude v14 Straight | `537116014` |
| NSFW nudes | Shaelynn Nude v3 | `537074906` |
| General | The Viper | `55782933` |
| General | Witch of the Wilds | `56462355` |
| General | D5 Wings | `58790613` |
| General | Counting Sheep | `56183436` |

Aggregate result:

- 7 fixtures, 8 displays, 542 rendered meshes/parts and 542 normal bindings;
- 515 direct source-path bindings plus 27 expected derived outputs;
- 398 part instances with a verified higher normal-source variant;
- candidate maxima: 38 at 256, 184 at 512, 156 at 1024, 7 at 2048, and 13 at 4096;
- no alternate normal-property bindings, no no-normal meshes, no mesh-only keys, no part-only keys, and no unexplained capture omissions.

The 27 non-URL names were expected body/face-derived outputs such as `normalMapBlendedTarget` and `customFaceRenderTargets.normal`; leave them with their specialized owner. The census covered anatomy, kitbashed anatomy, primitives, hair, braids, tails, wings, clothing, armor, headgear, weapons, shields, accessories, repeated kitbash objects, and multi-character scenes. Additional pre-build family census is not required.

Bridge evidence for this continuation is retained in `Knight-Witch/HF-Chat-Bridge` issues #4397–#4451. The compact aggregate is #4427–#4428; candidate-family reads are #4431–#4436; the Aowyn combined source/density probe and restoration are #4437–#4451.

## Generic mechanism proof

Aowyn's `campFireModern` kitbash body component supplied an uncatalogued control outside the Counting Sheep target list:

- baseline displayed normal: 32;
- baseline atlas allocation: 32×32;
- verified available normal source: 512;
- reversible per-host density target: scale 16, producing 512×512 allocation;
- generic URL-derived texture load and normal binding: 512×512;
- exact final restoration: scale `0.04`, `_usedTextureSize=32`, 32×32 allocation, original 32 normal binding;
- service after restoration: idle, `ON — 4096×4096`, no error.

Density reconciliation alone reached 512×512 allocation but left the displayed source at 32. The generic binder reached 512 for both. This proves a real application-coverage gap and proves that the same source/binding mechanism works on kitbashed anatomy without an item-name rule.

## Budget boundary

A fixed scale 4 is insufficient: observed desired/current allocation ratios include 2, 4, 8, and 16. A blanket promotion is also unsafe. A selective 512-default / 1024-for-proved-large-source simulation produced the following additional atlas pressure:

| Fixture | Additional packed area | Atlas growth |
|---|---:|---:|
| Viper | 0.91 MP | 2.9% |
| Brandis | 1.88 MP | 11.8% |
| Counting Sheep | 7.87 MP | 12.3% across two displays |
| Witch of the Wilds | 8.87 MP | 27.7% |
| Aowyn | 6.36 MP | 39.8% |
| Shaelynn | 8.12 MP | 50.7% |
| D5 Wings | 12.41 MP | 77.5% |

D5's dominant cost is 50 repeated `horseLong` placements: promoting that one repeated family from 256 to 512 adds about 9.38 MP. Aowyn and Shaelynn similarly contain many 32-pixel primitives that individually want 512 allocations. Source deduplication does not deduplicate atlas rectangles.

Therefore eligibility and source existence are not permission to promote every instance. Selection must be per display, instance-aware, and budgeted before mutation.

## Required Dev design boundaries

1. Enumerate live displays and rendered normal bindings dynamically; do not encode fixture or item names.
2. Classify URL-backed normal sources separately from derived body/face outputs.
3. Resolve candidate variants from the current versioned source URL, with negative-result caching and bounded probes.
4. Cache loaded promoted textures by resolved URL and share them where texture semantics permit. Do not create one duplicate GPU resource per host.
5. Compute each host's requested allocation from current allocation, ideal size, available source ceiling, configured quality ceiling, and remaining display budget. Do not assign a universal multiplier.
6. Model repeated instances before applying changes. Where related hosts must remain visually coherent, treat the group atomically or decline/downgrade it rather than silently promoting only an arbitrary subset.
7. Repack/validate before committing bindings. Never improve one selected host by shrinking unrelated native/core or previously protected hosts.
8. Snapshot exact pre-owned scale metadata, `_usedTextureSize`, normal uniform values, and owned cache/resource state. Restore exact native values on OFF, rollback, scene replacement, display destruction, or failed verification; do not overwrite later outside edits.
9. Preserve current High Res body/face, mask, AAID, color-bake, readiness, retry, multi-figure, and public lifecycle behavior.
10. Expose bounded diagnostic state for selected, downgraded, skipped, failed-source, and restored hosts so the future Witch Dev test surface can explain policy decisions.

## Implementation and regression sequence

Implement surgically on the existing `wd/25-texture-coverage` branch under the normal Dev workflow. Start with a narrow internal owner/service seam and tests; do not build the developer UI first.

Static/VM gates should cover candidate parsing, cache reuse, negative caching, target calculation, repeated-instance budgeting, no-collateral selection, exact rollback, outside-edit preservation, failure isolation, and multi-display cleanup.

Live Dev gates after implementation:

- Counting Sheep: two displays, accepted pauldrons/circlet/shield/braid/clothing controls, source sharing, and moderate pressure.
- D5 Wings: worst-case repetition; the budget must refuse or downgrade unsafe bulk promotion without stalling or growing blindly.
- Aowyn, Brandis, Shaelynn: NSFW kitbash anatomy, primitives, hair/tails, and the accepted high-detail braid/ear cases.
- Viper: dense-atlas no-collateral regression; preserve unrelated cape/ears/tongue and accepted rapier gain.
- Witch of the Wilds: clothing, circlet, antlers, hair, and repeated-part pressure.
- ON→OFF, reload, figure switch, add/remove part, missing variant, failed load, two-character scene, rollback, texture disposal, and memory recovery.

Human visual calibration is required only after the implementation produces deterministic selections: compare representative 512/1024 choices and decide whether the prioritization is visually appropriate. Stable remains out of scope until Dev passes the matrix and Amanda explicitly authorizes a narrow promotion.

## Current runtime and repository state

- Current HeroForge fixture at handoff: Aowyn `537376254`.
- All census mutations and the Aowyn combined probe were restored. The inspected component is back at scale `0.04`, `_usedTextureSize=32`, 32×32 allocation, and its original 32 normal.
- High Res service is idle and healthy at `ON — 4096×4096`; last error is null.
- Runtime census data remains temporary browser-local diagnostic state and is not a Witch Dock dependency.
- Before coding, fetch and integrate the latest `WITCH_DEV_MAIN` into `wd/25-texture-coverage` through the normal workflow. At this checkpoint canonical Dev had advanced to `0e6717a`; those unrelated HFJSON delivery commits were deliberately not merged as part of this documentation-only handoff.
- No runtime/module/manifest/public behavior changed by this documentation checkpoint.
