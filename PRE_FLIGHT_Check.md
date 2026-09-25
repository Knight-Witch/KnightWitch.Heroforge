## 2026-09-25 — Issue #37 version metadata refinement

### PASS / live Dev re-smoke pending

- Utilities JavaScript parse passed after explicit runtime version/build metadata and Developer-Mode-only Reset Dock Size v1.0.0 label.
- manifest.json parses with Utilities v1.3.1 / `1.3.1-dock-size-reset-version-meta`.
- No High Res files or runtime paths changed.
- Public Stable remains unchanged pending exact promotion.

---

## 2026-09-25 — Issue #37 Dev live gate

### PASS

- Runtime: WITCH DOCK - DEV v1.6.0.
- Dev Auto Host: v0.1.1.
- Interactions: v0.6.0 / `0.6.0-dock-size-reset`.
- Utilities: v1.3.0 / `1.3.0-dock-size-reset`.
- Seeded bad state: 500×966 at x=954 / y=261.
- Actual Reset Size click: live size 380×520; persisted width/height 380×520; x/y unchanged.
- `resetDockSizeCalls=1` after the click.
- Post-click reload: 380×520 persisted; Reset Size button remained visible.
- Public Stable unchanged; promotion not yet authorized.

---

## 2026-09-25 — Issue #37 canonical Dev launcher pin

### PASS / live Dev smoke pending

- Launcher static JavaScript parse passed after v1.6.0 payload pin.
- Immutable payload: `67f06a0e691c4a96a71c83258fac8130df73b950`.
- Expected Interactions contract synchronized to v0.6.0 / `0.6.0-dock-size-reset`.
- Manifest already stages launcher v1.6.0, Interactions v0.6.0, and Utilities v1.3.0.
- Public Stable unchanged.

---

## 2026-09-25 — Issue #37 dock default-size reset candidate

### PASS / live Dev validation pending

- Scope limited to Witch Dock sizing and Utilities UI.
- Canonical defaults confirmed at 380×520 in Dock preferences/core.
- Reset implementation owns the live configured prefs through Witch_Dock_Interactions; no duplicate storage path was introduced.
- Dock position, minimized/closed state, drag behavior, resize handlers, High Res modules, and Public Stable are unchanged.
- Static JavaScript parse passed for modified Interactions and Utilities sources; manifest/DEV_DIVERGENCES JSON parse passed.
- Version staging: Interactions v0.6.0, Utilities v1.3.0, Dev launcher metadata v1.6.0.

---

## 2026-09-24 — Issue #35 final canonical payload smoke

### PASS

- Dev launcher: v1.5.9 / `1.5.9-issue-35-integrated`.
- Immutable payload: `c4fe7ef7f6307578823706de552b44b8a2a378dd`.
- Loader: 25/25 executed, 0 failed, immutable=25, fallback=0.
- Diagnostics: v0.1.3 / `0.1.3-addressable-comparison-sections`.
- Utilities registry includes `texture-quality-diagnostics-ui`.
- Bridge remained healthy on Robot route after the reload.
- This gate verifies the diagnostic tool, not #32 root cause.
- Public Stable unchanged.

### Closeout

- Issue #35 closed.
- PR #36 closed as superseded by the canonical Dev integration.
- Active route returns to #32.
- One disposable task branch remains for deletion via the branch handoff.

---

## 2026-09-24 — Issue #35 final payload-sync correction

### PASS / pending one final reload

- Dev launcher remains v1.5.9 / `1.5.9-issue-35-integrated`.
- PAYLOAD_REF corrected to synchronized canonical payload `c4fe7ef7f6307578823706de552b44b8a2a378dd`.
- Payload manifest launcher registry is v1.5.9 / `1.5.9-issue-35-integrated`.
- Diagnostic runtime code is unchanged.
- Public Stable unchanged.

---

## 2026-09-24 — Issue #35 High Res Diagnostic Capture v1 closeout

### PASS

- Canonical Dev launcher: v1.5.9 / `1.5.9-issue-35-integrated`.
- Immutable payload: `c4fe7ef7f6307578823706de552b44b8a2a378dd`.
- Loader: 25/25 executed, 0 failed, immutable=25, fallback=0.
- Texture Quality: v0.4.0 / `0.4.0-diagnostic-state-seam`.
- High Res Diagnostics: v0.1.3 / `0.1.3-addressable-comparison-sections`.
- High Res Diagnostics UI: v0.1.0 under Utilities; Booth untouched.
- `Capture Current State` before/after proof: HR remained OFF, idle, no error, same native atlas/restore state.
- Controlled Robot Native OFF → High Res ON comparison completed once and restored OFF with native restore verification PASS.
- `getComparisonSection(snapshot, section)` returns targeted OFF/ON evidence without whole-snapshot Bridge overflow.
- Public Stable unchanged.

### Scope note

Robot/#32 was only the validation fixture. #32 diagnosis/fix resumes separately from the standardized capture evidence.

---

## 2026-09-24 — Canonical Dev launcher v1.5.9 candidate

### PASS / pending final smoke

- Canonical payload: `904dd039d5e05511ab9d3737622991fd9970c5bb`.
- Payload contains Texture Quality v0.4.0, Diagnostics v0.1.3, Diagnostics UI v0.1.0, 25 modules.
- Launcher identity/version/build synchronized at v1.5.9 / `1.5.9-issue-35-canonical-diagnostics`.
- Public Stable unchanged.

### Pending

- Auto Host reload and 25/25 immutable loader smoke.

---

## 2026-09-24 — Canonical Dev launcher v1.5.8 candidate

### PASS / pending live reload

- Fixed userscript identity remains WITCH DOCK - DEV / KnightWitch.
- @version and DEV_VERSION synchronized at v1.5.8.
- DEV_BUILD: 1.5.8-issue-35-hr-diagnostics-v013.
- PAYLOAD_REF: ed32c18edfa5b16619870c1ef5cc07bff4786d49.
- Canonical launcher registry synchronized to v1.5.8.
- Public Stable unchanged.

### Required live gate

- Auto Host reload.
- Loader 25/25, 0 failed, immutable=25, fallback=0.
- Diagnostics v0.1.3.
- Robot comparison completes and restores OFF.
- getComparisonSection returns targeted Native OFF / High Res ON evidence without whole-snapshot overflow.

---
## 2026-09-24 — Canonical Dev launcher v1.5.7 candidate

### PASS / pending live reload

- Fixed userscript identity remains `WITCH DOCK - DEV` / `KnightWitch`.
- `@version`, runtime `DEV_VERSION`, and canonical launcher registry are synchronized at v1.5.7.
- `DEV_BUILD`: `1.5.7-issue-35-hr-diagnostics-v012`.
- Exact payload: `e3ce6c5a344a883e6e8e0d1b2f1de1a02a794bff`.
- Pending live gate: 25/25 executed, 0 failed, immutable=25, fallback=0, Diagnostics v0.1.2, then one Robot comparison with automatic original-state restoration.

---

## 2026-09-24 — Canonical Dev launcher v1.5.6 candidate

### PASS / pending reload

- Fixed Tampermonkey identity remains `WITCH DOCK - DEV`.
- Launcher version/build synchronized at v1.5.6 / `1.5.6-issue-35-hr-diagnostics-v011`.
- Exact payload: `5dbccc5fc6406f2838613eecb5aa572ff3f1f0fb`.
- Pending live gate: 25/25 executed, 0 failed, immutable=25, fallback=0; Diagnostics v0.1.1.

---

## 2026-09-24 — Canonical Dev launcher v1.5.5 candidate for issue #35

### PASS / pending live reload

- Tampermonkey identity remains fixed `WITCH DOCK - DEV` / `KnightWitch`.
- `@version` and runtime `DEV_VERSION` are synchronized at v1.5.5.
- `DEV_BUILD` is `1.5.5-issue-35-hr-diagnostics`.
- `DEV_BRANCH` remains `WITCH_DEV_MAIN`.
- `PAYLOAD_REF` is exact immutable issue payload `25275c35ac8e54a691e2c3a4d152889700e51d79`.
- Canonical manifest launcher registry is synchronized to v1.5.5.
- Public Stable remains untouched.

### Required live gate

Reload through Dev Auto Host and require launcher v1.5.5, payload `25275c35ac8e…`, Loader complete 25/25 with zero failures / immutable=25 / fallback=0, Texture Quality v0.4.0, and High Res Diagnostics service/UI v0.1.0.

---

## 2026-09-24 — Issue #24 public v2.0.3 Stable closeout

### PASS

- Stable v2.0.3 / `2.0.3-issue-24-colorbake-restore`; immutable payload `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`.
- Loader complete: 23/23 executed, 0 failed, immutable=23, fallback=0.
- Texture Quality v0.3.7 / `0.3.7-refresh-native-color-bake`.
- Amanda accepted the Stable ON→OFF visual body-tint result.
- Intermittent `bodyLower native color-bake mask was not adopted` warning is isolated to #34.
- Dev/Stable Texture Quality source SHA is `09d92a14595077d49ec928263c6aab7ca3ef468a`.
- 36/36 shared non-launcher runtime JS/CSS blobs match exactly.
- #24 removed from `DEV_DIVERGENCES.json`; Stable baseline advanced to `0a5ee9c99f1ca999ead93baa39948d8595830064`.
- Six disposable #24 refs are queued through `docs/BRANCH_DELETION_HANDOFF_ISSUE_24_2026-09-24.md` because this connector has no branch-delete action.

**Runtime/module/public behavior changed:** no. Manifest provenance metadata and project/release records only.

---

## 2026-09-24 — Canonical Dev launcher v1.5.4 candidate for issue #24

### PASS / pending integrated live reload

- Tampermonkey identity remains fixed `WITCH DOCK - DEV` / `KnightWitch`.
- `@version` and runtime `DEV_VERSION` are synchronized at v1.5.4.
- `DEV_BUILD` is `1.5.4-issue-24-colorbake-restore`.
- `DEV_BRANCH` remains `WITCH_DEV_MAIN`.
- `PAYLOAD_REF` is exact immutable payload `6aee7fd8716d986e39b7415cf8927fa7043e776b`.
- Payload manifest launcher registry is synchronized to v1.5.4 and contains Texture Quality Native Reconcile v0.3.7.
- Public Stable and #32 remain untouched.

