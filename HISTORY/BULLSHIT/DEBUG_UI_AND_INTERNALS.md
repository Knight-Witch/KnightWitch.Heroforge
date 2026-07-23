# Debug UI and Internal Runtime References

Historical notes extracted from the archived HeroForge `DebugLive` bundle and Lob's compatibility userscripts.

## Status

- Historical diagnostic reference only.
- The archived bundle identifies itself as `Prod 11/6/24`, branch `release/hf_2024_11_06`, build `V30190`.
- Do not load or integrate the complete debug userscript into Witch Dock.
- Treat every API, webpack module ID, object path, permission gate, and UI component as version-bound until current runtime probing confirms it.

## Source Snapshot

Files supplied in the GPT project:

- `Enable Debug on HeroForge-0.1.txt`
- `Enable Debug on HeroForge-0.2.txt` / duplicate `Enable Debug on HeroForge-0.2(1).txt`

Source hashes are recorded in `HISTORY/REFERENCES/README.md`.

## Loader Behavior

The userscript performs two separate operations:

1. Waits for `CK`, then sets:
   - `CK.User.permissions.test = true`
   - `CK.Settings.debug = true`
2. Replaces a requested gated `debuglive` script with an archived HeroForge webpack chunk loaded from a Blob URL.

This is why the interface appears native: the script is primarily restoring HeroForge's own archived debug module rather than independently recreating the UI.

Version `0.2` additionally blocks obsolete requests for:

- `/static/herobundles/test.ckb`
- `/static/textures/grid.jpg`

It also changes an old release-data path from `CK.Options.decalsBySlot.releases` to `CK.Options.releases`.

## Native Debug Sections

The archived top-level interface exposes:

- Releases
- Smoke testing
- Scene
- Textures
- Data
- Parts
- Mods
- Poses
- Display
- Animator
- CSV

Most of this is internal production QA tooling, not finished user-facing functionality.

## High-Value Technical References

### Scene graph outliner

The Scene panel:

- recursively traverses `CK.scene`;
- searches node names;
- displays node name/type/UUID relationships;
- attaches an `EX.Transformer` directly to a selected scene node;
- disables orbit controls while the transformer is dragging;
- requests render refreshes after interaction.

Use this as a reference for tolerant scene discovery and native transform-gizmo behavior. Do not assume direct scene-node transforms persist into character JSON.

### Texture and material-uniform inspector

The Textures panel:

- combines flattened character meshes with scene occlusion meshes;
- inspects primary and bake-material uniforms;
- identifies texture uniforms;
- renders GPU textures into a temporary render target;
- reads RGBA pixels back into canvases;
- exposes full RGBA plus individual red, green, blue, and alpha channels.

This is relevant to AAID, mask, baked-color, custom-texture, material-binding, and lighting/shadow investigation. The archived implementation changes renderer state and does not consistently restore every field, so it is a behavioral reference rather than safe copy-paste code.

### Skeleton pose/modifier inspector

The Poses panel enumerates:

- `CK.activeDisplay.skeletons`
- `CK.activeDisplay.partSkeletons`
- `mainPoses`
- `currentPoses`
- active modifiers and modifier priorities

It toggles modifiers through each skeleton's native `changePose()` path and requests animation refreshes. This is useful for discovering modifier names, skeleton ownership, priority behavior, and runtime pose composition.

### Modifier-condition debugger

The Mods panel reads `CK.activeModded._mods.debugModCache`, evaluated conditions, source files, slots, effects, and global/part modifier groups. It can disable groups through `CK.disableMods` and `CK.disableModsGlobal`.

This is useful for diagnosing why parts or pose systems activate, but it should remain a private developer probe.

### Live character JSON editor

The Data panel reads `CK.data.getJson(true)` and applies edited JSON with `CK.change()`.

This overlaps with ReCK and dedicated JSON tools. Its main value is confirmation that HeroForge had an internal native JSON editing surface.

### Parts CSV exporter

The CSV section exports part ID, name, slot, search terms, release date/name, and description. It is simple enough to reimplement independently when needed.

## Animator Model

The archived Animator is not a conventional skeletal keyframe editor.

Observed model:

- recording listens for `characterChanged`;
- each frame is a complete HeroForge character-state snapshot;
- selecting a frame applies it with `CK.character.change(frame, true, false)`;
- rendering feeds the state sequence to internal Photo Booth/token-renderer infrastructure;
- camera start/end state is interpolated during rendering.

The feature is better described as a character-state sequence recorder/render pipeline than a bone timeline.

### Known animator defects

- Camera rotation is built from the return value of `array.push("XYZ")`; that returns a number, not the intended rotation array.
- Render can dereference missing start/end camera objects.
- Empty timelines are not safely rejected.
- Deleting the final frame can apply `undefined`.
- Render preparation mutates stored frame objects through shallow copies.
- Event listeners, scene objects, renderer settings, camera overrides, and Photo Booth dependencies have incomplete cleanup paths.
- The renderer assumes Photo Booth/token infrastructure is initialized; this is consistent with the observed crash unless Photo Booth is opened first.

Any future animation work must reconstruct the architecture with explicit validation and cleanup rather than extracting this block wholesale.

## Wireframe and Unlock Gating

The Display panel's Wireframe control only toggles character setting `settings.wireframe` through `CK.tweak()`.

The archived debug userscripts contain no `isUnlocked` implementation or check. Therefore:

- the debug UI exposes the setting;
- current rendering does not necessarily honor it;
- the actual unlock/material/render gate exists elsewhere in HeroForge core or gated bundles.

Do not treat the visible toggle as the wireframe implementation.

## Version 0.2 Compatibility Defect

Version `0.2` removed archived webpack imports corresponding to variables later referenced as `f` and `g`, but did not remove all downstream calls to `f.Z` and `g.Z`.

Result:

- the script may load farther than `0.1`;
- affected smoke-test components can still throw runtime `ReferenceError`s;
- `0.2` is an emergency compatibility patch, not a completed port.

## Recommended Extraction Order

If a current project needs these capabilities, extract one standalone probe at a time:

1. Scene Graph Inspector
2. Material/Texture Uniform Inspector
3. Skeleton Pose/Modifier Inspector
4. Character-State Recorder
5. Animation Render Pipeline Probe
6. Metadata CSV Export

Each extracted probe must use current runtime discovery, preserve lifecycle cleanup, and remain separate from live Witch Dock tools until validated.

## Related Files

- `HISTORY/BULLSHIT/KITBASHING_AND_BONES.md`
- `HISTORY/BULLSHIT/DECALS_AND_TEXTURES.md`
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`
- `HISTORY/BULLSHIT/LIGHTING_SHADOW_REFRESH_DIAGNOSTICS.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
- `HISTORY/BULLSHIT/TIMING_AND_STATE.md`
- `HISTORY/STANDALONE_REFERENCES.md`
- `HISTORY/REFERENCES/README.md`
