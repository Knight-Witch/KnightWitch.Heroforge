# Session Log

Chronological development and testing notes. Use this for concise project-state updates that matter across chats.

## 2026-09-03 — Embedded Emblem Asset Fix

- Target: repair the public v1.0.7 compact launcher emblem without changing the confirmed launcher interaction behavior.
- Diagnosis: public v1.0.7 rendered the 54x54 launcher but the raw-GitHub `<img>` failed in HeroForge, leaving only a tiny fallback mark; click/drag and positioning remained functional.
- Action: DEV v26 replaced only `COMPACT_EMBLEM_URL` with the exact emblem PNG embedded as a data URI; no pointer, sizing, storage, manifest, tool, or Booth logic changed.
- Runtime result: the user confirmed `Witch_Dock_DEV_Emblem_Launcher_v26.txt` works correctly in HeroForge.
- Release scope: promote that exact asset-loading delta as public v1.0.8; keep `ASSETS/emblem.png` as source artwork; leave `manifest.json`, `/tools/`, `/HeroForge_UI/`, Persistent Booth, and PNG Series Capture unchanged.
- Test notes: public v1.0.8 source passed `node --check` before release.

## 2026-09-02 — Witch Dock Emblem Compact Launcher

- Target: replace the fully closed horizontal `WITCH DOCK` bar with the Blender Quickbar-style square emblem launcher requested for public Witch Dock.
- Diagnosis: the current public `Witch_Scripts/Witch_Dock.user.js` still used the old horizontal compact bar. `DEV_TEST` is an intentionally divergent scratch/testing branch and was not used as a merge source for this promotion.
- Canonical test reference: standalone `Witch_Dock_DEV_Emblem_Launcher_v25.txt` / v1.0.7.25 behavior was runtime-confirmed by the user before promotion.
- Action: transplanted only the tested compact-shell delta into the current live shell, added the exact supplied transparent white `ASSETS/emblem.png`, retained the existing `kw.witchDock.v1` storage, and preserved `compactX` / `compactY` positioning.
- Interaction behavior: 54x54 launcher; click reopens Witch Dock; movement beyond 5px becomes drag and repositions the launcher without reopening it.
- Release scope: `Witch_Dock.user.js`, the emblem asset, and release/tracking documentation only. `manifest.json`, all `/tools/`, all `/HeroForge_UI/`, Persistent Booth, and Photo Mode PNG Series Capture remain unchanged.
- Versioning: public shell advances from v1.0.5 to v1.0.7; v1.0.6 is intentionally skipped because it existed transiently during earlier Booth work before rollback.

## 2026-08-22 — Booth v21 Lighting and Responsive Canvas Repair

- Target: correct two regressions missed during initial v20 validation: Booth lighting data persisted but was no longer visibly applied outside Booth, and Black Canvas showed a narrow frame/checker artifact at smaller viewport or monitor sizes.
- Lighting diagnosis: inside/outside `BT.maker.composeDisplayState().lighting` snapshots were identical. The saved state survived; HeroForge reset only its renderer application. A manual native `BT.display.lighting.apply(captured, current)` call restored the lighting immediately.
- Canvas diagnosis: material transparency and plane scaling had no effect. The native `BT.display.overlays.resize()`, `refresh()`, and `applyVisibility()` sequence removed the artifact, confirming stale responsive overlay state.
- Action: v21 captures native Booth lighting and reapplies it during both delayed restoration passes; it synchronizes overlays when Black Canvas is activated, Booth exits, or canvas dimensions/DPI change, then reasserts Black Canvas visibility.
- Runtime result: the user confirmed the complete v21 DEV build works, including lighting persistence and removal of the size-dependent Black Canvas frame.
- Release scope: `tools/Booth.js` and tracking documentation only. `Witch_Dock.user.js` remains v1.0.5; `manifest.json` remains unchanged.

## 2026-08-22 — Booth v20 BT Runtime and Black Canvas Repair