### Required live gate

Reload through Dev Auto Host and require launcher v1.5.4, payload `6aee7fd8716d…`, Loader complete with zero failures, Texture Quality v0.3.7 / `0.3.7-refresh-native-color-bake`, then exact Quinn and D4 OFF output-hash restoration after ON→OFF.

---

## 2026-09-24 — Issue #24 native color-bake restore candidate

### Classified failure

- Quinn fresh OFF body hashes were `3ce98341` / `027a4ba6`; ON-to-OFF settled at `00c1b356` / `4bece629` while model paint hashes, native 512 masks/AAIDs, gradient bytes, atlas, allocations, source sizes, and `lastRestoreVerification.ok` remained correct.
- A bounded native color-bake probe (`invalidateCache()` then `refresh(true)`) restored the body hashes exactly to `3ce98341` / `027a4ba6`; face stayed byte-identical at `843a3d53`.

### Candidate

- Texture Quality Native Reconcile v0.3.7 / `0.3.7-refresh-native-color-bake`.
- After native source/material adoption settles, restore invalidates and forcibly refreshes each adopted figure's color-bake cache, waits for stability again, and records/verifies the refresh count before reporting OFF success.
- Public Stable and #32 are untouched.

### Validation

- PASS: syntax, manifest/divergence JSON, registry/source/cache-key identity, and whitespace checks.
- Pending: live candidate ON-to-OFF output-hash regression on Quinn and D4, then the bounded fixture regression required by the issue #24 plan before Amanda's human visual gate.

---

## 2026-09-24 — #24 regression handoff checkpoint

### PASS

- Confirmed `WITCH_DEV_MAIN` remains at `49206661f6a7c9b155368d937ccb59a2754f3857`; no Dev runtime mutation was made during public v2.0.2 promotion.
- Confirmed public Stable is v2.0.2 @ `1b7d45bad6a602ffe6a39d9457b64f7daeca72d8` and #24 remains open.
- Persisted Quinn/D4/Blood Moon visual failures, High Res 404/resource-load signature, script-isolation matrix, and exact next diagnostic sequence.
- #32 color-zone collapse remains explicitly separate.
- Documentation only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-24 — Canonical Dev launcher v1.5.3 candidate for issue #24

### PASS / pending integrated live reload

- Tampermonkey identity remains fixed `WITCH DOCK - DEV` / `KnightWitch`.
- `@version` and runtime `DEV_VERSION` are synchronized at v1.5.3.
- `DEV_BUILD` is `1.5.3-issue-24-texture-restore`.
- `DEV_BRANCH` remains `WITCH_DEV_MAIN`.
- `PAYLOAD_REF` is exact immutable payload `74b8fc9c08cd816f4b50919aeee46f751fb1975c`.
- Payload manifest launcher registry is synchronized to v1.5.3 and contains Texture Quality Native Reconcile v0.3.6.
- Launcher syntax, manifest JSON, version/build/payload consistency, and whitespace checks pass.
- Public Stable remains untouched.

### Required live gate

Reload through Dev Auto Host and require launcher v1.5.3, payload `74b8fc9c08cd…`, Loader complete with zero failures, Texture Quality v0.3.6 / `0.3.6-verify-native-restore-adoption`, and an idle native OFF state with matching display/resource atlases.

---

## 2026-09-24 — Dev payload v1.5.3 preparation for issue #24

### PASS

- Payload parent is canonical Dev merge `1bcf5be3d3a0f9779434938f65f712ed88e5cd7d`.
- Payload contains Texture Quality Native Reconcile v0.3.6 / `0.3.6-verify-native-restore-adoption`.
- Robot, Human, Canine, Half Dragon, three AAT75R fixtures, and two Lob fixtures passed A-D live regression; Amanda's human visual gate passed.
- Dev launcher registry advances to v1.5.3 / `1.5.3-issue-24-texture-restore`.
- Public Stable remains untouched.
- Next gate: pin the canonical Dev launcher to this exact payload, reload through Auto Host, and verify launcher, loader, module identity, and settled native OFF state.

---

## 2026-09-23 — Issue #24 native restore-adoption candidate

### Classified failure

- All required fixtures first diverge at the ON-to-OFF transition.
- `paints`, `paintByIntent`, shader references, and part IDs remain stable.
- Native atlas dimensions, allocations, and bake sizes restore, but previously promoted `_usedTextureSize` values persist and body color materials adopt a shared 1×1 fallback mask.
- A bounded Lob2 probe proved that restoring native body source sizes and rerunning native color-material setup replaces the 1×1 masks with the correct native 512px resources without changing the native atlas.

### Candidate

- Texture Quality Native Reconcile v0.3.6 / `0.3.6-verify-native-restore-adoption`.
- Captures each target's native `bakeSize` and `_usedTextureSize` at enable time.
- After HeroForge's native restore generation settles, reapplies those native sizes to the adopted generation, rebuilds color materials, waits again, and refuses OFF success unless native atlas, allocation, target source sizes, and body-mask dimensions all match baseline.
- Uses the same verified restore path for failed-enable rollback.
- Exposes compact `lastRestoreVerification` diagnostics; no UI or persistence contract changed.

### Static checks

- PASS: module syntax (`node --check`), manifest and `DEV_DIVERGENCES.json` parsing, registry/source/cache-key version consistency, and clean diff whitespace.
- PASS: isolated service initialization smoke confirms v0.3.6 diagnostics and visibility lifecycle registration.
- PASS: focused mocked native-generation regression reproduces HeroForge's disable-time source re-promotion plus 1×1 body-mask fallback; v0.3.6 restores body source sizes/masks, restores face source size, records `lastRestoreVerification.ok=true`, and reports clean OFF.

### Required live gate

1. Load the issue #24 candidate service on a fresh controlled fixture.
2. Retest Robot + Human A-D first and confirm restore verification passes with baseline source sizes and native body masks.
3. Retest Canine + Half Dragon, then the three AAT75R fixtures, then both Lob ON-to-OFF sequences using compact diffs.
4. Confirm Stable remains untouched and hand the fully automated Dev result to Amanda for the final visual gate.

**Runtime/module/manifest/public behavior changed:** Dev Texture Quality native restore behavior and diagnostics changed; public Stable unchanged.

---

## 2026-09-23 — #24 stop-condition guard

### PASS

- Guard is compact and requires live readback plus exhaustion of safe autonomous steps before Work may stop.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-23 — Issue #24 background visibility interpretation

### PASS

- Verified Bridge transport while Amanda remained in Discord.
- Current HeroForge state read back coherent with no update in progress.
- Timing probe #3109 observed 177 requestAnimationFrame callbacks in ~3.5 s and document visibility visible.
- #24 plan now forbids treating OS foreground focus as a Bridge requirement and treats hidden document state as diagnostic evidence only.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — HF-Chat-Bridge Work access correction

### PASS

- Live GitHub-mailbox `bridge.ping` #3049 completed successfully.
- Bridge reported v0.4.0, page context available, DEV writes enabled, workbench available, pump running, zero consecutive errors.
- #24 plan now requires actual mailbox ping evidence before declaring Bridge unavailable.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Issue #24 interruption-safe Work plan

### PASS

- #24 now checkpoints after meaningful fixture phases without stopping execution.
- Interrupted runs resume from durable state rather than re-running completed probes.
- Bridge mutations retain at-most-once/readback-before-retry discipline.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Issue #24 fixture identity guard

### PASS

- Work plan now prevents embedded JSON metadata/config IDs from silently overriding Amanda's explicit fixture URL/label mapping.
- JSON exports remain usable as expected paint/channel evidence.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Issue #24 expanded regression-plan preflight

### PASS

- #24 now contains the new AAT75R, controlled channel, and Lob restore-drift fixtures.
- Investigation order is explicit: Robot -> Human -> Canine/Half Dragon -> AAT real fixtures -> Lob restore drift -> unconfirmed cross-figure decal shift.
- Compact runtime snapshot fields and causal decision tree are defined.
- Core Tweaks console flooding is isolated to low-priority #29.
- Compatibility history is not preloaded; consult only for unresolved engine seams.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Issue #20 branch cleanup verification

### PASS

- Live branch inventory contains exactly the six protected refs.
- All four temporary issue #20 refs are gone.
- Issue #14 contains the verified completion comment.
- `ACTIVE_CONTEXT.md` no longer routes to pending janitorial work.
- Issue #24 remains the active task.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Issue-closeout branch deletion handoff standard

### PASS

- Live branch inventory re-read before handoff creation.
- Four issue #20 temporary refs still exist at the audited SHAs.
- All four have zero unique commits relative to their canonical Dev/Stable destinations.
- Exact six-ref protected post-delete inventory recorded.
- Binding contract and workflow now require this handoff pattern for completed issues when direct ref deletion is unavailable.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Release branch deletion handoff standardization

### PASS

- Live branch inventory checked before handoff creation: 10 refs total.
- Exact DELETE set: four issue #20 disposable release refs.
- Exact expected post-delete KEEP inventory: six branches.
- Each DELETE ref was previously proven safely reachable from canonical Dev/Stable history.
- Reusable handoff template added and release contract/workflow updated.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Issue #20 post-release reconciliation

### PASS

- Public Stable v2.0.1 final human gate passed.
- Stable baseline recorded at `33ff83599951a896d4bfcec180081a9b400a7f0b`.
- Dev/Stable shared runtime parity: 39 JS/CSS files compared, 0 differences.
- Booth v27.1.0 is canonical in both channels.
- Issue #20 divergence removed; issue #19 remains intentional.
- `ACTIVE_CONTEXT.md` now routes to issue #24.
- Short-lived #20 refs proven ancestor/identical to canonical heads and queued on #14 for mechanical deletion.
- No runtime/module/manifest behavior changed.

---

## 2026-09-21 — Issue #20 human / real-file gate

### PASS

