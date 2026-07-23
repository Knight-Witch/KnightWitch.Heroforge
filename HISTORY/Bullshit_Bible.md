# Bullshit Bible

Index of HeroForge engine weirdness, fragile discoveries, and recurring rules.

Use this file for high-level rules and links. Put detailed notes in `HISTORY/BULLSHIT/` topic files.

## Critical Rules

- Preserve known-good event timing.
- Do not replace `pointerup`/state-timing behavior with click-only handlers unless tested.
- Preserve delayed snapshots, retry loops, mutation handling, tolerant DOM detection, and scene-graph probing.
- Do not hard-code one path when working code probes multiple possible DOM or object paths.
- Treat working standalone Tampermonkey probes as canonical until migrated and confirmed.
- Check `HISTORY/STANDALONE_REFERENCES.md` before editing systems with external/probe history.
- Do not treat HeroForge UI layout as stable. The same UI can present as right-side grouped, split side-by-side, or bottom compact layout.
- Do not assume Photo Booth output is normal DOM/CSS. The booth frame/effects can be baked into the WebGL render path.
- Persistent Booth is live/working. Do not put it back on the open PNG-capture todo list.
- Repository documentation is the durable project memory. Do not leave validated findings, corrections, status changes, or material probe milestones only in chat.
- Use documentation checkpoints after meaningful validated results. Do not create a commit for every trivial repeated observation, but do not begin the next material probe/code stage while current docs are knowingly stale.
- When a finding is disproved or becomes outdated, correct or remove the old claim instead of appending a contradictory active claim elsewhere.
- Label uncertain conclusions as observed, inferred, or unproven. Do not promote inference to confirmed behavior without evidence.
- Treat archived HeroForge debug bundles, slot catalogs, and numbered-joint lists as historical discovery references, not current runtime contracts.
- Do not load archived external userscripts through `manifest.json` or place them beside live `/tools/` or `/HeroForge_UI/` modules.
- Preserve source filenames and hashes for large external archives even when only distilled findings are committed.

## High-Risk Current Topics

### Decals Scroll / Three UI Layouts

Detailed notes live in:
- `BULLSHIT/DOM_AND_LAYOUT.md`
- `BULLSHIT/DECALS_AND_TEXTURES.md`
- `BULLSHIT/TIMING_AND_STATE.md`

Current rule:
- Any Decals scroll/resize work must preserve detection for all three observed layouts: right-side grouped, side-by-side split, and bottom compact.
- Styling raw `#menuC` / `#menuD` globally is a known regression path.

### Photo Mode PNG Series Capture

Detailed notes live in:
- `BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `BULLSHIT/TIMING_AND_STATE.md`

Current status:
- Not solved.
- Goal is to mimic HeroForge's official high-quality spinny image-sequence exporter at higher resolution while preserving Photo Booth effects/overlays.
- Intended first target is conservative: 1024x1024, around 72 PNG frames, ZIP output, metadata, explicit arming, and validated frame dimensions.
- Prior probes captured useful signals but not a finished reliable pipeline.

### Advanced Lighting / Extra Lights

Detailed notes live in:
- `BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`
- `BULLSHIT/LIGHTING_SHADOW_REFRESH_DIAGNOSTICS.md`
- `BULLSHIT/TIMING_AND_STATE.md`
- `BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `../STANDALONE_REFERENCES.md`

Current status:
- A second custom DirectionalLight is confirmed working for visible illumination, position, and intensity.
- Independent visible custom DirectionalLight shadows are not confirmed; later controlled runs did not reproduce the initial v0.3 visual result.
- Probe v0.6.0 confirmed the two previously traced `additionalSunShadowMap` textures are ordinary static image textures for `summonCircle_shadow_512.webp` and `foliage_shadow_512.webp`, not dynamic native sun shadow render targets.
- Shadow Pipeline Probe v0.1.0 isolated the legitimate native sun refresh sequence: the native sun position changes first, then the native shadow camera and `sun.shadow.matrix` update in a short delayed second phase.
- In the isolated sun-adjustment run, the first post-interaction snapshot had the new sun position but the old shadow camera/matrix; roughly 83 ms later the camera and matrix were synchronized.
- The successful native update reused the existing shadow render-target and texture objects.
- The tested environmental-lighting preset did not alter any captured native sun or native `sun.shadow` state; this does not describe unobserved `EnvironmentLight` internals.
- A full Booth preset ended with synchronized sun and native shadow state but its composite transition timing was not isolated.
- A third custom SphereLight is counted by materials but does not visibly illuminate.
- Camera-relative Fresnel/rim lighting is queued after the physical-light foundation stabilizes.
- This is standalone sub-project work, not a live Witch Dock module.