- Target: repair Persistent Booth after HeroForge replaced the old `TN.tokenizer` runtime and restore Black Canvas without changing the Witch Dock loader.
- Diagnosis: the live Booth controller is now `BT.maker`; the old integrated module remained trapped waiting for the removed tokenizer path. The visible Black Canvas result depends on the default environment, Booth overlay planes, and rendered canvas background rather than a single backdrop-material assignment.
- Action: migrated Booth persistence to the real `BT.maker.disable()`/`enable()` lifecycle while preserving teardown timing and effect-state restoration; changed Black Canvas into continuously enforced visual state that leaves the selected 1:1 Booth background intact.
- Runtime result: the user confirmed Persistent Booth, Black Canvas, Booth re-entry, Booth-background changes, removal of the translucent frame, selected-background persistence, and Black Canvas disable/restore all work in v20.
- Release scope: update `tools/Booth.js` only for runtime code. `Witch_Dock.user.js` remains v1.0.5 and `manifest.json` remains unchanged because Witch Dock fetches live modules from GitHub on page load.
- Test notes: v20 passed JavaScript syntax and whitespace checks; runtime validation was completed in HeroForge through the standalone DEV build before promotion.

## 2026-07-22 — Debug, Slot, Joint, and Lob Archive Reference Checkpoint

- Target: preserve useful reverse-engineering information from Lob's archived HeroForge debug userscripts, public script archive, sourced/free slot catalogs, and numbered-joint list without treating stale executable code or historical data as live HeroForge contracts.
- Action: added focused notes for the archived native debug UI and for slot/joint/attachment maps; added a source manifest with exact filenames, SHA-256 hashes, dataset statistics, archive inventory, and provenance; indexed the new references in the History README and Bullshit Bible.
- Debug result: the archived `DebugLive` bundle contains useful scene-graph, texture-uniform, skeleton-modifier, JSON, animation-state, and CSV references, but v0.2 remains partially broken and the complete userscript should not be integrated into Witch Dock.
- Slot result: `Free_Slots` is a 121-entry subset of the 366-entry sourced catalog with matching preserved fields; the word `free` does not prove current availability, safety, or compatibility.
- Joint result: the numbered-joint snapshot contains 641 rows and 639 unique numeric IDs, including duplicate IDs `1204` and `1425` plus three entries lacking `_bind_jnt` suffixes.
- Archive result: inventoried the 2026-07-19 Lob public script ZIP and recorded its embedded source commit identifier, individual script filenames, and metadata versions.
- Storage decision: keep raw large executable archives in the GPT project files for now; commit distilled findings and a source manifest. Any future raw copies belong under `HISTORY/REFERENCES/` as non-installing `.txt` files and must never be manifest-loaded.
- Test notes: documentation and source-data analysis only; no Witch Dock JavaScript, standalone userscript source, `manifest.json`, storage keys, UI, Persistent Booth, or runtime behavior changed.
- Follow-up: use the new topic files as pre-read material before scene-inspector, texture-inspector, animator, slot-injection, attachment, bone, or slot-swapping work.

## 2026-07-15 — Shadow Pipeline Probe v0.2 Result and v0.3 Trace Target

- Target: identify the callable native `sun.shadow` method responsible for the legitimate shadow-camera/matrix refresh observed in the v0.1 sun-only comparison.
- Action: analyzed `HF_Shadow_Pipeline_Probe_v0.2.0_2026-07-15T07-40-40-928Z.json` and reviewed the exact v0.2 wrapper-selection implementation.
- Result: native `sun.shadow` exposed only `clone`, `copy`, and `toJSON` beyond plain `Object` methods. Those three were intentionally excluded from tracing, while inherited `toLocaleString` was accidentally not excluded. The probe therefore wrapped only `toLocaleString` and recorded zero method calls.
- Correction: the zero-call result does not prove that shadow refresh occurs without method calls. It proves that `sun.shadow` itself does not expose an obvious useful refresh method and that the v0.2 trace targeted the wrong object.
- Additional finding: one captured transition showed the native sun and lighting root marked matrix-dirty while the shadow camera/matrix were still stale; a later captured state showed the shadow camera/matrix synchronized and those dirty flags cleared. Because the run contained multiple watched UI interactions, the elapsed time between those states is not treated as a clean automatic delay measurement.
- Current direction: trace only the specific live sun, sun-position, sun-target-position, shadow-camera, shadow-camera-position, and shadow-matrix instances. Capture targeted mutator/update calls, stacks, and compact before/after dirty state. Do not patch global prototypes.
- Artifact status: `HeroForge_Shadow_Pipeline_Probe_v0.3.0.txt` and its diff were created locally from v0.2.0 and syntax/stub-initialization checked; live HeroForge runtime validation is still pending.
- Test notes: standalone diagnostic work only; no Witch Dock JavaScript, `manifest.json`, Persistent Booth, storage, UI, or live runtime behavior changed.
- Follow-up: run v0.3.0 with the native Sun controls already open, arm the refresh trace, perform one native sun adjustment only, then analyze the report.