- Booth Settings JSON UI visually accepted by Amanda.
- Save Settings successfully exported a real Booth JSON file.
- Load Settings successfully loaded/restored from that file.
- Combined with automated Bridge validation, issue #20 Dev acceptance is complete.
- Stable promotion is not yet authorized; public Stable remains unchanged.
- Documentation-only update; no runtime/module/manifest behavior changed.

---

## 2026-09-21 — Exact issue #20 payload / canonical candidate

### PASS / pending live gate

- Final immutable payload commit: `22d9f9e0bbf90675b52474eb736663fd8d5df7ea`.
- Payload contains Booth v27.1.0 including current-mode mismatch fail-closed guard.
- Dev launcher remains v1.5.2 / `1.5.2-issue-20-booth-json` and now pins that exact payload.
- Temporary validation harness removed from the canonical candidate tree and remains non-runtime history only.
- Next gate: fast-forward `WITCH_DEV_MAIN`, Auto Host reload, require launcher v1.5.2 + payload `22d9f9e0bbf9…`, Loader 23/23 / 0 failed, then exercise real `KW_WD_BOOTH` file-state API and unaffected-media smoke.
- Public Stable unchanged.

---

## 2026-09-21 — Issue #20 canonical Dev launcher gate

### PASS

- Tampermonkey identity remains fixed `WITCH DOCK - DEV`.
- Launcher metadata/runtime version synchronized at v1.5.2.
- Launcher branch remains `WITCH_DEV_MAIN`.
- Immutable payload pin is `0bb96bd18b735ddb458dc1fb4f20f8c82cb037ed`.
- Public Stable unchanged.

### Required live gate

Reload through Dev Auto Host and verify launcher v1.5.2, Loader 23/23 with zero failures, Booth tool v27.1.0, then exercise Booth JSON round-trip and regressions.

---

## 2026-09-21 — Issue #20 immutable payload preparation

### PASS

- Booth tool candidate remains v27.1.0 and parses.
- Manifest launcher registry identity is v1.5.2 / `1.5.2-issue-20-booth-json`.
- Existing Loader v0.2.0 immutable-payload architecture is unchanged.
- Payload contains the exact Booth JSON candidate selected for live validation.
- Public Stable unchanged.

### Next

Pin canonical Dev launcher v1.5.2 to this immutable payload commit, then reload through Dev Auto Host and run the #20 live gate.

---

## 2026-09-21 — Issue #20 isolated harness preflight

### PASS / next gate

- Candidate stays isolated on `wd/20-booth-json-repair`.
- Harness is not registered in the Witch Dock manifest and cannot load in public Stable.
- Exposes only bounded capture/apply/memory/dispose operations for Bridge validation.
- Wrapper files fail closed on explicit Booth-mode mismatch.
- Next gate: install harness once, reload, then Bridge performs capture -> controlled mutation -> memory restore -> domain readback.

---

## 2026-09-21 — Dev launcher v1.5.2 candidate

### PASS / pending live gate

- Tampermonkey identity remains fixed `WITCH DOCK - DEV` / `KnightWitch`.
- @version and runtime DEV_VERSION both 1.5.2.
- DEV_BUILD is `1.5.2-issue-20-booth-json`.
- DEV_BRANCH remains `WITCH_DEV_MAIN`.
- PAYLOAD_REF is exact immutable commit `791320c49d1038ce0d8d7c311ab2dea8abd7d983`.
- Payload manifest launcher registry is synchronized to v1.5.2.
- Public Stable untouched.
- Required next gate: Auto Host reload, require v1.5.2 + payload `791320c49d10…`, Loader 23/23 / 0 failed, then Booth JSON functional regression.

---

## 2026-09-21 — Dev payload v1.5.2 preparation

### PASS

- Payload source includes Booth v27.1.0 candidate and synchronized Booth cache identity.
- Dev launcher registry advanced to v1.5.2 / `1.5.2-issue-20-booth-json`.
- Core/loader/module architecture unchanged.
- Public Stable untouched.
- Next gate: canonical Dev launcher pin to this exact immutable payload, then auto-host reload and live #20 regression.

---

## 2026-09-21 — Issue #20 Booth JSON candidate preflight

### Candidate checks / required live gate

- `booth-tool` version/build synchronized to v27.1.0 / `v27.1.0-booth-json-file-io`.
- File I/O uses named current Hero Forge Booth APIs rather than resurrecting legacy `TN.tokenizer.effectState.toJson/fromJson`.
- Export is full Booth config via `savePortrait()`; import is full config via `loadPortrait()`.
- Camera and effects use Hero Forge-owned current restore paths.
- Legacy Lob effect-only files are detected explicitly and applied only to the effects domain; nested JSON-string payloads are normalized once for older `toJson()` output.
- Manifest registry and manifest Booth URL cache key both resolve to v27.1.0.
- Invalid/unrecognized files fail closed before mutation.
- Required live gate: export distinctive Booth setup -> mutate -> import -> compare camera/background/lighting/effects/overlays; repeat after Booth exit/re-entry; verify legacy effects-only import; verify Persistent Booth, Black Canvas, true-resolution capture, and Spinny topology remain healthy.
- Public Stable unchanged.

---

## 2026-09-21 — Post-cleanup documentation normalization

### PASS

- Live repository confirms `WITCH_DEV_UI` and `WITCH_DEV` are deleted.
- `WITCH_DEV_MAIN` is the only canonical Dev branch.
- Six protected/operational long-lived refs remain from cleanup; current issue #20 additionally owns one short-lived task branch.
- Binding contract, active router, and cleanup handoff now distinguish current branches from retired historical refs.
- Next-work routing is #20 Booth JSON -> #24 submitted High Res regressions -> #25 targeted object/KB/tail/hair expansion and optimization.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Branch-retirement execution complete

### PASS

- Deleted exactly the 49 refs named in `docs/BRANCH_CLEANUP_HANDOFF_2026-09-20.md` after its stated bootstrap prerequisite was satisfied.
- Live post-delete inventory is exactly the six protected KEEP branches; no additional branch remains.
- Issue #13 received the verified result; issue #11's migration/cleanup gate is complete.
- No runtime/module/manifest/public behavior, Stable, Dev payload, or rollback content changed.

---

## 2026-09-20 — Issue #28 RC host handoff refresh

### Recorded evidence

- Public RC host branch: `wd/28-public-rc-host` @ `536b89c7747e0a2f1f0f31561b1194ea00f73f3f`.
- Host file blob: `a494af2fd74de66204789667e0fecdee111c8b40`.
- RC source remains `wd/28-public-rc` @ `95b5cdae4c8840d950d984c73bce101ba887011e`.
- Public Stable and archive remain `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.
- Bridge ping #2961: SUCCESS, userscript v0.4.0, page context available, pump healthy, DEV writes enabled.

### Next live gate

Install the temporary RC host, disable normal Dev/Public Dock instances for the gate, reload once, then run exact public-channel/loader/interactions/tool smoke through Bridge and obtain Amanda's visual confirmation. Do not mutate Stable before explicit promotion approval.

**Runtime/module/manifest/public behavior changed:** no; handoff documentation only.

---

# Pre-Flight Check Log

## 2026-09-20 — Branch-retirement execution router

### PASS

- Canonical Dev now routes directly to issue #13 and the completed branch cleanup handoff.
- Exact six-branch protected set recorded.
- Exact prerequisite for retiring `WITCH_DEV_UI` recorded.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-20 — Branch cleanup audit / legacy harvest

### PASS

- Full branch inventory: 55.
- Required keep set: 6.
- Planned delete set: 49.
- Current public/Dev immutable payload refs and Dev Auto Host delivery branch explicitly protected.
- Legacy #26 bone references copied into canonical Dev before `GPT_DEV` retirement.
- Open issues #7 and #20-#26 cross-checked for branch dependencies.
- `WITCH_DEV_UI` deletion correctly gated on updating the external ChatGPT project bootstrap pointer to `WITCH_DEV_MAIN`.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-20 — Issue #28 Stable smoke + janitorial reconciliation

### PASS

- `Witch_Scripts` is exact tested commit `95b5cdae4c8840d950d984c73bce101ba887011e`.
- Actual public Stable userscript smoke passed through HF-Chat-Bridge #2967.
- Launcher v2.0.0 / Core v2.0.0 / Loader v0.2.0.
- Loader: 23/23 fetched and executed; 0 failed; immutable resolution=23; fallback=0.
- Legacy monolith/source transforms both false.
- Temporary Public RC Host and Dev Auto Host absent from Stable smoke page.
- Exactly one Dock, compact shell, and compact icon.
- All promoted runtime/core/tool file blobs match canonical Dev exactly.
- Non-launcher manifest registry entries match canonical Dev.
- Dev launcher v1.5.1 and Dev Auto Host v0.1.1 still route to `WITCH_DEV_MAIN`; no Stable fallback.
- Issue #28 divergence removed; issue #19 canonical Dev channel divergence retained.
- Rollback archive and immutable public payload ref preserved.

**Runtime behavior changed:** no; release closeout records only.

---

Rolling current Dev pre-flight record. Older detail remains in Git history/issues.

## PFC-2026-09-20-051 — Public promotion handoff checkpoint

Date: 2026-09-20

### Confirmed durable state

- Canonical Dev live PASS at v1.5.1 / Core v2.0.0 / Loader v0.2.0 / 23/23 / 0 failed.
- Stable baseline preserved at `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.
- Rollback archive branch exists.
- Public payload `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`.
- Public RC `95b5cdae4c8840d950d984c73bce101ba887011e`.
- RC live gate not yet run.
- Bridge userscript grants are insufficient to faithfully execute the exact public launcher directly.
- No Stable mutation has occurred.

**Runtime/module/manifest/public behavior changed:** none.

---

## PFC-2026-09-20-049 — Canonical Dev v1.5.1 smoke PASS

Date: 2026-09-20

### PASS

- Auto-host: v0.1.1, target `WITCH_DEV_MAIN`, payload launcher v1.5.1, one attempt, no error.
- Dev launcher: branch `WITCH_DEV_MAIN`, payload `6603911658b426c6b95367697bedcc4c7acf67eb`, running/error-null.
- Core v2.0.0 running.
- Loader v0.2.0: 23/23 executed, 0 failed, immutable=23, fallback=0.
- Legacy monolith/source transforms false.
- One Dock/compact/icon; title `WITCH DOCK - DEV v1.5.1`.

