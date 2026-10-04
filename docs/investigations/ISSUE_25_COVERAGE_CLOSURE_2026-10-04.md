# #25 — coverage closure, 2026-10-04

Status: active Dev implementation and live validation. This record extends, never replaces, the [2026-10-03 evidence](ISSUES_25_7_HIGH_RES_AND_CONNECTION_2026-10-03.md). No Stable promotion is authorized.

## Evidence anchors and scope

Retain reports HFBR-20261003-EZM4RA66, HFBR-20261003-SMN3DAKH, and HFBR-20261003-LC59QEDX. LC59QEDX contains five separate submitted saves, not one five-character scene. Eight attached native JSONs plus Nyrethax's child were inventoried previously; private source files remain private. #32's supported body-AAID binding is shipped and preserved. #34's native-mask verifier hypotheses remain unproved; do not suppress its failures.

Sole ACTIVE PROTECTED branch: `wd/25-texture-coverage`, registered before implementation at `798120f`. Initial live source: Native Reconcile 0.4.1 / Active Decal Priority 0.1.1; native build heroforge06.1.10.6. Bridge #3917 health, #3918 state. Stable source comparison shows only the accepted Dev diagnostic seam in Native Reconcile; Active Decal Priority matches Stable before these edits.

## Confirmed fault and scoped Dev changes

Persistent enable and scene membership sync call lexical core functions, bypassing the public service wrappers. Active Decal Priority owns 8192×4096 maximum settings and accessory scales, but its wrapper does not run before those internal calls. Prior Bath automatic failure at 4096² is retained.

Discriminator: Bath loaded OFF with persistent=false. Calling the existing wrapped public enable (#3936/#3937) passed both figures. The primary atlas became 8192×4096, child 4096²; before enable their atlases were 4096² and 4096×2048. Both supported AAID wrappers verified. This requires no 64 MP allocation and demonstrates an existing owner-entry gap rather than absent source data.

Dev Native Reconcile 0.4.2 routes automatic enable and scene sync through the public owned entry, preserving readiness waits, retry gates, original source/mask/AAID policy, settle checks and rollback. Active Decal Priority 0.1.2 treats scale 4 as a floor; it does not lower manual values and does not restore over later outside edits. Outside edits below the floor become the new rollback baseline. Four focused VM tests verify public entry dispatch after the original stable-readiness interval and manual/external-scale restoration. Live patched gates are still required.

## Matrix and packing evidence

[Family matrix](ISSUE_25_COVERAGE_MATRIX_2026-10-04.csv) retains the 147-family catalog and adds eight actual sided runtime aliases missing from that source catalog. Each row explicitly gives classification, evidence scope and remaining evidence. Catalog-only UNKNOWN rows are not claimed as live failures, nor silently omitted. [Wilds instance packing](ISSUE_25_WILDS_PACKING_2026-10-04.csv) records every one of the 56 packed hosts, source identity, declared native source ceiling, sticky used size, dimensions, pixels and repeats. Declared source size is not decoded source proof.

Wilds occupies 24,071,168 / 33,554,432 packed pixels (71.74%). Eleven `braidHorse` tail instances share source ID 25351 but consume eleven separate 512² rectangles: 2,883,584 pixels, 8.59% of the entire atlas. Three `baldPonytailLong` copies consume 196,608 pixels; two rings consume 2,048. Native bodyUpper and bodyUpper0 share ID 1963 but have separate 2048² and 512² allocations. Source deduplication does not deduplicate atlas rectangles.

CPU-only native Atlas trial (#3928/#3929) at the same 8192×4096 budget with chest/chestOuter/legsOuter scale 4 changes each from 512² to 1024²; bodyUpper remains 2048². This adds 2,359,296 packed pixels for those hosts and provides four times their packed texels. Complete no-regression comparison and actual bound-source/visual/performance validation remain gates; CPU allocation is not a claim of visible image improvement. Existing 32→64 MP trials that provided no allocation gain remain negative evidence against blanket budget increases.

## Benefit categories — kept separate

1. **Higher source exists:** prior decoded 4096 tree/creature triples, verified selected 2048 clothing/hair/tail/wing/weapon sources. Existence is per resolved source URL, not per whole category.
2. **Measurable quality gain:** candidate clothing has measured 4× packed pixel gain in native CPU packing; visible improvement and decoded bound images remain unaccepted.
3. **Promotable but costly:** repeated 589-tail Twilight and dense Tsuyilia hosts have severe packing pressure; no blanket promotion. Native data textures have a distinct semantic role and must not be enlarged for cosmetic detail.
4. **No meaningful higher raster source:** collision/solid data and shader/lookup resources have no inferred detail gain from a larger atlas. Isolated source 404s do not prove an entire family lacks higher variants.

Eight RGBA8 baker targets cost 512 MiB/1 GiB/2 GiB base per character at 16/32/64 MP, before depth, mipmaps and other resources. Bath's successful mixed 32+16 MP configuration implies 1.5 GiB base atlas storage, not 1 GiB scene-wide. Physical residency/FPS is not measured. 16384 is the observed hardware dimensional limit, not a practical memory budget. No universal practical maximum or automatic 64 MP policy is established.
