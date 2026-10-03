# #25 High Res coverage and #7 native connection warning — 2026-10-03

**Disposition:** active; browser-side recovery interaction required at the Twilight import checkpoint. Neither issue is resolved. No production fix, Stable promotion, or warning suppression was performed.

Canonical owners: [#25](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/25) and [#7](https://github.com/Knight-Witch/KnightWitch.Heroforge/issues/7). This file adds bounded technical evidence and continuation instructions, not a second acceptance record.

## Scope and source identities

Live state, contract, active context, both issue threads/latest comments, and all three HFBR records were fetched before investigation. Reports: HFBR-20261003-EZM4RA66, HFBR-20261003-SMN3DAKH, HFBR-20261003-LC59QEDX. Reports/attachments were retrieved through authorized HF.Status operator infrastructure; raw figure JSON remains private. The five-figure report contains five separate saved fixtures, not one five-figure scene.

Installed runtime evidence was public Stable v2.4.2 / 2.4.2-refresh-compatibility, immutable payload 93c0de5cd0da1dece3ef286c5a9201c83f1addb7. Native build: heroforge06.1.10.6. Live Native Reconcile was 0.3.8 / 0.3.8-supported-body-aaid-binding; Active Decal Priority 0.1.1 / 0.1.1-dev-projected-host-lifecycle-coordination; Same Figure Drift Guard 0.1.0. Dev source Native Reconcile 0.4.1 was inspected but not live-validated here. Canonical Dev launcher remains v1.16.1, immutable payload e431e26f7b3c4e4874c9238dd517015c71d824c1. Documentation baseline: Dev 706bd88ba427d11539f5c79ec5fd92ea944262ae; Stable b069d1057c3cf52414ed5365841058f0f43bdf31.

Source paths: features/rendering/Texture_Quality_Native_Reconcile.js and the manifest's Active Decal Priority module, plus native creationkit.js, heroforgeui.js, static_en.json and options.json for the exact native build. Bridge is private GitHub-backed dev infrastructure, not a plugin. Successful trials ran with the HeroForge tab hidden.

### Fixture/evidence matrix

| Report | Submitted fixture | Available evidence / completed trial |
|---|---|---|
| EZM4RA66 | Tsuyilia Forest Set Full (1); native label Tsuyilia Posed Fit | Private native JSON; about 670 KB parts. Dense tails/base items/gear. Failure reports bodyLower source/allocation verification followed by native atlas restore failure. No exact failed request capture. |
| EZM4RA66 | Bath Copy | Explicit URL https://www.heroforge.com/load_config%3D59422567/ ; diagnostics only, no attached native JSON. Primary + baseItem displays. Live comparison pending. |
| SMN3DAKH | 0 Thane Desolation Base Upper | Private native JSON; about 368 KB, 64 unique parts, native face absent; manual atlasScale up to 23.21. Missing face is not itself a failed network request. |
| SMN3DAKH | Devastator Lower | Private native JSON; about 405 KB, 65 unique parts; primarily KB/blank host, not a normal core body/face fixture. Completed OFF import, ready/finished true; all 190 new HF resource responses 200, no notify event. |
| SMN3DAKH | The Scourge | Private native JSON; about 212 KB, 44 unique parts. Completed OFF import, ready/finished true; all 220 new HF responses 200, no notify event. |
| LC59QEDX | 00 Vermis Legs | Original live fixture, about 156 KB, 30 unique parts. Source/actual atlas inspection and native CPU-only packing comparisons completed. ON/OFF recovery trial was noisy and failed readiness/restore verification; not negative evidence for #7. |
| LC59QEDX | Twilight Soak Copy Copy Copy | About 783 KB, 19 unique parts; 589 tail occurrences, repeated KB. Native import accepted in Bridge #3882; subsequent browser-side replies stopped. Outcome unverified. |
| LC59QEDX | Witch of Wilds | Explicit URL https://www.heroforge.com/load_config%3D56462355/ ; no attached native JSON. Hair, tails, clothing, weapons, antlers, base grass; live comparison pending. |
| LC59QEDX | Nyrethax The Vile | About 361 KB primary plus 442 KB child human baseItem: two characters, about 803 KB total. Primary lacks face; child has face. Treat their separate atlas costs explicitly. |
| LC59QEDX | Kaname Suit and Decals | About 304 KB, 18 unique parts; tails, weapons, hair, base items; atlasScale up to 1.62. |

Exported config IDs were recorded but not substituted for Amanda's explicit URL/label. Native JSON imports changed only the unsaved local figure, not cloud saves. Devastator's diagnostic capture ID is reused between SMN3DAKH and LC59QEDX; LC59 records capture_id_conflict, so this is not independent duplicated runtime evidence.

All raw report captures use General-only Diagnostics 0.1.0: providers {}, providerCount 0, errors [], ready/finished true at capture. They lack a warning event, failing URL/status/emitter and Texture Quality ON/OFF state. That absence cannot prove no failure occurred.

## #25 — coverage, source paths and promotability

High Res already has two policies, not just a body policy:

- Native Reconcile explicitly targets bodyLower/bodyUpper/face: scale 4, bakeSize 2048, used-size seed 1024–2048; supported body mask/AAID source cap 1024. Body source binding and restoration have ownership.
- Active Decal Priority also targets non-core hosts with applied decals or selected splatter, setting atlasScale 4 and an owned atlas budget of 8192 × 4096 when hardware limits are reliable. It can overwrite a manual scale above 4. This policy does not conjure higher source images.
- The same part on a k_N KB host is not necessarily classified as a core slot. KB is a placement/ownership dimension crossing all source families. Source identity can be shared while each instance consumes its own packed rectangle.

[Family catalog](ISSUES_25_7_TEXTURE_FAMILIES_2026-10-03.csv) inventories all 147 bake/source-alias metadata families in the current 290-group options catalog, including solid/collision/procedural/inert candidates that must be excluded rather than promoted. Eight attached native JSONs plus Nyrethax's child resolve to 48 metadata families after link/linkD inheritance. Catalog instance counts include aliases/mirrors and are not a count of unique GPU images. Non-instantiated families are source-catalog candidates, not runtime-verified loaded hosts.

| Host families | Native detail ceiling / current behavior | Promotion and likely benefit / limits |
|---|---|---|
| Core bodies and species faces | Body/face policy already applies by native key. Some native species face metadata reaches 4096; stoatFolk mask and AAID at 4096 returned 200. | Preserve existing accepted fixes; fixed 2048 should not silently downsize a genuinely 4096-native face. Separate semantic source verification from final atlas allocation. |
| Clothing, chest/legs/gloves/shoulders/feet, helmets, armor, back and neck | Common 512/1024/2048; emperorRegaliaOuter mask 4096 returned 200. Vermis chest native 1024 but packed 512, robe native 2048 but packed 1024. Decaled hosts already receive scale policy; plain hosts do not. | High priority for large visible detailed surfaces with actual source headroom. Restore inherited source and per-instance scale ownership; avoid increasing every repeated clothing instance. |
| Hair/hairZ, eyebrows, beard subdivisions, horse/pony/leopard mane | Heterogeneous 64–2048. Verified braids and textured beard mask/AAID/normal at 2048. Vermis hair native/packed 512 with actual normal 256. | Select focal detailed hair/beard with proven headroom. Larger atlas alone cannot add detail to low source images. Tested dwarvenMaleStraight03 1024 mask returned 404; only that URL/variant is ruled out. |
| Tails/tailShared, wings/wingShared/armWings, horns/support horns, teeth/tongue, ears | Native sources vary by family/part. Nightmare tail and epic wing complete texture triples at 2048 verified. Repeated tails dominate Twilight/Tsuyilia. | Focal tails/wings benefit; low-detail repeated tails/horns need visibility/size caps and per-instance limits. Blanket scaling actively competes with core and decal hosts. |
| Weapons/itemR, attachments, bind parts, kit, rings, earrings, hearing aids, nails, kneepads | Typical 128–2048. Heavy triple rotary complete triple 2048 verified. Vermis dagger native/packed 256. swordIce 1024 and daggerAssassin 512 mask probes returned 404. | Promote large detailed focal gear before tiny accessories. Source aliases, normal overrides and hand mirrors must resolve first. Do not turn isolated failed URL variants into a claim no larger weapon source exists. |
| Base/baseItem/baseRim, terrain, scenery, objects, primitives | Native 32–4096. Birch tree complete triple 4096, grass base triple 2048, stone rim triple 1024; primitive cube mask/normal 1024 verified. | Useful for focal trees/terrain/engraved objects; low priority for flat primitives and repeated background pieces. Collision/solid families cannot gain raster detail. |
| Mounts, animals/creatures, armor/saddles, wheels/treads, robot/dragon/bird/invertebrate families | Distinct textures and aliases, often 1024/2048; Clydesdale horse and camel triples 4096 verified. The CSV includes every family, not only humanoid slots. | Large focal creatures have real headroom, but begin at 2048 selected caps and account for extra character atlas(es). Do not promote every animal to 4096 by category. |
| KB parts, all k_N placements | Inherit the above source identities; same source can be shared by hundreds of instances. | Deduplicate source fetch/cache decisions; budget packed rectangles per instance. Selected/focal hosts rather than blanket KB maximum. |
| Eyes; splatter/decal resources; environments/backgrounds; native scene/shadow/occlusion/Booth targets | Additional resource paths outside these host atlases, with their own texture/quality controls. Eye iris/sclera are static PNGs; environment sphere maps use 512/1024 variants; background uses hf_bg_loRez WEBP. | Inventory separately; no evidence establishes a hidden higher variant for every resource. Existing Booth ownership is separate. Do not reinterpret unrelated render targets as texture-bearing part promotion. |

### Native source and material chain

Native bakedTextureSize uses solid 32, collision 0, artSource.bakeSize, or min(colorSource.bakeSize, own bakeSize), otherwise own bakeSize. usedTextureSize is sticky and may outlive an atlas change. Mask/normal use artSource inheritance; AAID uses colorTextureSource → artSource → own. Left/mirrored hosts resolve right/unsided resources; itemD can use itemR. normalFilename overrides and version+1 query affixes matter.

Low-resolution native URLs:
`/static/herobundles/<source-slot>/<baseName>/<normalFilename-or-name>_mask_<size>.webp?<version+1>=pv`,
normal `_nrml_<size>.webp`, AAID `_aaid_<size>.png`.
Native hiRez mode uses meshBundleHigh PNG paths and forces native bake size; enabling that path also concerns native high-detail geometry, so it was not used as a generic texture promotion trick.

[HTTP probes](ISSUES_25_7_SOURCE_PROBES_2026-10-03.csv) retain exact paths, timestamps, HTTP status, transfer bytes and decoded image dimensions for 32 successful GETs. Example treeBirch mask 4096 WEBP / AAID 4096 PNG / normal 4096 WEBP all returned 200 and decoded 4096 × 4096. These prove actual 4096 source data exists. No 8192 source was established. Additional 4096 face/chest probes above were HTTP-confirmed only, not decoded-image validation.

On Vermis, hairZ and dagger packed 512/256; chest packed 512 despite native 1024, robe packed 1024 despite native 2048; k_0 sword packed 512. All sampled materials shared the same colorAtlasMap UUID. Several repeated KB entries share a part object/source cache, but not their atlas rectangles. Source mutation needs identity-aware snapshot/restore; never globally overwrite bakeSize to a maximum.

### Atlas mechanics and thresholds

Native CK.Atlas derives ideal size from surface area/UV density × 216 pixels-per-unit (legacy fallback), applies atlasScale and native UHD multiplier, and clamps target sizes to source bake limits. Decal-capable parts receive a 1.2 factor. Power-of-two desired atlas area is heuristically selected from total target area with greediness/base/rim terms, then bounded by width × height maxima. Rectangles are rounded to powers of two and packed largest first. Packing retries lower the global factor in 0.05 increments, so texture quality can drop well before a hard allocation failure; rectangle fragmentation matters.

Actual CPU-only native constructors, without changing GPU atlas:
- Vermis: 8192 × 4096 versus 8192 × 8192 kept sampled core 2048, hair/chest/sword 512, robe 1024, dagger 256. Approximate constructor times 3 ms/1 ms, not a performance benchmark.
- Scourge: selected k_0..k_5 scale 4, budgets 4096-square / 8192 × 4096 / 8192-square; sampled k_0..k_3 remained 512 and k_4..k_5 1024. Whole-atlas equality was not established.

[Approximate exported-host model](ISSUES_25_7_ATLAS_MODEL_2026-10-03.json) is a hypothesis discriminator, **not native runtime or GPU validation**: lacks derived/rim slots and generated/modded source inheritance; decal availability approximated from metadata. At 16/32/64 megapixel budgets its packing factors were Vermis .75/1/1; Twilight .25/.25/.5; Tsuyilia .15/.25/.35; Kaname .55/.7/1; Thane .4/.8/1; Devastator .75/1/1; Nyrethax primary .65/.95/1 and child .55/.75/1; Scourge .6/.9/1. Blanket promotion of all native ≥1024 hosts to scale 4 drove severe global shrink (as low as .05); this can lower unrelated textures.

Hardware observed: RTX 4070 Laptop through ANGLE D3D11/WebGL1; maxTextureSize/maxRenderbufferSize 16384, combined units 32. These are dimensional/API hard limits, not a memory or performance budget. Physical VRAM usage was not measured.

**Highest established source:** 4096 with decoded real HTTP images. **Existing policy budget:** 8192 × 4096 (32 MP). **Next unestablished candidate:** bounded 8192 × 8192 (64 MP) on a density-constrained fixture; its practical visual/performance threshold remains unproved. No universal highest practical budget has been established. Larger dimensions without source headroom or without improved packing cannot help.

### Memory/performance cost

Actual Scourge/Devastator baker targets: eight RGBA unsigned-byte render targets (color/colorSrc, physical/physicalSrc, physical2/physical2Src, emissive/emissiveSrc), each 4096 × 4096, generateMipmaps=true and depthBuffer=true. Base color storage alone for eight targets:

| Atlas area per character | Eight RGBA8 targets | Implication |
|---|---:|---|
| 16 MP | 512 MiB | Actual observed target dimensions; extra depth/mips/source textures not included. |
| 32 MP | 1 GiB | Existing policy maximum dimensions if fully allocated. |
| 64 MP | 2 GiB | Doubles 32 MP storage and bake pixel work; not practical-certification. |

Depth buffers, any allocated mip chains, intermediate targets, shadows, lighting, geometry and source caches add cost; exact GPU residency has not been profiled. Nyrethax has two character atlases. One uncompressed RGBA source image costs 1/4/16/64 MiB at 512/1024/2048/4096; promoting a mask+AAID+normal triple 1024→2048 adds 36 MiB base, 2048→4096 adds 144 MiB per unique source triple. Transfer WEBP/PNG bytes are not VRAM bytes. Native normal/AAID formats and actual upload may differ; these are transparent RGBA8 estimates.

### Evidence-backed technical priority (proposal, not acceptance)

1. Preserve accepted core correctness and existing decal-host priority; repair source/verification distinctions and avoid downsizing higher-native species faces. Preserve manual scales and owned settings restoration.
2. Promote selected large visible clothing/armor/gear with proved 1024/2048 source headroom and a measurable allocation gain. Vermis chest/robe are concrete useful candidates.
3. Promote focal hair/beard/tail/wing variants with verified detailed 2048 sources; retain lower caps for low-source variants and repeated KB instances.
4. Selected focal creatures/mounts and detailed terrain/objects with proved 4096 sources: try 2048 first, then 4096 only if visual gain warrants per-source/per-character cost.
5. Small accessories, repeated horns/teeth/tails, background objects and flat primitives last; procedural/solid/collision data excluded.

The implementation seam is per-source effective caps plus per-host allocation priorities under an owned per-character budget, with alias-aware deduplication, preservation of manual values, and complete rollback. A larger shared atlas is a fallback after proving the actual density constraint, not a default allocation. Visual ranking is a supported inference from source/headroom/packing; Amanda's controlled visual/performance gate remains necessary for actual perceived gain.

## #7 — warning emitter established, failing request not yet isolated

Native creationkit.js character-display `_loaded(e,n,r,o)` checks matching resourceRequestId, then finds falsy resource results whose paths contain `.ckb` or both `.png` and `_aaid_`. In LIVE mode it emits CK.Events `notify` with `labels.loadingFailed`; non-LIVE emits `networkError` with paths. static_en.json translates this to **Loading Failed: Connection Error**. heroforgeui.js subscribes to the notify event and displays the native notification queue.

Native CK.Resources loader success/error callbacks identify owner and URL; failure logs “Failed to load”, resolves undefined, evicts failed cache, and emits resourcesChanged. Native owners include Character0; Dock-owned mask/source requests use 82042049. A random analytics 403, an unrelated normal/mask 404, or a readiness timeout does not establish this warning branch. Correlation must join URL + failed result + request identity + emitter timestamp + Texture Quality state + owner/call path.

Low-noise completed trials subscribed observationally to notify/networkError, cleared and bounded resource timings to 2000, performed native unsaved local import, progressed native lifecycle, and unregistered observers/restored hook wrappers in finally:
- Scourge, Texture Quality OFF: run 8 at 2026-10-03 05:32:18Z, ~33.5 s; ready/finished true, no notify, networkError false (clear) only; 220 HF resources, all 200.
- Devastator, OFF: run 12 at 05:38:06Z, ~35.0 s; ready/finished true, no notify, networkError false (clear) only; 190 HF resources, all 200.
- No failed request was observed in those windows. This does not rule out an ON-only warning, another fixture, cache-dependent failure or later request.
- Earlier Vermis ON→OFF→ON run 4 at 05:11:39Z (~667 s) saturated broad console/event hooks with invalid-decal/resourcesChanged noise and failed restore/readiness. Do not repeat that broad configuration or cite its absent warning as negative proof.

No warning was cosmetically suppressed; no attribution to Dock/native/CDN was made without the failing request. Pending test: one window per fixture/state, notify/non-LIVE path capture plus native loader error and full resource URL/status, with cache/request identity and Dock source ownership. Capture first bad transition before cleanup. Native missing face/core hosts need structural validation separately from failed network evidence.

## Recovery checkpoint — first unfinished step

Private Bridge mailbox evidence:
- #3859 native Vermis CPU atlas comparison.
- #3867–3869 Scourge completed OFF lifecycle and network/CPU samples.
- #3874–3875 Devastator completed OFF lifecycle/readback.
- #3882 Twilight import Power refresh acknowledged success at about 05:48:32Z; native import outcome unread.
- #3883 post-import readback, #3884 inert callback construction, #3885 fresh bridge.ping have no result at checkpoint. The relay transcript accepted these requests; local relay health returned an immediate authenticated-endpoint 401 without a supplied token. This shows a listening HTTP service, not a successful browser handshake.
- Runtime replies ceased after Twilight; the cause (main-thread stall, blocking browser dialog, pump issue, other) is not proved. Hidden state alone is not the diagnosis. Many previous hidden-tab round trips worked.

**Amanda interaction:** inspect the authenticated HeroForge tab for an unresponsive-page/blocking dialog, dismiss it if possible and report whether the page responds. Do not reload yet: preserve unread capture and the recovery snapshot. No console commands or routine focus babysitting requested.

After it responds, read #3883 and fresh ping before any mutation/retry; preserve at-most-once behavior. Pending #3884 only constructs/stores an inert native-frame observer and does not register it. Confirm its execution before using it. It binds native update/animation/postAnimation/preRender/end methods into a queued microtask; registration is untested and remains a candidate, not an accepted implementation.

Persistent High Res was temporarily set false for OFF trials; original was true/ON. Original Vermis native JSON remains in HFChatBridgePower.runtimeBaseline and private compressed fixture backup. Restoration is **not verified**: finish pending trial capture, then restore original unsaved Vermis, Persistent High Res true and original ON state with native ready/finished/model/source checks. Twilight observer cleanup remains unverified until readback; completed Scourge/Devastator trials removed their observers.

Old read-only requests #3800/#3802 produced relay PowerShell ConvertFrom-Json “name” errors; their queued/requeued state needs terminal cleanup after preserving evidence. Merely closing GitHub issues does not necessarily clear the relay's in-memory queue. Do not replay uncertain mutations or restart the relay as a foreground workaround. Completed private figure-input messages can be redacted after terminal results and durable recovery data are secure; do not publish raw JSON or analytics identifiers.

Then finish untested ON/OFF fixtures, explicit Bath/Wilds URL comparisons, the native dense-fixture CPU packing discriminator and controlled visual/performance threshold. If all native replies remain blocked without a visible dialog, inspect relay/browser pump state with one bounded read; don't invent a Bridge availability diagnosis.

## Janitorial and continuation boundaries

No new investigation/product issue and no new branch was created. Permanent WITCH_DEV_MAIN receives only evidence/catalog/router/changelog/preflight documentation. Branch registry/deletion queue were checked; no new lifecycle entry or deletion is owed. Existing protected branches remain protected. No source/module/manifest/public behavior changed; Stable ref and payload unchanged.

HF.Status operator/triage-requests was used for authorized read-only operator retrieval (queue checkpoint 6bbc1d6dd946b86789eb7996db06b1375e140c11); it is dev infrastructure, not a product change. Do not expose credentials, triage tokens, raw figure attachment bodies or private reporter data.

Resume at the recovery readback, not at report retrieval or the successful OFF runs. #24/#32 remain shipped; #34 restore-warning ownership stays separate. Only #25/#7 follow-up and safe reversible diagnostics are authorized here; no Stable/public runtime change.