## 2026-07-14 — Native Shadow Refresh Comparison

- Target: compare three legitimate HeroForge lighting transitions after splitting the cumulative lighting harness: native sun adjustment only, environmental lighting preset only, and full Booth preset only.
- Action: analyzed `HF_Shadow_Pipeline_Probe_v0.1.0_2026-07-15T01-02-14-906Z.json`, `...01-03-42-554Z.json`, and `...01-04-50-087Z.json`.
- Result — native sun adjustment: the first post-interaction snapshot showed the new sun position while the native shadow camera and `sun.shadow.matrix` were still at baseline; roughly 83 ms later the shadow camera position/rotation and shadow matrix updated to the new sun state. The existing shadow render target and texture objects remained in place.
- Result — environmental lighting preset: across 33 snapshots, no captured native sun or native `sun.shadow` field changed and no native-shadow change event fired. This is intentionally narrow; the probe did not deeply capture `EnvironmentLight` internals.
- Result — full Booth preset: the completed preset changed native sun position, intensity, and color and ended with updated shadow camera/matrix state while reusing the existing shadow render-target objects. The first scheduled post-click callbacks were delayed until the composite preset had already resolved, so internal ordering was not isolated.
- Correction: the missing behavior in the failed direct-mutation path is now concretely narrowed to the follow-up shadow-camera/matrix refresh phase rather than an unidentified shadow render-target replacement.
- Documentation: added `HISTORY/BULLSHIT/LIGHTING_SHADOW_REFRESH_DIAGNOSTICS.md` as a focused technical appendix.
- Test notes: standalone probe runtime only; no Witch Dock JavaScript, `manifest.json`, Persistent Booth, storage, or live runtime behavior changed.
- Follow-up: enumerate and minimally instrument callable methods on the native `sun.shadow` instance during another clean native sun adjustment to identify the exact method/call chain that performs the delayed refresh.

## 2026-07-14 — Advanced Lighting Probe v0.6 Result

- Target: determine whether the two persistent `additionalSunShadowMap` textures changed internally across working baseline -> broken native-sun override -> restored native state.
- Action: analyzed `HF_Lighting_Injection_Probe_v0.6.0_2026-07-14T23-37-19-231Z.json` after a controlled Photo Booth run using pre-attach DirectionalLight injection followed only by the native-sun shadow comparison round.
- Result: the two traced `additionalSunShadowMap` textures were identified as ordinary static 512x512 HTML image textures loaded from `summonCircle_shadow_512.webp` and `foliage_shadow_512.webp`. Their UUIDs, versions, image dimensions, asset paths, material bindings, and other captured backing state remained unchanged through baseline, override, and restore.
- Result: the native `sun.shadow.map`, native shadow matrix, material shadow states, detailed bindings, shadow-resource trace, and texture-diagnostic structures also remained unchanged while the native sun position/intensity/color changed and then returned to baseline.
- Correction: the `additionalSunShadowMap` path is not the dynamic native sun-shadow target for this investigation; the name led the earlier probe branch toward static environment shadow textures.
- Current inference: direct mutation of the native sun changes visible illumination without regenerating the native shadow projection/map. When the sun is restored to its original transform, the unchanged shadow data is spatially valid again, explaining why visible shadows return without any logged shadow-resource change.
- Test notes: probe runtime only; no Witch Dock, Persistent Booth, manifest, or repo JavaScript changed.
- Follow-up: preserve the known-good second DirectionalLight injection reference, then focus the shadow probe on the actual native `sun.shadow` update/render path and the mechanism HeroForge uses to recalculate it after legitimate native lighting changes.