### Next

Preserve Stable rollback baseline, then construct isolated public RC. Do not mutate `Witch_Scripts` before explicit approval.

**Runtime/module/manifest/public behavior changed:** none.

---

## PFC-2026-09-19-048 — Canonical Dev reconciliation candidate v1.5.1

Date: 2026-09-19

### Static / integration checks

- Canonical launcher parses.
- Fixed Tampermonkey identity remains `WITCH DOCK - DEV`.
- Launcher version/build: v1.5.1 / `1.5.1-canonical-dev-reconcile`.
- Launcher update/download URLs and `DEV_BRANCH` resolve to `WITCH_DEV_MAIN`.
- Launcher payload ref is exact immutable commit `6603911658b426c6b95367697bedcc4c7acf67eb`.
- Payload manifest launcher registry is synchronized to v1.5.1.
- Payload retains 23 runtime modules; no fallback URL references `wd/10-modular-bootstrap`.
- Core v2.0.0 and Loader v0.2.0 are unchanged.
- Reconciliation preserves main-only task/mode governance and issue #10 validated history.
- Public Stable is untouched.

### Required live gate

Bridge-reload after canonical merge and require v1.5.1 / branch WITCH_DEV_MAIN / payload `660391...`, Core v2.0.0 running, Loader 23/23 / 0 failed, immutable resolution=23 / fallback=0, and normal Dock state before creating the public RC.

**Runtime/module/manifest/public behavior changed:** Dev channel/release identity only.

---

## PFC-2026-09-19-045 — Issue #10 final human visual PASS

Date: 2026-09-19

### PASS

- Automated Stage E regression was already PASS on v1.5.0.
- Amanda performed the required subjective visual check and confirmed the current live Dock looks normal.
- Issue #10 acceptance is complete.
- Validated baseline remains launcher v1.5.0 / Core v2.0.0 / Loader v0.2.0 / payload `6cbc7c5530391d3b8611374ce051bde080ea1a2d` / 23/23 / 0 failed.
- No Stable branch mutation is part of this closure.

### Next boundary

Do not resume #10. Public release work, if requested, should use an isolated release-candidate/publicization flow with current Stable preserved as an immutable rollback point and explicit promotion approval.

**Runtime/module/manifest/public behavior changed:** documentation/acceptance state only; public Stable unchanged.

---

## PFC-2026-09-19-044 — Stage E automated live PASS

Date: 2026-09-19

### PASS

- Auto-host: v1.5.0 launcher-executed, one attempt, no error.
- Payload commit: `6cbc7c5530391d3b8611374ce051bde080ea1a2d`.
- Launcher: immutable payload=true; legacy monolith fetch=false; legacy source transforms=false; status=running/error-null.
- Core: v2.0.0 / build `2.0.0-modular-orchestrator`, started/running.
- Loader: v0.2.0 / build `0.2.0-immutable-payload-root`; 23/23 fetched+executed, 0 failed; immutable resolutions=23, fallback resolutions=0.
- Application: 6 tabs / 9 tools / 12 sections / 0 pending.
- Interactions: minimize, close/reopen, Dock drag, corner/bottom resize, compact drag/click, and grave-key hotkey all exercised with lastError=null.
- History: genuine queue boundary retained; no synthetic history; lastError=null.
- Modals: About and Disclaimer open/close passed.
- Bone HUD: configured/initialized/connected, failed=false.
- Public `WitchDock.registerTool`, `ensureDock`, and `downloadBlob` remain callable.
- Representative Booth, Body Editor, and JSON tool DOM mounted.
- Utilities real section reorder persisted and inverse drag restored exact baseline; temporary collapse state restored.
- Final state: Booth active, Dock 380x520 at x=565/y=244, compact hidden.

### Remaining gate

Human visual confirmation only: current v1.5.0 Dock should look normal. Do not close #10 until that visual gate is affirmative.

**Runtime/module/manifest/public behavior changed:** Dev Stage E candidate validated; public Stable unchanged.

---

## PFC-2026-09-19-043 — v1.5.0 immutable launcher activation candidate

Date: 2026-09-19

### Static checks

- Launcher source parses.
- Metadata identity/grants/update/download URLs remain the existing Dev userscript identity.
- Payload ref is exact commit SHA `6cbc7c5530391d3b8611374ce051bde080ea1a2d`.
- Launcher has no `Witch_Dock.user.js`, `devSource`, application-block, drag-block, or Stable-monolith transform tokens.
- Expected component versions/builds include Core v2.0.0 and Loader v0.2.0 immutable payload-root build.
- Diagnostics default to `legacyMonolithFetched=false` and `legacySourceTransforms=false`.

### Required live gate

Bridge-reload through Dev auto-host after task-branch fast-forward. Require launcher running/error-null, pinned immutable payload diagnostics, Core v2.0.0 started/running, Loader 23/23 / 0 failed with immutable-payload-root source mode, and the full Stage C/D interaction/UI/history regression surface.

**Runtime/module/manifest/public behavior changed:** Dev Stage E activation candidate only; public Stable unchanged.

---

## PFC-2026-09-19-042 — Stage E immutable payload candidate

Date: 2026-09-19

### Static / architecture checks

- Core v2.0.0 source parses and owns composition/startup only.
- Assets v0.1.0 source parses and preserves the exact legacy compact emblem data URL.
- Module Loader v0.2.0 source parses and preserves concurrent fetch + ordered execution + per-module failure isolation.
- Loader immutable mode resolves from `KWWitchDockPayloadRoot` and `moduleRegistry.path`; legacy `modules[].url` is fallback-only.
- Manifest remains 23 runtime modules; every runtime module has a registry path.
- Core/Assets/Loader registry version/build metadata is synchronized.
- No Stable code or legacy `Witch_Dock.user.js` mutation is included.

### Activation rule

Create this payload as a detached commit and readable payload ref first. Only after that commit exists may the Dev launcher be changed to pin the exact payload commit SHA. Do not move the live task branch onto a launcher that references a payload that does not yet exist.

**Runtime/module/manifest/public behavior changed:** isolated Stage E payload candidate; public Stable unchanged.

---

## PFC-2026-09-19-041 — Stage D COMPLETE / v1.4.13 Application live PASS

Date: 2026-09-19

### PASS

- Auto-host payload v1.4.13; launcher running/error-null.
- Application v0.1.0 configured=true / lastError=null.
- Loader 23/23 / 0 failed.
- 6 tabs / 9 tools / 12 sections.
- Public `WitchDock.registerTool`, `ensureDock`, `downloadBlob` remain callable.
- Dock geometry remains 380x520 CSS at x=820/y=244.
- Real section drag reorder persisted and inverse drag restored exact baseline order.
- Application telemetry: 2 drag starts / 2 drops; no error.

### Stage disposition

Stage D is complete. Proceed to Stage E final bootstrap reduction. Do not touch public Stable during Stage E development.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-040 — v1.4.13 final Stage D Application Shell candidate

Date: 2026-09-19

### Static / contract checks

- Application v0.1.0 parses and contains the full guarded legacy el-through-registerTool application block with storage redirected to Preferences and history sync redirected to History.
- Application contains no raw GM_* privilege.
- v1.4.6 computed CSS width/height snapshot fix is physically present in Application.
- Launcher v1.4.13 parses, fetches/validates/configures Application, guards exactly one application-shell block and replaces it with thin wrappers.
- Obsolete source transforms for section collapse/order and Dock snapshot are removed.
- Isolated application-block transformed core parses.
- Manifest JSON parses and launcher/Application versions/builds are synchronized.

### Baseline

- Dock: 380x520 CSS at x=820/y=244.
- Tabs rendered in canonical order: Body Editor, Pose, Decals, Booth, JSON, Utilities; Booth active.
- Registry: 6 tabs / 9 tools / 0 pending.
- Sections: 12 total.
- Public WitchDock registerTool/ensureDock/downloadBlob all functions.
- Booth -> Utilities -> Booth normal clicks persist activeTab correctly and preserve geometry.
- Utilities sections: booth-features, bound-decal-gizmo, heroforge-ui.
- Evidence: `hf-20260919-wd10-stageD-app-baseline-044`, `hf-20260919-wd10-stageD-app-interaction-baseline-045`, `hf-20260919-wd10-stageD-section-baseline-046`.

### Required live gate

Auto-host v1.4.13, require Application configured/error-null and loader 23/23 / 0 failed; compare exact counts/order/public seams/geometry; repeat tab switch; perform one reversible Utilities section reorder and restore it before closing Stage D.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-039 — v1.4.12 History live boundary PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.12, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- History: v0.1.0 / build `0.1.0-undo-redo-owner`, configured=true, queueAvailable=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Genuine queue remained length=1 / currentIndex=0 / canUndo=false / canRedo=false.
- Both Dock history buttons remained disabled and clicking both left queue/index unchanged.
- No fallback character load occurred; no synthetic queue history was introduced.
- Evidence: `hf-20260919-wd10-v1412-history-gate-043`.

### Next bounded action

Inventory remaining Stage D ownership against `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`. Do not begin Stage E until ordinary application-shell responsibilities are either externally owned or deliberately assigned to the final GitHub-owned application core.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-038 — v1.4.12 undo/redo History candidate

Date: 2026-09-19

### Static / contract checks

- New History v0.1.0 source parses and preserves the live legacy CK.UndoQueue + CK.tryLoadCharacter behavior.
- Launcher v1.4.12 parses, fetches/validates History through the existing bounded repo transport, guards exactly one early history block, and replaces it with configure + thin wrappers.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses; launcher/history versions and builds are synchronized.
- History module receives no GM capability and HF-Chat-Bridge remains test infrastructure only.

### Safe baseline

- Genuine HeroForge queue: length=1, currentIndex=0.
- Undo button disabled; Redo button disabled.
- Clicking both at boundary leaves length/index exactly 1/0.
- No synthetic queue entry or model mutation was created merely to obtain test coverage.
- Evidence: `hf-20260919-wd10-v1412-undo-baseline-read-040`, `hf-20260919-wd10-v1412-history-boundary-041`.

