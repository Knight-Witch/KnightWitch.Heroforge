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

## Patched Dev continuation — 2026-10-04

The paired Dev v1.16.2 payload `b84bc414` is live. Bath automatically enables both characters and verifies ON (#3947–#3948): the primary atlas reaches 8192×4096 and the child has its own atlas. Wilds automatically enables and verifies ON after a clean reload (#3960–#3962). This closes the original automatic-entry discriminator without repeating the wrapped-entry experiment. Bath OFF still reports `primary: bodyUpper native source/allocation was not restored` (#3949–#3951). That is a separate restore warning under #34's ownership; it has not been proved cosmetic or corrected. It does not invalidate the ON coverage pass. Wilds reload removed temporary manual scales and retained persistent=true.

Riptide's submitted URL `59516180` loaded with native character name `KBP Riptide E` (#3963–#3964, identity readback #3991). Its [86 live packed hosts](ISSUE_25_RIPTIDE_PACKING_2026-10-04.csv) occupy 19,070,336 / 33,554,432 pixels (56.83%) in the 8192×4096 atlas. Eight active decal hosts already receive the owned scale policy (#3970–#3971). Eleven `braidHorse` tail placements share source ID 25351 but consume 2,183,168 separate packed pixels; three `mediumSweptBackTextured` placements share ID 25688 and consume 2,162,688 separate pixels. Two decal-owned copies of the latter pack at 1024²; undecorated `k_21` of that exact source packs at 256². This is a host-level coverage gap, not proof that the whole hair family lacks source data.

The CPU-only native Atlas comparison (#3975–#3976) gave `k_21` 256→1024, `k_47` legs 512→1024, and `k_57` chest 256→1024 at the same 8192×4096 budget. All other 83 packed rectangles were unchanged. Occupancy increased by 2,752,512 pixels to 21,822,848 (65.04%). A bounded live manual trial (#3977–#3978) reached the same three 1024² allocations while the 2048² bodyUpper and High Res verification remained intact. These are structural allocation gains; visible seam/quality improvement and real performance are not yet accepted. The trial is transient page state, not an implemented automatic policy.

Shaelynn's submitted URL `537074906` loaded with native character name `Shaelynn Nude v3` (identity #3993). Its [82 packed hosts](ISSUE_25_SHAELYNN_PACKING_2026-10-04.csv) occupy 11,316,736 / 16,777,216 pixels (67.45%) at 4096²; four hosts have active decal priority (#3982). The actual host inventory includes 20 hair placements, 23 primitive placements, paired wings, and small gear. It adds loaded evidence for neck and tongue texture families, while leaving their higher-source visual benefit unresolved.

The Aowyn URL `536130261` displayed HeroForge's failed-or-deleted figure popup according to Amanda. The subsequent 16-part ready state (#3985–#3987) is not accepted as Aowyn; its generated inventory was excluded from the matrix and no packed result is claimed. A current accessible save or the submitted native JSON is required before an Aowyn visual/packing gate. This figure-load failure is not an isolated native `.ckb`/AAID URL or a reproduction of issue #7's warning.

The [live matrix](ISSUE_25_COVERAGE_MATRIX_2026-10-04.csv) now holds the 147 source families, eight sided runtime aliases, and 11 additional runtime roles. It records Bath, Riptide and Shaelynn instance counts, source/packed dimensions, packed pixels and active decal counts alongside Wilds. Of 166 rows, 6 are ACCOUNTED FOR, 5 INTENTIONALLY NATIVE, 6 OTHER OWNER, 36 CONFIRMED GAP, and 113 UNKNOWN. Most UNKNOWN rows are catalog-only and explicitly require a representative loaded host and source/material/restore evidence; the source mask/normal/AAID role requires per-part resolved URL and cache/binding proof. Do not turn source-catalog presence into a live failure or claim a family-wide 404 from an isolated variant. Riptide and Shaelynn stopped adding new runtime resource *roles*, but did add host-specific family evidence.

Remaining #25 gate: controlled human visual and performance comparison of Riptide's current three candidates, then design a bounded per-host/scene-budget selection with native rollback and multiple figures. The same-source KB sibling is the cleanest first candidate. Continue family inventory after any Dev policy implementation; no blanket 64 MP or all-host scale-4 policy follows from these trials. #7 still has no captured failed request URL.