Current rules:
- Do not call the custom DirectionalLight a second sun.
- Do not infer visible light contribution from material counts alone.
- Do not treat an allocated shadow map as proof that character materials visibly consume it.
- Do not treat `additionalSunShadowMap` as the native dynamic sun-shadow path merely because of its name; inspect the actual resource type and asset source.
- Do not claim reliable visible custom DirectionalLight shadows from the initial v0.3 observation.
- Preserve the observed two-stage native sun -> shadow-camera/matrix refresh timing until the actual method call path is identified.
- Do not assume a successful native sun move replaces the shadow render target; the isolated native control reused the existing object.
- Do not blame or modify Persistent Booth without an isolated compatibility regression.
- Keep physical DirectionalLight/SphereLight injection separate from future shader-based rim lighting.
- Keep Advanced Lighting runtime logic separate from `tools/Booth.js` even if the eventual UI lives under the Booth tab.

### Archived Debug UI / Internal Tools

Detailed notes live in:
- `BULLSHIT/DEBUG_UI_AND_INTERNALS.md`
- `BULLSHIT/KITBASHING_AND_BONES.md`
- `BULLSHIT/DECALS_AND_TEXTURES.md`
- `BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `../REFERENCES/README.md`

Current rules:
- The archived `DebugLive` bundle is a version-bound HeroForge internal QA interface, not a stable public API.
- Extract one focused standalone probe at a time; do not migrate the complete debug userscript into Witch Dock.
- Scene outliner, texture-uniform inspection, skeleton modifiers, character-state recording, and CSV export are useful references, but each requires current runtime validation.
- The archived animator records complete character-state snapshots; it is not a normal per-bone keyframe editor.
- Opening Photo Booth before render avoids one observed crash because the archived animator depends on Photo Booth/token-renderer initialization.
- The archived Wireframe control only toggles a character setting; it does not contain the current `isUnlocked` or render-path gate.
- Debug userscript v0.2 remains partially broken and must not be treated as a stable compatibility release.

### Slots, Joints, and Attachments

Detailed notes live in:
- `BULLSHIT/SLOTS_JOINTS_AND_ATTACHMENTS.md`
- `BULLSHIT/KITBASHING_AND_BONES.md`
- `BULLSHIT/DECAL_SLOT_SWAPPER.md`
- `../REFERENCES/README.md`

Current rules:
- `Sourced_Slots`, `Free_Slots`, and `Numbered_Joint_IDs` are historical snapshots only.
- `Free_Slots` is a filtered subset of the sourced catalog; the name does not prove current safety, availability, unlock state, or compatibility.
- Verify candidate slots against current `CK.Options.slots`, current skeleton/monster-group ownership, source/target relationships, and `doesConfigFit` behavior.
- Verify every joint name against the live scene/skeleton before using it.
- Preserve source defects rather than silently normalizing them; the joint snapshot contains duplicate numeric IDs and entries without `_bind_jnt` suffixes.
- Keep experimental slot/catalog mutation conditional and separate from live modules until validated.

### Standalone / External References

Detailed notes live in:
- `../STANDALONE_REFERENCES.md`
- `../REFERENCES/README.md`

Current rule:
- Working external/probe scripts must be inventoried and compared before migration or replacement.
- Deprecated pre-Witch Dock scripts should not be run beside Witch Dock unless explicitly revived for regression comparison.
- HF Core Tweaks / Lob decal-slot behavior remains an external canonical reference for slot expansion behavior.
- Large archived external sources may be represented by hashes, provenance, inventory, and distilled notes instead of being copied beside production code.

## Topic Files

- `BULLSHIT/TIMING_AND_STATE.md`
- `BULLSHIT/DOM_AND_LAYOUT.md`
- `BULLSHIT/DECALS_AND_TEXTURES.md`
- `BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `BULLSHIT/PHOTO_MODE_PNG_CAPTURE.md`
- `BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`
- `BULLSHIT/LIGHTING_SHADOW_REFRESH_DIAGNOSTICS.md`
- `BULLSHIT/DEBUG_UI_AND_INTERNALS.md`
- `BULLSHIT/SLOTS_JOINTS_AND_ATTACHMENTS.md`
- `BULLSHIT/KITBASHING_AND_BONES.md`
- `BULLSHIT/JSON_AND_LIBRARY.md`
- `BULLSHIT/MANIFEST_AND_LOADING.md`

## Backfill Queue

- Backfill any remaining PNG-series capture probes if new details surface.
- Document current bone detection timing/path behavior in deeper detail.
- Recover and inventory remaining standalone migration candidates in `HISTORY/STANDALONE_REFERENCES.md`.
- Keep Advanced Lighting / Extra Lights documentation synchronized with each material probe milestone and correction.
- If raw debug/slot archive files are later committed, preserve their recorded hashes and keep them under `HISTORY/REFERENCES/` with non-installing filenames.