### Required live gate

Bridge-reload through Dev auto-host, verify v1.4.12 / History v0.1.0 / loader 23/23, then require the same genuine boundary state and no-op behavior. Non-boundary undo/redo can be verified later when genuine history exists.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## PFC-2026-09-19-037 — v1.4.11 Dock hotkey live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.11, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- Interactions: v0.5.0 / build `0.5.0-dock-hotkey`, configured=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Ctrl+Backquote left Dock open and compact hidden.
- Plain Backquote closed to compact.
- Second plain Backquote restored exact 380x520 Dock and hid compact.
- Telemetry: installDockHotkeyCalls=1, hotkeyToggleCalls=2, hotkeyIgnoredCalls=1.
- Evidence: `hf-20260919-wd10-v1411-hotkey-gate-039`.

### Next bounded slice

Inspect and extract undo/redo ownership without widening scope.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-036 — v1.4.11 Dock hotkey candidate

Date: 2026-09-19

### Static / contract checks

- Interactions v0.5.0 parses and owns editable-target detection + the capture-phase Dock hotkey listener.
- Launcher v1.4.11 parses, pins interactions v0.5.0, requires `installDockHotkey`, guards exactly one legacy hotkey block, and replaces it with a thin wrapper while preserving the existing startup call site.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses and launcher/interactions registry versions/builds are synchronized.
- Undo/redo, DOM/CSS, storage keys, loader, and Stable are outside this slice.

### Baseline

- Ctrl+Backquote: ignored, Dock remains open.
- Plain Backquote: Dock closes to compact.
- Second plain Backquote: Dock reopens at exact 380x520, compact hidden.
- Evidence: `hf-20260919-wd10-v1411-hotkey-baseline-037`.

### Required live gate

Bridge-reload through Dev auto-host, verify v1.4.11 / interactions v0.5.0 / loader 23/23, repeat modifier-ignore + close/open sequence, and require exact parity plus hotkey telemetry.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## PFC-2026-09-19-035 — v1.4.10 compact drag/click live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.10, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- Interactions: v0.4.0 / build `0.4.0-compact-drag-click`, configured=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Real drag: compact 16/907 -> 34/921, prefs match, Dock remains hidden.
- Inverse real drag: compact restored exactly to 16/907.
- No-drag pointer cycle: compact hidden; Dock restored at 380x520.
- Telemetry: compact starts=3, moves=2, ends=3, cancels=0, click-expands=1.
- Evidence: `hf-20260919-wd10-v1410-compact-gate-036`.

### Next bounded slice

Extract Dock hotkey ownership only. Keep undo/redo outside this slice.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-034 — v1.4.10 compact drag/click candidate

Date: 2026-09-19

### Static / contract checks

- Interactions v0.4.0 parses and owns the full compact pointer lifecycle.
- Launcher v1.4.10 parses, pins interactions v0.4.0, requires `startCompactDrag`, guards exactly one legacy compact-drag block, and replaces it with a thin wrapper.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses and launcher/interactions registry versions/builds are synchronized.
- Hotkey/undo-redo, DOM/CSS, storage keys, loader, and Stable are outside this slice.

### Baseline

- Collapse -> compact visible at x=16/y=907; Dock hidden.
- +18/+14 pointer movement crosses threshold -> compact x=34/y=921, prefs match, Dock stays hidden.
- Inverse drag -> exact x=16/y=907.
- No-drag pointerdown/up -> compact hidden; Dock reopens at 380x520.
- Evidence: `hf-20260919-wd10-v150-compact-baseline-034`.

### Required live gate

Bridge-reload through Dev auto-host, verify v1.4.10 / interactions v0.4.0 / loader 23/23, repeat drag/inverse/no-drag sequence, and require exact DOM/prefs parity plus compact interaction telemetry.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## PFC-2026-09-19-033 — v1.4.9 Dock resize live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.9, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- Interactions: v0.3.0 / build `0.3.0-dock-resize`, configured=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Corner: 380x520 -> 402x537 -> 380x520; all persisted width/height + last-open values matched.
- Bottom: 380x520 -> 380x547 -> 380x520; width remained unchanged, height + lastOpenHeight matched.
- Resize telemetry: corner 2/2/2 start/move/end; bottom 2/2/2.
- Evidence: `hf-20260919-wd10-v149-resize-gate-032`, `hf-20260919-wd10-v149-resize-telemetry-033`.

### Next bounded slice

Extract compact launcher drag/click ownership. Keep hotkey/undo-redo outside this slice.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## PFC-2026-09-19-032 — v1.4.9 Dock resize candidate

Date: 2026-09-19

### Static / contract checks

- Interactions v0.3.0 parses and retains both legacy resize calculations and state/listener lifecycles.
- Launcher v1.4.9 parses, pins interactions v0.3.0, requires both resize methods, passes bounded `computeMinDockHeightCollapsed`/clamp/viewport/prefs helpers, and guards exactly one legacy resize block before replacing it with thin wrappers.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses; launcher/interactions registry versions/builds are synchronized.
- Compact drag, hotkey/undo-redo, CSS/DOM, storage keys, loader, and Stable are outside this slice.

### Baselines

- Corner: 380x520 -> 402x537, all width/height + last-open fields match; restored exactly to 380x520.
- Bottom: 380x520 -> 380x547, width remains unchanged and height + lastOpenHeight track; restored exactly to 380x520.
- Evidence: `hf-20260919-wd10-v149-corner-baseline-027`, `hf-20260919-wd10-v149-corner-restore-028`, `hf-20260919-wd10-v149-bottom-baseline-029`, `hf-20260919-wd10-v149-bottom-restore-030`.

### Required live gate

Bridge-reload through the Dev auto-host, verify v1.4.9 / interactions v0.3.0 / loader 23/23, then repeat both reversible resize sequences and require exact DOM/prefs parity plus module telemetry.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## PFC-2026-09-19-031 — v1.4.8 main Dock drag live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.8, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- Interactions: v0.2.0 / build `0.2.0-main-dock-drag`, configured=true, lastError=null.
- Loader: 23/23 / 0 failed.
- Drag parity: 820/244 -> 844/262 for +24/+18, then exact inverse restore to 820/244 in both DOM and persisted prefs.
- Telemetry: startDockDragCalls=2, dockDragMoveCalls=2, dockDragEndCalls=2.
- Evidence: `hf-20260919-wd10-v148-state-025`, `hf-20260919-wd10-v148-drag-cycle-026`.

### Next bounded slice

Capture baseline and extract corner + bottom resize ownership only. Keep compact drag and hotkey/undo-redo out of that slice.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## PFC-2026-09-19-030 — v1.4.8 main Dock drag candidate

Date: 2026-09-19

### Static / contract checks

- Interactions v0.2.0 parses and retains legacy drag calculations/listener lifecycle.
- Launcher v1.4.8 parses, pins interactions v0.2.0, requires `startDockDrag`, passes bounded clamp/viewport/prefs helpers, and guards exactly one legacy drag block before replacing it with a thin wrapper.
- Isolated transformed Stable-derived core parses.
- Manifest JSON parses; launcher/interactions registry versions/builds are synchronized.
- No resize, compact-drag, hotkey/undo-redo, CSS/DOM, storage-key, loader, or Stable change is included.

### Baseline

- Start DOM/prefs x=820, y=244.
- +24/+18 drag -> DOM/prefs x=844, y=262.
- Inverse drag -> DOM/prefs restored exactly to x=820, y=244.
- Evidence: `hf-20260919-wd10-v148-drag-baseline-023`.

### Required live gate

Bridge-reload through the Dev auto-host, verify v1.4.8 and interactions v0.2.0, then repeat the reversible drag sequence and require exact DOM/prefs parity plus loader 23/23 / 0 failed.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## PFC-2026-09-19-029 — v1.4.7 lifecycle extraction live PASS

Date: 2026-09-19

### PASS

- Auto-host payload: v1.4.7, launcher-executed, one attempt, no error.
- Launcher: running/error-null.
- `witch-dock-interactions`: v0.1.0 / build `0.1.0-minimize-compact-lifecycle`, configured=true, lastError=null.
- Loader: 23 total / 23 enabled / 23 executed / 0 failed.
- Baseline parity:
  - open 380x520 CSS at x=820/y=244;
  - minimize 380x92;
  - restore 380x520;
  - collapse hides Dock and shows compact at x=16/y=907;
  - no-drag compact reopen restores exact open geometry and hides compact.
- Module counters: toggleMinimizeCalls=2, closeDockCalls=1, expandFromCompactCalls=1.
- Evidence: `hf-20260919-wd10-v147-state-021`, `hf-20260919-wd10-v147-cycle-022`.

### Next bounded slice

Extract main Dock drag ownership only. Do not move resize, compact drag, hotkey, or undo/redo in the same slice.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## PFC-2026-09-19-028 — v1.4.7 lifecycle extraction candidate

Date: 2026-09-19

### Protected behavior

- Preserve 380x520 open CSS geometry and the v1.4.6 content-box snapshot correction.
- Preserve minimize height/restore behavior, close-to-compact visibility, remembered compact position, no-drag compact reopen, one root/compact/icon, and all preference keys.
- Keep compact pointer threshold/drag mechanics, main drag/resize, hotkey/undo-redo, tabs/sections, loader ordering/cache/failure isolation, and Stable outside this slice.

### Static evidence

- New interactions module parses and exposes only configured non-privileged lifecycle methods plus diagnostics.
- Launcher v1.4.7 parses, fetches/validates the new module through the existing bounded host transport, configures it from the transformed core, and guards exactly one legacy lifecycle block before replacing it with thin wrappers.
- Raw legacy lifecycle seam contains the expected minimize/close/expand contracts; the isolated transformed core parses.
- Manifest JSON parses; launcher and module registry versions/builds are synchronized.

### Pre-change live baseline