## 2026-07-13 — Advanced Lighting v0.4-v0.6 Documentation Checkpoint

- Target: correct the stale Advanced Lighting documentation after probe work continued beyond the July 12 v0.3 checkpoint.
- Action: renamed the dedicated sub-project/spec from `LIGHTING_AND_SHADOWS.md` to `LIGHTING_AND_EXTRA_LIGHTS.md`; documented Injection Probe v0.4.0 and v0.5.0 results; registered v0.6.0 as the current active unvalidated diagnostic probe; corrected the earlier custom-shadow claim; recorded the planned split into a compact Lighting Injection Reference and focused Shadow Pipeline Probe.
- Result: repo memory now records that visible independent custom DirectionalLight shadows are not confirmed, that HeroForge uses separate persistent `additionalSunShadowMap` textures on `HF.summonCircle` materials, that native visible shadows disappear when native sun state is overwritten and return when the original native sun state is restored, and that the same shadow-resource object identities persist across working -> broken -> restored states.
- Architecture: Advanced Lighting remains a standalone sub-project intended for a separate future module under the Witch Dock Booth tab; `tools/Booth.js` and Persistent Booth remain separate and unchanged.
- Test notes: documentation-only update; no JavaScript, userscript probe source, `manifest.json`, storage keys, UI, or runtime behavior changed.
- Follow-up: run and analyze `HeroForge_Lighting_Injection_Probe_v0.6.0.txt`, checkpoint the result, then split the cumulative harness before the next major diagnostic branch.

## 2026-07-12 — Advanced Lighting Investigation Checkpoint

- Target: persist the current HeroForge custom-light investigation and close the documentation gap that left validated probe findings only in chat.
- Action: added `HISTORY/BULLSHIT/LIGHTING_AND_SHADOWS.md`; inventoried Lighting Probe v0.1.0 and Injection Probe v0.1.0-v0.3.0; updated `MASTER.md`, `HISTORY/Bullshit_Bible.md`, `HISTORY/STANDALONE_REFERENCES.md`, and `HISTORY/DECISIONS.md`; added a milestone-based documentation-checkpoint rule.
- Result: repo memory recorded the then-current working second DirectionalLight, position/intensity behavior, Photo Booth pre-attach shadow allocation, editor/Photo Booth targeting difference, stale shadow-matrix regression, non-working but counted third SphereLight, canvas-preset confounder, Persistent Booth separation, and queued Fresnel/rim-light investigation.
- Historical correction: the v0.3 visible custom-shadow interpretation was later downgraded after v0.4-v0.5 controlled tests failed to reproduce independent visible custom shadows. Current active status lives in `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`.
- Test notes: documentation-only update; no JavaScript, userscript metadata, `manifest.json`, storage keys, UI, or runtime behavior changed.
- Follow-up at that time: stabilize custom DirectionalLight shadow refresh/lifecycle behavior with standalone probes.

## 2026-07-09 — Standalone Reference Inventory Backfill

- Target: standalone scripts, external references, probes, deprecated scripts, and migration status.
- Action: added `HISTORY/STANDALONE_REFERENCES.md`, linked it from `HISTORY/README.md`, expanded `MASTER.md` migration/status notes, added a standalone-inventory decision, and updated Bullshit Bible critical rules/backfill queue.
- Result: repo memory now distinguishes HF Core Tweaks/Lob decal-slot reference, Photo Mode PNG v0.7 probe, WebGL readPixels probe, tokenBg backdrop probe, Booth v12/v13 history, deprecated pre-Witch Dock scripts, migrated Decals scroll probes, and bone/kitbashing references that still need recovery.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: when external script bundles or old probes are recovered/re-uploaded, add exact filenames/source notes to `HISTORY/STANDALONE_REFERENCES.md` before migration or replacement work.

## 2026-07-09 — Photo Mode PNG Capture Feature Spec Backfill