- Open: 380x520 CSS / 382x522 rendered at x=820/y=244.
- Minimized: 380x92 CSS; restored exactly to 380x520.
- Collapsed: Dock hidden; compact visible at x=16/y=907.
- No-drag compact pointer cycle: Dock restored to exact original geometry; compact hidden.
- Evidence: `hf-20260919-wd10-v147-baseline-018`, `hf-20260919-wd10-v147-baseline-cycle-019`.

### Required live gate

Auto-host the pushed v1.4.7 revision, Bridge-reload HeroForge, then repeat the baseline sequence and require exact parity plus interactions module configured/error-null and loader 23/23 / 0 failed.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## PFC-2026-09-18-027 — v1.4.6 geometry live PASS / refactor pause

Date: 2026-09-18

### Gate result

- Launcher v1.4.6: `running`, `error:null`.
- Shell v0.2.0: one root create + one compact create, no error.
- Loader: 23/23 / 0 failed.
- Baseline persisted geometry: 380x520 CSS, x=292, y=845; rendered outer box 382x522.
- Collapse state: Dock hidden, compact visible, one root/compact/icon, persisted width/height and last-open width/height still 380x520.
- Reopen state: Dock visible, compact hidden, one root/compact/icon, persisted geometry still 380x520, rendered outer box still 382x522, x/y unchanged.
- No duplicate-node, loader, shell, or geometry regression remains.

### Required next action

- PAUSE issue #10 for the HF-Chat-Bridge upgrade.
- Do not perform another refactor extraction or promotion step until explicit resume.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## PFC-2026-09-18-026 — Compact geometry stability candidate

Date: 2026-09-18

### Confirmed cause

- Pre-cycle rendered outer box: 382x522 from persisted 380x520 CSS dimensions.
- Legacy snapshot captured the outer box and saved 382x522 as future CSS width/height.
- Reopen therefore rendered 384x524.
- Root is content-box; borders are outside the declared CSS width/height.
- Persisted test geometry has been restored to 380x520 before this candidate gate.

### Protected behavior

- Preserve x/y and anchored-state snapshot behavior.
- Preserve compact constructor and icon contract from v1.4.5.
- Preserve close/open lifecycle, compact drag threshold, minimize, expand, size constraints, preference ownership, loader and public seams.
- Change only width/height snapshot source from outer bounding box to computed CSS dimensions, falling back to bounding dimensions only if computed values are not finite.

### Static evidence

- Launcher v1.4.6 parses.
- Guard requires one exact `snapshotCurrentDockPositionToPrefs()` block and the two legacy bounding-box assignments before replacement.
- Transformed Stable-derived core parses and no longer contains the legacy width/height snapshot assignments.
- Manifest launcher registry is synchronized; normal manifest module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.6 and reload.
2. Confirm launcher running/error null; loader 23/23 / 0 failed; shell v0.2.0 still applies once.
3. Confirm persisted CSS width/height and last-open dimensions start at 380x520; rendered outer Dock box is 382x522.
4. Normal Collapse-to-icon once; read back hidden Dock + visible compact with one root/compact/icon.
5. Normal no-drag compact reopen once.
6. Confirm persisted width/height and last-open dimensions remain exactly 380x520; rendered outer Dock box remains 382x522; compact hides; node counts remain 1/1/1.
7. Record PASS, then PAUSE issue #10 for the HF-Chat-Bridge upgrade. Do not begin another refactor slice.

**Runtime/module/manifest/public behavior changed:** task-branch geometry snapshot correction only; public Stable and canonical Dev unchanged.

---

## PFC-2026-09-18-025 — Compact launcher DOM extraction candidate

Date: 2026-09-18

### Protected behavior

- Preserve one `#kwWDCompact` with title `Open Witch Dock`.
- Preserve one `#kwWDCompactIcon`, inline emblem data URL, alt `Witch Dock`, draggable false, 48x48 icon inside the existing 54x54 compact button.
- Preserve `showClosedCompact`, `startCompactDrag`, `closeDock`, `expandFromCompact`, compact position persistence and Dock hotkey behavior unchanged.
- Preserve main Dock geometry and all loader/storage/tool behavior.

### Static evidence

- Shell v0.2.0 parses and adds only `createCompact()` plus one diagnostic counter.
- Launcher v1.4.5 parses, validates the expanded shell API, guards the exact compact constructor block and replaces only that constructor.
- The transformed Stable-derived core parses with legacy compact lifecycle/drag functions untouched.
- Manifest versions are synchronized; normal module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.5 and reload.
2. Confirm launcher running/error null; shell v0.2.0 applied once; loader 23/23 / 0 failed.
3. Confirm one compact node/icon and exact baseline attributes/sizes.
4. Use the normal Collapse-to-icon control once; confirm main Dock hides and compact appears.
5. Click the compact launcher once without dragging; confirm main Dock returns, compact hides, geometry is preserved and no duplicate root/compact nodes exist.
6. Do not drag the compact launcher in this slice.

**Runtime/module/manifest/public behavior changed:** task-branch compact DOM ownership only; public Stable and canonical Dev unchanged.

---

## PFC-2026-09-18-024 — v1.4.4 main-shell DOM live PASS

Date: 2026-09-18

### Gate result

- Launcher v1.4.4: `running`, `error:null`.
- Shell v0.1.0 / build `0.1.0-main-root-dom`: applied exactly once, no shell error.
- Loader v0.1.2: complete at 23/23 / 0 failed.
- One Dock root only; exact root child order preserved.
- Header controls and tab-frame/right control structure match baseline.
- Body/footer/bottom-resizer/corner-resizer refs remain present.
- Compact launcher remains present exactly once.
- Rendered root box remains 382x522 at the preserved baseline position.
- No human visual gate required because the automated DOM and geometry parity checks matched exactly.

### Next action

- Diagnose compact/minimize/layout lifecycle only. Do not broaden into drag/resize or hotkey/undo-redo extraction.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## PFC-2026-09-18-023 — Main-shell DOM factory extraction candidate

Date: 2026-09-18

### Protected behavior

- Preserve exactly one `#kwWitchDock` root with the same direct child order and IDs.
- Preserve existing header drag, Disclaimer/About/minimize/close callbacks, tab frame, Undo/Redo callbacks, body/footer, and resize-handle callbacks.
- Preserve position/sizing, compact mode, main/compact drag, minimize/close/expand, tab overflow, hotkeys, undo/redo implementation, tabs/tools/sections, registry containers, storage and loader behavior.
- Do not move compact launcher DOM in this slice.

### Static evidence

- New `Witch_Dock_Shell.js` v0.1.0 parses and exposes only `createRoot()` plus diagnostics.
- Shell module requires the existing legacy `el()` helper and existing callbacks rather than duplicating their behavior.
- Launcher v1.4.4 parses, fetches/validates the shell module, and guards the exact legacy root-construction/state-ref block before replacing only that block.
- The raw-core shell-root seam is unique and the transformed core parses.
- Manifest registry includes `witch-dock-shell` v0.1.0 and synchronized launcher v1.4.4; normal module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.4 and reload HeroForge.
2. Confirm launcher running/error null and shell v0.1.0 applied exactly once.
3. Confirm loader remains 23/23 / 0 failed.
4. Confirm exactly one `#kwWitchDock` exists and direct child order remains Header/Tabs/Body/Footer/BottomResize/CornerResize.
5. Confirm header controls, tab-frame/right controls, body/footer/resizer references and compact launcher all remain present.
6. Confirm current size/position remains normal and no visual difference appears.
7. Human visual gate only if appearance differs.

**Runtime/module/manifest/public behavior changed:** task-branch main-shell DOM ownership only; public Stable and canonical Dev unchanged.

---

## PFC-2026-09-18-022 — v1.4.3 registry-container live PASS

Date: 2026-09-18

### Gate result

- Launcher v1.4.3: `running`, `error:null`.
- Registry v0.1.0 / build `0.1.0-tab-tool-state-containers`: applied.
- Registry state after startup: 6 tabs, 9 tools, 0 pending.
- Loader v0.1.2: complete at 23/23 / 0 failed.
- Rendered tabs: Body Editor, Pose(active), Decals, Booth, JSON, Utilities.
- Rendered mounted tool IDs match the nine-tool baseline; 12 sections remain.
- `registerTool`, `ensureDock`, and `downloadBlob` all remain callable functions.
- No human visual gate required because this slice moved backing containers only and rendered layout/order matched baseline exactly.

### Next action

- Diagnose shell/layout ownership only. Keep drag/resize/minimize/compact, hotkeys and undo/redo outside the slice until their own bounded extraction.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## PFC-2026-09-18-021 — Registry backing-container extraction candidate

Date: 2026-09-18

### Protected behavior

- Preserve `UW.WitchDock.registerTool`, `UW.WitchDock.ensureDock`, and `UW.WitchDock.downloadBlob`.
- Preserve duplicate tool replacement, pending-before-UI queue semantics, tab creation/order/active-tab persistence, module render calls, section DOM lifecycle, section order/drag, and sizing.
- Do not introduce a synthetic section registry where none exists.
- Preserve loader order/concurrency/failure isolation and all v1.4.2 preference/storage behavior.

### Static evidence

- New `Witch_Dock_Registry.js` v0.1.0 parses and owns only one tabs Map, one toolsById Map, and one pending Array, with diagnostic `getState()`.
- Launcher v1.4.3 parses, fetches/validates the registry module, and guards the exact legacy three-allocation state block before redirecting only those fields.
- The exact raw-core registry allocation seam occurs once; the transformed core parses with the legacy allocation block absent.
- Manifest registry includes the new bootstrap module and synchronized launcher version; normal manifest module count remains 23.
- Checked-in `Witch_Dock.user.js` is unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.3 and reload HeroForge.
2. Confirm launcher running/error null and `KWWitchDockRegistry` v0.1.0 applied.
3. Confirm loader remains 23 total / 23 enabled / 23 executed / 0 failed.
4. Confirm registry reports six tabs, nine tools, zero pending after startup.
5. Confirm rendered tab order and Pose active state match baseline; rendered tool IDs and 12-section count match baseline.
6. Confirm `registerTool`, `ensureDock`, and `downloadBlob` remain callable.
7. No human visual gate is required unless the Dock appearance differs.

**Runtime/module/manifest/public behavior changed:** task-branch registry backing-state ownership only; public Stable and canonical Dev unchanged.

---

## PFC-2026-09-18-020 — v1.4.2 tool-enablement live PASS

Date: 2026-09-18

### Gate result

- Launcher v1.4.2: `running`, `error:null`.
- Preferences v0.3.0: configured, no tool-enablement errors.
- Loader v0.1.2 clean baseline/final: 23 total, 23 enabled, 23 started, 23 fetched, 23 executed, 0 failed.
- OFF persistence test: normal Decals Scroll Guards checkbox produced exact page key `"false"`, one page + one host preference write, live disable, then reload with 22 enabled/executed, 0 failed and only that module disabled.
- ON restore test: normal checkbox produced exact page key `"true"`, one page + one host write, async live API/style restoration, then final reload at 23/23 / 0 failed.
- No human visual gate required; this slice moved persistence ownership only and the Utility control/state behavior remained normal.

### Follow-up requirement retained

- The pre-update v1.4.1 launcher/newer-v0.3.0 preferences mismatch proves branch-relative bootstrap payloads can skew against an older installed launcher.
- Treat this as issue #10 Stage E bootstrap/orchestration hardening. Preserve strict module contracts while making launcher/runtime source identity immutable or otherwise compatibility-safe.
- Do not alter Stable or canonical Dev for this finding during task-branch Stage D work.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## PFC-2026-09-17-019 — Tool-enablement persistence extraction candidate

Date: 2026-09-17

### Protected behavior

- Preserve exact `kw.witchDock.toolEnabled.<id>` keys.
- Preserve bootstrap Tampermonkey-only reads, module-loader page-local-only reads, Utilities page-first/host-fallback reads, and mirrored Utility page+host writes.
- Preserve all manifest scheduling, deterministic cache identity, parallel fetch, ordered execution, failure isolation, and Utility live enable/disable behavior.
- No tab/registry/drag/resize/minimize/hotkey/undo/redo ownership moves.

### Static evidence

- Preferences v0.3.0 parses and exposes explicit host-only, page-only, page→host, and mirrored-write tool-enablement methods.
- Launcher v1.4.2 parses, injects only bounded host storage plus bounded page getItem/setItem capability, and guards the exact legacy bootstrap `getToolEnabled()` block before replacing it with the host-only preference read.
- Module loader v0.1.2 parses and no longer directly reads `localStorage` for tool enablement; it uses the page-only preference method.
- Utilities source parses and no longer directly reads/writes localStorage or GM storage for `kw.witchDock.toolEnabled.*`; its existing read/write helpers delegate to preferences.
- Manifest remains valid with 23 normal modules and synchronized launcher/preferences/loader/Utilities versions.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.2 and refresh HeroForge.
2. Confirm launcher running/error null; preferences v0.3.0; loader v0.1.2 complete with 23/23 / 0 failed.
3. Confirm the two Utilities HeroForge UI toggles remain checked/enabled and existing page keys remain `"true"`.
4. Toggle `expanded-ui-scroll-guards` OFF once through its normal Utility checkbox; confirm page key becomes `"false"`, preference page+host write diagnostics increment, and the feature disables normally.
5. Reload once; confirm loader records that module disabled from page storage while unrelated modules retain order/failure isolation.
6. Restore the Utility ON through normal UI, verify mirrored write diagnostics/page key `"true"`, then reload or otherwise confirm restored startup parity before leaving the gate.
7. Human visual gate only if appearance changes; this slice is persistence ownership only.

**Runtime/module/manifest/public behavior changed:** task-branch tool-enablement persistence ownership and module/launcher versions changed; public Stable unchanged.

---

## PFC-2026-09-17-018 — Section preference-store extraction candidate

Date: 2026-09-17

### Protected behavior

- Preserve exact `kw.witchDock.ui.<tool>.<section>.collapsed` and `kw.witchDock.sectionOrder.<tool>` keys.
- Preserve collapsed default/read-failure behavior, boolean writes, order JSON parse/filter/write behavior, DOM reorder algorithm, drag thresholds, and click semantics.
- No tool-enable, tab, drag/resize/minimize, undo/redo, or HeroForge integration ownership moves.

### Static evidence

- Preferences v0.2.0 parses, exposes bounded section collapsed/order methods, and contains no raw GM storage calls.
- Launcher v1.4.1 parses and requires the new preference API methods before evaluating the transformed core.
- Guarded transforms verify exact legacy collapse/order storage markers before replacing only storage helpers.
- Full transformed core parses; raw section-collapse/order GM storage calls are absent after transformation.
- Normal manifest-loaded module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.1 and manually refresh HeroForge.
2. Confirm launcher running/error null, preferences v0.2.0, loader 23/23 / 0 failed.
3. Confirm Booth section remains first and expanded on initial load.
4. Toggle Booth section collapsed once; confirm bounded collapsed-write diagnostic increments with exact key `kw.witchDock.ui.booth-tool.booth.collapsed`.
5. Manually reload and confirm Booth section starts collapsed; restore it expanded and confirm no error.
6. Preserve section order and no duplicate/missing section symptoms.
7. Human visual gate only if section appearance changes; pure persistence extraction should be visually identical.

**Runtime/module/manifest/public behavior changed:** task-branch section preference ownership and module/launcher versions changed; public Stable unchanged.

---

## PFC-2026-09-17-017 — Stage D main preference-store extraction candidate

Date: 2026-09-17

### Protected behavior

- Storage key remains exactly `kw.witchDock.v1`.
- Defaults remain x/y null, 380x520, open/not minimized, remembered last-open values, activeTab null, compactX 16, compactY null, firstRun false.
- Legacy load behavior remains: missing/falsy/invalid/non-object data -> defaults + firstRun true; valid object -> defaults merged with stored object + firstRun false.
- Legacy save behavior remains JSON stringify to the same userscript storage namespace with errors swallowed by the core wrapper.
- No shell interaction ownership moves in this candidate.

### Static evidence

- Preferences module v0.1.0 parses and receives only bounded `storage.get/storage.set`; it contains no raw `GM_getValue` / `GM_setValue`.
- Launcher v1.4.0 parses and fetches core/CSS/modals/bone/preferences concurrently.
- Guarded transform requires one exact legacy preference declaration block and one exact main preference IO block before replacing them with wrappers to `KWWitchDockPreferences`.
- Full candidate CSS -> preferences -> bone -> modal -> manifest transform parses.
- Main-store raw `GM_getValue(STORE_KEY...)` / `GM_setValue(STORE_KEY...)` calls are absent after transformation.
- Manifest-loaded module count remains 23; preferences is bootstrap-owned, not another normal module.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev to v1.4.0 and manually refresh HeroForge.
2. Confirm launcher running/error null, preferences v0.1.0 configured, loader 23/23 / 0 failed.
3. Confirm the pre-existing Dock position/size/open state survives the update/reload.
4. Exercise one normal preference write (bounded move/resize/minimize cycle) and confirm `KWWitchDockPreferences.getState()` records saves with no error.
5. Reload once and confirm the changed preference survives through the same `kw.witchDock.v1` store.
6. Confirm compact/minimize/tabs and unrelated modal/Booth behavior show no regression.
7. Human visual gate only if the shell visibly differs; otherwise this is persistence/behavioral, not a redesign.

### Live result

PASS:
- v1.4.0 / preferences v0.1.0 healthy; loader 23/23 / 0 failed.
- Pre-existing 368/157/660x914 open geometry survived initial update/reload.
- Minimize action persisted through bounded storage with no error.
- Exact post-reload module snapshot proves startup loaded `minimized:true`, width 660, height 92, last-open 660x914, activeTab Booth, firstRun false.
- Amanda confirmed the reloaded Dock looked good and then returned it to an expanded state through normal UI behavior.
- No persistence regression observed.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/bootstrap preference ownership and registry changed; public Stable unchanged.

---

## PFC-2026-09-17-016 — Bone HUD/detection extraction candidate

Date: 2026-09-17

### Baseline / protected behavior

- Current in-core baseline captured through Bridge: one visible bone row; label `Bone:`; value `No bone detected (click a body bone)`; copy button disabled; footer hotkey text preserved; no toast until copy.
- Preserve exact detection candidate paths/scoring, pointerup + click capture listeners, 35 ms post-click sample delay, 60 readiness tries, 250/1000 ms retry cadence, 750 ms post-start rebuild check, failure/retry UI, and copy toast behavior.
- Preserve CSS ownership in already-extracted `Witch_Dock_Styles.css`.

### Candidate checks

- `Witch_Dock_Bone_HUD.js` v0.1.0 / build `0.1.0-extracted-bone-hud` parses successfully.
- Extracted module contains no direct `GM_setClipboard`; bounded launcher host clipboard is injected via `configure()`.
- Launcher v1.3.9 parses successfully and fetches core/CSS/modals/bone HUD in parallel.
- Guarded transform requires exactly one legacy bone init and one legacy `getScriptMeta()` seam before replacing them with a wrapper to `KWWitchDockBoneHUD.init()`.
- Manifest registry adds only the bootstrap-owned bone module; manifest-loaded module count remains 23.
- Checked-in `Witch_Dock.user.js` remains unchanged.

### Required live gate

1. Update fixed-name Dev install to v1.3.9 and manually refresh past HeroForge's promotional splash.
2. Confirm launcher running/error null, bone module v0.1.0 configured/initialized, loader 23/23 / 0 failed.
3. Confirm one bone row and exact baseline footer text/layout; no duplicate row/toast/listener symptom.
4. Compare current detector readiness against the legacy source contract. If current HeroForge no longer satisfies the legacy anchors, record that as a separate compatibility bug rather than expanding #10.
5. Confirm no extraction-specific duplicate row/listener/toast symptom and preserve retry/failure behavior.
6. Human visual gate: bone footer looks unchanged.

### Live result

- Launcher v1.3.9: running / error null; bone module v0.1.0 configured+initialized; loader 23/23 / 0 failed in 504 ms.
- One bone row with exact pre-extraction idle text/layout and disabled copy button; no toast present.
- `HF.summonCircle` exists and reports ready, but every legacy anchor candidate used by both Stable-derived core and extracted module is absent on current HeroForge.
- Detector therefore remains stopped/unattached exactly because the preserved legacy candidate builder returns no paths. This is not extraction-caused.
- Opened #26 for post-refactor reconstruction of a current stable bone-selection seam.
- Human visual gate PASS: Amanda confirmed the Bone footer looks normal/unchanged.
- Stage C is complete; proceed to Stage D application-shell extraction without pulling #26 repair into the refactor.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/bootstrap bone-HUD ownership and registry changed; public Stable unchanged.

---

## PFC-2026-09-17-015 — Event-driven media readiness handoff

Date: 2026-09-17

### Diagnosis

- v1.3.8 launcher/modal baseline: running/error null; modal v0.1.1 configured; loader 23/23 / 0 failed in 345.1 ms.
- Fresh modal lifecycle: About first-open/reopen and Disclaimer mutual exclusion/reopen passed with one overlay each; all six close paths (button/backdrop/Escape for both) passed.
- Booth v27.0.5 / bootstrap v0.2.0 remained native-ready/error-null with one Booth script, but 4K/8K/WebP stayed disabled after 2.5 s and 6 s.
- Manual existing readiness seams immediately corrected UI: TRUE-resolution readiness `sync()` returned true; WebP capability returned Ready; WebP UI `refresh()` returned true; all three capture surfaces became enabled.
- This confirms stale timer-driven UI synchronization, not unavailable capture capability.

### Candidate

- Booth -> v27.0.6 / build `v27.0.6-media-readiness-handoff`.
- Booth Runtime Bootstrap -> v0.2.1 / build `0.2.1-media-readiness-handoff`.
- Booth transition invokes optional `KWPhotoBoothTrueResolutionReadiness.sync()` and `KWSpinnyMiniWebPUI.refresh()`.
- Bootstrap completion/failure invokes the same optional capability seams after clearing in-flight state.
- Polling timers remain as fallback; no capture service/UI source changed.
- Manifest registry and deterministic URLs/cache keys synchronized.

### Required live gate

1. Fresh-load the new Booth/bootstrap module identities.
2. With HeroForge ready and Booth OFF, turn Booth ON once.
3. Confirm native Booth ready, one Booth script / zero duplicates / bootstrap error null.
4. Without manual media sync calls, confirm 4K/8K/WebP become enabled.
5. Turn Booth OFF; confirm media controls refresh/disable without relying on interval polling.
6. Turn Booth ON again; confirm live-BT reuse, zero duplicates, and media controls enable again.
7. Leave Booth OFF.
8. Human modal visual gate remains required after automated regressions pass.

### Live result

PASS on a manual HeroForge reload:
- loader 23/23 / 0 failed in 221.9 ms;
- Booth v27.0.6 + bootstrap v0.2.1 loaded from the task branch;
- first ON bootstrapped native Booth, one matching Booth script / zero duplicates / no bootstrap error, and 4K/8K/WebP enabled without manual `sync()` / `refresh()`;
- OFF disabled all three media surfaces;
- second ON reused live BT, retained one Booth script / zero duplicates, and re-enabled all three;
- final state returned Booth OFF;
- About modal v0.1.1 is open for the remaining human visual gate.

**Runtime/module/manifest/public behavior changed:** task-branch Booth tool/bootstrap and cache identities changed; public Stable unchanged.

---

## PFC-2026-09-17-013 — Explicit Booth session handoff candidate

Date: 2026-09-17

### Scope

Issue #10 task branch: remove the proven dependency of an explicit Booth View request on the bootstrap's 200 ms polling timer while preserving HeroForge's native Booth ownership contract.

### Evidence / candidate

- v1.3.7 modal baseline passed: running/error null; modal v0.1.0 configured; no overlays before first use; loader 23/23, 0 failed in 499.8 ms.
- About/Disclaimer automated lifecycle passed: one overlay each, expected title/footer/content/links, mutual exclusion, no duplicate creation, and final closed state.
- Ready HeroForge page with native BT absent: explicit Booth session request remained pending for both 2.5 s and 10 s while bootstrap attempts stayed at 0; 4K/8K/WebP remained disabled. The timer-only trigger did not execute on that page.
- `booth-runtime-bootstrap` is v0.2.0 / build `0.2.0-explicit-session-handoff` and exposes bounded `requestSession()`.
- Booth is v27.0.5 / build `v27.0.5-explicit-session-handoff`; its source-local/public API version fields are also synchronized at 27.0.5.
- The source-sync correction uses a fresh deterministic build/cache identity so validation cannot reuse the earlier stale branch-ref response.
- `onUserBoothToggle(true)` invokes the optional bootstrap handoff after updating current-session state; the existing 200 ms poll remains a fallback.
- Bootstrap still loads at most one version-matched HeroForge `/gated/booth.js`, delegates activation to native `BT.setBoothMode()`, and does not directly force `maker.enable()`.
- Manifest registry and deterministic module URL cache keys are synchronized. Static syntax checks passed for both changed modules and manifest JSON.

### Required live gate

1. Fresh-load v27.0.5 / bootstrap v0.2.0.
2. From a ready page with BT absent, request Booth once; `directSessionRequests` and `attempts` must increment.
3. Confirm one Booth script, BT/maker ready, bootstrap error null, and 4K/8K/WebP enabled.
4. Loader remains 23/23 with zero failures.
5. Booth off/on creates no duplicate script and leaves saved/default settings unchanged.
6. Human gate: About and Disclaimer look/behave normal.

**Runtime/module/manifest/public behavior changed:** task-branch Booth activation handoff and module/cache-key versions changed; public Stable unchanged.

---

## PFC-2026-09-17-012 — Extracted About/Disclaimer candidate

Date: 2026-09-17

### Scope

Issue #10 on `wd/10-modular-bootstrap`: move About/Disclaimer UI implementation out of the Stable-derived monolith into a GitHub-owned bootstrap module without changing visible behavior or unrelated Dock contracts.

### Prior live evidence

- v1.3.6 external CSS automated + human visual gates passed.
- Booth v0.1.2 blocker final PASS after normal manual HeroForge refresh: one native Booth script, native maker/runtime ready, 4K/8K/WebP enabled, no error; off/on cycle created no duplicate and preserved persistence/defaults. Bridge requests: `hf-20260917-wd10-booth-final-activate-001`, `hf-20260917-wd10-media-controls-final-001`, `hf-20260917-wd10-booth-cycle-final-001`.

### Candidate

- Launcher v1.3.7 / build `1.3.7-extracted-core-modals`; fixed Tampermonkey `@name WITCH DOCK - DEV` retained.
- New `features/core/Witch_Dock_Modals.js`, registry id `witch-dock-modals`, v0.1.0 / build `0.1.0-extracted-about-disclaimer`, load role `bootstrap-module`.
- Core, CSS, and modal JS are fetched in parallel through bounded repository `requestText`.
- Modal module is configured only with bounded script metadata plus existing GitHub/Ko-fi URLs; raw Tampermonkey APIs are not exposed.
- Launcher guards exactly one legacy modal block and exactly one occurrence of each six legacy modal functions before replacing only those implementations with wrappers to `UW.KWWitchDockModals`.
- `getScriptMeta()` remains in core for bone HUD. Existing buildUI header handlers are unchanged.
- Checked-in `Witch_Dock.user.js` remains byte-identical to the Stable-derived source.
- Manifest registry is synchronized: launcher v1.3.7, modal v0.1.0, Booth v0.1.2 retained; normal manifest modules remain 23 and bootstrap loader remains unchanged.
- Attempted Bridge pre-install parser helper `hf-20260917-wd10-modals-static-001` failed in the helper's nested config JSON before candidate code executed (`ConfigError`); do not treat it as candidate syntax evidence or retry that mutation request.

### Required live gate

1. Existing fixed-name Dev install updates in place to v1.3.7 and page starts with Dev state `running`, `error:null`, `coreModalsMode:external-bootstrap-module`, `coreModalsApplied:true`.
2. `KWWitchDockModalsInfo` is v0.1.0/build `0.1.0-extracted-about-disclaimer`, applied by `bootstrap-module`; `KWWitchDockModals.getState()` is configured with no overlays before first use.
3. About creates one legacy-id overlay/modal, correct title/version/links/content, supports close button/overlay/Escape, and reopening does not duplicate it.
4. Disclaimer creates one legacy-id overlay/modal, closes About, preserves exact content/version, supports close button/overlay/Escape, and reopening does not duplicate it.
5. Module loader remains 23/23 with zero failures; external CSS and Booth/media readiness remain healthy.
6. Human visual gate: About and Disclaimer look normal/unchanged.

Do not continue to bone HUD extraction if this gate fails; repair/rollback only the modal ownership seam.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/modal ownership and manifest registry changed; public Stable unchanged.

---

## PFC-2026-09-17-011 — Booth cold-start compatibility repair

- `Booth_Runtime_Bootstrap.js` v0.1.2 / build `0.1.2-session-cold-start` reacts to current-session Booth View, loads one version-matched native Booth script, and delegates mode/engine ownership to HeroForge `BT.setBoothMode()`.
- Direct `maker.enable()` bypass experiment was rejected and removed.
- Final clean live gate PASS: normal-ready cold page -> Booth request -> one script, maker enabled, runtime/engine ready, 4K/8K/WebP enabled, zero bootstrap errors; off/on cycle no duplicate or persistence/default drift.

---

## PFC-2026-09-17-010 — External core stylesheet

- v1.3.6 / `Witch_Dock_Styles.css` v0.1.0, guarded parity, bounded host insertion, one effective stylesheet.
- Loader 23/23, 0 failed; Amanda confirmed Dock visual appearance normal.

---

## Current prior pre-flights

- **009:** 48px compact emblem in unchanged button; PASS.
- **008:** known-good inline emblem restore; PASS.
- **007:** stable Tampermonkey Dev identity; PASS.
- **006:** external emblem candidate; visual FAIL and rolled back.
- **005:** v1.3.1 host-owned core fetch; PASS.
- **004:** v1.3.0 privileged-host seam; PASS.
- **003:** issue #10 monolith contract freeze.