- Target: intended product/feature spec for the unresolved Photo Mode PNG Series Capture tool.
- Action: added `HISTORY/BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md` and updated `MASTER.md`, `HISTORY/Bullshit_Bible.md`, `HISTORY/DECISIONS.md`, `TIMING_AND_STATE.md`, and `BOOTH_RENDERS_EXPORTS.md` with cross-links and requirements.
- Result: capture docs now distinguish product requirements from probe history. Intended first target is 1024x1024, around 72 PNG frames, ZIP output, metadata/failure records, explicit arming, validated dimensions, and preserved Photo Booth output/effects. Later-stage ideas include 2048, 4K, 16:9 cinematic output, overlay/layer controls, GM/download fallback, and possible companion helper.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: before implementing, use `PHOTO_MODE_PNG_CAPTURE.md` for requirements and `BOOTH_RENDERS_EXPORTS.md` / `TIMING_AND_STATE.md` for probe constraints. Persistent Booth remains live/working and separate.

## 2026-07-09 — Persistent Booth Status Clarification

- Target: documentation wording around Persistent Booth and PNG-series capture.
- Action: updated `MASTER.md` and `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` to explicitly state that Persistent Booth is live/working and not part of the unresolved PNG-series capture todo.
- Result: future work should treat PNG-series capture as a separate planned/unresolved feature and treat Booth itself as live, with only minor fixes expected unless a regression is confirmed.
- Test notes: documentation-only correction; no JavaScript or manifest behavior changed.
- Follow-up: if a minor Booth fix is requested later, handle surgically against the live tool. If PNG-series capture is requested, preserve Booth output/effects but do not rebuild Persistent Booth.

## 2026-07-09 — Decals and Photo Capture History Backfill

- Target: old-chat/probe recovery for Decals scroll behavior and unfinished Photo Mode PNG series capture.
- Action: expanded `HISTORY/Bullshit_Bible.md`, `MASTER.md`, `HISTORY/DECISIONS.md`, `TIMING_AND_STATE.md`, `DOM_AND_LAYOUT.md`, `DECALS_AND_TEXTURES.md`, and `BOOTH_RENDERS_EXPORTS.md`.
- Result: Decals docs now explicitly preserve the three observed UI setups: right-side grouped, right/left split, and bottom compact. Photo capture docs now preserve the current unresolved PNG-series investigation, including official exporter observation, 512x512 early-capture warning, v0.7 probe notes, WebGL readPixels partial success, and booth effects/overlay constraints.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: if implementing PNG-series capture later, read `BOOTH_RENDERS_EXPORTS.md` and `TIMING_AND_STATE.md` before writing code. If editing Decals scroll later, read `DOM_AND_LAYOUT.md` and `DECALS_AND_TEXTURES.md` first.

## 2026-07-09 — Live Tool Documentation Backfill

- Target: current live Witch Dock modules and their integration points.
- Action: documented current-source status for Witch Dock core, Body Editor, Pose, Booth, JSON Tool, Utilities, and hidden HeroForge UI utilities.
- Result: `MASTER.md` now has live tool notes; Bullshit topic files now contain current-source findings for timing/state, DOM/layout, decals/textures, kitbashing/bones, booth behavior, and JSON/library behavior.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: perform old-chat recovery beginning with Decals/Utilities, then Booth, bones/kitbashing, JSON/library, and remaining standalone references.

## 2026-07-09 — Baseline Architecture Backfill

- Target: repo-wide documentation baseline.
- Action: updated `MASTER.md`, `STYLE_KEYS.md`, `HISTORY/DECISIONS.md`, and `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md` with current architecture, branch/install flow, manifest loading model, directory roles, style references, and durable repo decisions.
- Result: baseline project memory now documents `Witch_Scripts` as the live branch, `Witch_Dock.user.js` as the public install script, `manifest.json` as the live module inventory, `/tools/` as visible dock tools, and `/HeroForge_UI/` as hidden utilities.
- Test notes: documentation-only update; no JavaScript or manifest behavior changed.
- Follow-up: backfill Decals/Utilities history next, then Booth, bones/kitbashing, JSON/library, and remaining standalone references.

## 2026-07-09 — Documentation Architecture Scaffold

- Added the documentation/tracking structure for Witch Dock.
- No JavaScript or manifest behavior changed.
- Detailed prior-chat recovery still needs to be backfilled.

## Entry Template

### YYYY-MM-DD — Title

- Target:
- Action:
- Result:
- Test notes:
- Follow-up:
