# Lighting and Shadows

HeroForge lighting, custom-light injection, shadow-path, lifecycle, and future rim-lighting discoveries.

## Status

Investigating / unresolved.

Current position:

- A second custom non-shadow DirectionalLight is confirmed working in the editor and Photo Booth.
- DirectionalLight position and intensity controls are confirmed working.
- The custom DirectionalLight survives normal editor <-> Photo Booth transitions in standalone probe testing.
- Independent DirectionalLight shadow allocation is confirmed in Photo Booth when `castShadow` is enabled before first attachment.
- Shadow refresh after later light movement or broader Photo Booth/canvas-state changes is unresolved.
- A third injected SphereLight is counted by materials but does not visibly illuminate the figure.
- Camera-relative Fresnel/rim lighting is queued after the physical DirectionalLight path is stabilized.
- None of this work is currently a live Witch Dock module.

## Documentation Confidence Labels

Use these labels when extending this file:

- **Confirmed:** directly observed in runtime and supported by probe output.
- **Observed:** user-visible behavior reported during a controlled test, but not fully isolated internally.
- **Inferred:** best current explanation supported by evidence, but not directly proven.
- **Unproven:** plausible path or hypothesis that still needs a probe.

When a later test disproves an earlier statement, correct or replace the old statement. Do not leave contradictory claims active in separate sections without an explicit historical note.

## Probe Inventory

### HeroForge Lighting Probe v0.1.0

Status:

- Read-only diagnostic probe.

Files:

- `HeroForge_Lighting_Probe_v0.1.0.txt`
- `HeroForge_Lighting_Probe_v0.1.0_diff.txt`

Purpose:

- Scan globals, object graphs, light constructors, active lighting roots, material light counts, and bundle support.
- Export diagnostic JSON without mutating the scene.

Rule:

- Keep this read-only probe separate from injection probes.
- Do not alter it to perform active light injection.

### HeroForge Lighting Injection Probe v0.1.0

Status:

- Unresolved probe / partial success.

Files:

- `HeroForge_Lighting_Injection_Probe_v0.1.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.1.0_diff.txt`

Confirmed results:

- Injected a third SphereLight that was counted by the material system but did not visibly illuminate the figure.
- Injected a second non-shadow DirectionalLight that visibly illuminated the figure.
- Established tolerant scene/light discovery and owned-object cleanup.

### HeroForge Lighting Injection Probe v0.2.0

Status:

- Unresolved probe / control and transform diagnostics.

Files:

- `HeroForge_Lighting_Injection_Probe_v0.2.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.2.0_diff.txt`

Added tests:

- DirectionalLight position presets.
- Target-height presets.
- Intensity presets.
- Post-attachment shadow toggle.
- Expanded transform, matrix, shadow-camera, map, and material diagnostics.

Observed results:

- Position changing worked in editor and Photo Booth.
- Intensity changing worked in editor and Photo Booth.
- Target changes did not visibly affect the editor, but did visibly affect Photo Booth.
- Enabling shadows after the light was already attached did not produce a reliable visible custom-shadow result.

### HeroForge Lighting Injection Probe v0.3.0

Status:

- Current canonical lighting injection probe.
- Partial working reference, not a finished tool.

Files:

- `HeroForge_Lighting_Injection_Probe_v0.3.0.txt`
- `HeroForge_Lighting_Injection_Probe_v0.3.0_diff.txt`

Key change:

- Added a DirectionalLight injection path with `castShadow: true` set before first scene attachment.
- Added controlled detach/re-attach shadow testing.

Confirmed results:

- The custom DirectionalLight rendered and remained controllable.
- Photo Booth allocated an independent custom shadow map.
- The custom shadow matrix changed from identity to a calculated projection matrix after Photo Booth became active.
- Shadow allocation did not require replacing or sharing the native sun's shadow object.
- The same custom light, target, and group identities remained attached during the successful test.

Current unresolved result:

- In a later test, the shadow map and non-identity matrix still existed, but the matrix remained unchanged after the light moved.
- Detach/re-attach did not force the matrix to update.
- The visible result was that custom shadows appeared absent, frozen, misplaced, or otherwise no longer matched the moved light.

## Runtime Lighting Structure

### Confirmed Exports

`RK` exposes at least:

- `PointLight`
- `SphereLight`
- `HemisphereLight`
- `EnvironmentLight`
- `DirectionalLight`
- `AmbientLight`
- `Light`

Renderer/shader paths were observed dynamically supporting counts for:

- directional lights;
- point lights;
- sphere lights;
- spot lights;
- rectangular area lights;
- hemisphere lights;
- environment lights.

This means HeroForge's visible two-orb UI is not a universal renderer light-count cap.

### Active Rig Discovery

Confirmed reachable paths/signals include:

- `CK.environment`
- `CK.environment.lighting`
- `HF.summonCircle.parent.parent.lighting`
- a child named `lighting`
- scene-traversal fallback

The active lighting object has exposed or observed:

- `name === "lighting"`
- `sunlight`
- `_partLightGroup`
- `partLights`
- `partLightDefaults`

Rules:

- Do not hard-code `CK.environment.children[3]` or any one numeric child path.
- Preserve tolerant alias checks and scene traversal.
- UUIDs are runtime-instance diagnostics, not stable selectors.

### Custom Attachment Path

The working probe creates an owned custom group by cloning the native part-light group non-recursively, then attaches that group as a sibling of native `partLights` under `Character0`.

Confirmed implications:

- General scene traversal can discover a custom DirectionalLight under that sibling group.
- The sibling attachment itself does not prevent DirectionalLight illumination.
- The SphereLight failure is therefore type-specific, not proof that the custom group is globally invalid.

## Second DirectionalLight

### Confirmed Working Behavior

A cloned custom DirectionalLight can:

- visibly illuminate the figure;
- use an independent color;
- use an independent intensity;
- move between tested positions;
- use an independent target object;
- persist through normal editor <-> Photo Booth transitions in standalone tests;
- be counted alongside the native sun as a second directional light.

Do not call it a second sun.

It is currently a cloned custom DirectionalLight. HeroForge's native sun has additional sun-specific systems and singular shadow paths that are not automatically duplicated.

### Position

Confirmed:

- Position presets changed the visible illumination direction.
- Tested positions included front, back, left, right, above, and below.

Required implementation behavior:

- Refresh local/world matrices after position mutation.
- Preserve tolerant method checks such as `setMatrixNeedsUpdate`, `updateMatrix`, and `updateMatrixWorld` where available.

### Targeting

Confirmed:

- The target object moved between feet, center, and head positions.
- Photo Booth visibly responded to target changes.

Observed limitation:

- The editor did not visibly respond to the same target changes during the v0.2 test.

Current interpretation:

- Target assignment itself is valid.
- Editor and Photo Booth likely differ in when or how directional vectors are refreshed or consumed.
- Exact editor suppression/update behavior remains unproven.

### Intensity

Confirmed:

- Runtime intensity mutation visibly changed the custom DirectionalLight.
- Tested values included low, medium, high, off, and numeric values.

## Directional Shadows

### Pre-Attach Requirement

Confirmed:

- Setting `castShadow: true` before the custom DirectionalLight is first attached produced a Photo Booth shadow map and calculated shadow matrix.
- Toggling `castShadow` only after attachment was not a reliable working path.

Canonical rule for the current probe:

1. Clone the native DirectionalLight.
2. Create or retain an independent shadow object.
3. Set `castShadow: true` before first attachment.
4. Attach the target and light under the owned custom group.
5. Enter or operate in Photo Booth so HeroForge allocates the shadow pass.

### Photo Booth vs Editor

Confirmed during successful v0.3 testing:

- In editor state, the custom shadow object existed but its map was null and its matrix remained identity.
- After Photo Booth became active, a custom shadow map was allocated and the matrix became non-identity.

Current rule:

- Treat Photo Booth as the confirmed custom-shadow execution environment.
- Do not claim editor custom shadows are working until directly demonstrated.

### Material Shadow Counters

Important correction:

- `numDirLightShadows` remained `0` even during the run where the user visibly observed shadows and the probe showed an allocated independent map and non-identity matrix.

Therefore:

- `numDirLightShadows` is not a reliable success criterion for HeroForge's observed Photo Booth custom-shadow path.
- Stronger indicators are `castShadow`, map allocation, calculated matrix state, and visible moving shadows.

### Stale Shadow Matrix

Confirmed in the later v0.3 report:

- The custom light moved through substantially different positions.
- The shadow map remained allocated.
- `castShadow` remained true.
- The shadow matrix remained byte-for-byte unchanged.
- Controlled detach/re-attach did not refresh the matrix.

Current diagnosis:

- The light itself remains valid and visibly controllable.
- The custom shadow pass can become stale after later movement or broader Photo Booth state changes.
- A dedicated shadow-camera/matrix refresh path is required before the feature can be considered stable.

Unproven candidates for the next probe:

- explicit shadow `needsUpdate`/`autoUpdate` handling where supported;
- direct shadow-camera matrix updates;
- renderer shadow-map invalidation;
- controlled target refresh;
- identifying the internal Photo Booth update that recalculates native sun shadows;
- recreating only the custom shadow object without replacing the light;
- reinjection after canvas/preset state commits.

Do not patch material uniforms blindly before identifying the live renderer-owned update path.

## Canvas Presets and Persistent Booth

### Canvas Presets

Observed:

- Applying a canvas preset rewrote native Photo Booth lighting properties, including native sun position, intensity, and color.
- The custom DirectionalLight, target, custom group, shadow map, and `castShadow` state remained present in the later diagnostic report.
- The custom shadow matrix nevertheless stopped following light movement.

Current interpretation:

- Canvas presets are a confirmed confounding factor because they trigger broader Photo Booth lighting-state updates.
- They are not proven to delete or disable the custom light.
- They may leave the custom shadow projection stale or bypass its refresh path.

### Persistent Booth / Witch Dock

Current status:

- Persistent Booth remains live/working and must not be modified as part of this lighting investigation.
- A compatibility test with Witch Dock coincided with shadows no longer appearing, but the test also involved a canvas preset and later state changes.
- No report proves that Witch Dock or Persistent Booth permanently disabled custom shadows.

Rule:

- Do not attribute the shadow regression to Witch Dock without an isolated A/B test.
- Test probe-only, then probe + Witch Dock with no preset change, then preset change as a separate variable.
- Do not edit `tools/Booth.js` unless a concrete, isolated compatibility regression is demonstrated.

## Third SphereLight

### Confirmed Renderer Registration

The injected custom SphereLight:

- remained attached and visible in scene snapshots;
- had its own UUID and custom color/intensity/distance;
- increased material `numSphereLights` counts;
- continued to be counted when both native orb lights were manually disabled.

During the isolation test:

- two native lights + custom produced `numSphereLights: 3`;
- one native light + custom produced `numSphereLights: 2`;
- zero native lights + custom produced `numSphereLights: 1`.

Important correction:

- The native count reductions were caused by the user manually turning off native orb lights for isolation.
- Do not describe that count change as HeroForge lifecycle removal.

### Confirmed Visible Failure

Observed by the user:

- With both native orb lights disabled, the custom SphereLight was the sole registered SphereLight but still produced no visible illumination.

This rules out:

- a hard maximum of two sphere lights;
- third-position/order alone;
- masking by native orb lights;
- failure to attach;
- failure to be counted by materials;
- the sibling group as a general scene-discovery failure.

Current inference:

- The custom SphereLight is missing a SphereLight-specific registration, occlusion, slot binding, or live uniform path.

Relevant native occlusion fields observed:

- `CK.character.children[0].partLightOcclusion0`
- `CK.character.children[0].partLightOcclusion1`

The exact suppressing mechanism remains unproven.

Rule:

- Do not claim the third SphereLight is working because the material count increments.
- `numSphereLights` proves shader configuration/counting, not valid visible contribution.
- Leave the SphereLight path separate while DirectionalLight stabilization is the active priority.

## Future Camera-Relative Rim Lighting

### Queue Position

This work begins after DirectionalLight movement, target, shadow-refresh, and lifecycle behavior are stable enough to stop changing the physical-light foundation.

### Goal

Create a rim-only or rim-weighted effect that:

- illuminates grazing-angle surfaces near the visible silhouette;
- avoids broadly blowing out rear-facing surfaces;
- remains camera-relative during spin capture;
- can optionally bias the rim toward left, right, upper, or opposing colored sides.

### Likely Implementation

Preferred path:

- Fresnel/view-angle shader contribution, probably applied through emissive or additive material output.

Core form:

- `rim = pow(1 - dot(normal, viewDirection), rimPower)`

Potential controls:

- color;
- intensity;
- width/power;
- softness;
- left/right/up directional bias;
- optional material exclusions.

### Viability Assessment

Current assessment:

- Basic camera-relative Fresnel rim: high viability.
- Directionally biased Fresnel rim: high viability after the base shader hook is proven.
- Strict outer-contour-only rim: more invasive and likely requires post-processing, depth/normal information, or an object mask.

Primary unknown:

- Whether HeroForge exposes a stable material/shader compile hook that can be patched without fragile bundle interception.

Main risks:

- HeroForge replacing materials during model, canvas, or Booth changes;
- multiple material families using different shader paths;
- normal/view-direction space mismatch;
- transparent hair, glass, eyes, decals, emissive surfaces, and other special materials;
- duplicate patch stacking when materials rebuild.

Rule:

- Keep Fresnel/rim lighting separate from physical DirectionalLight injection.
- Do not present rim lighting as another ordinary light type.
- Start with a read-only shader-hook probe before active shader mutation.

## Next Investigation Order

1. Reproduce the successful v0.3 shadow run with only the probe enabled and no canvas preset changes.
2. Move the light once and determine the exact moment the custom shadow matrix stops updating.
3. Probe renderer/shadow invalidation and native sun shadow-refresh calls.
4. Add one explicit custom-shadow refresh action at a time.
5. Retest editor, Photo Booth, canvas preset changes, and normal mode transitions.
6. Run an isolated probe + Witch Dock compatibility test without changing presets.
7. Only after the DirectionalLight path is stable, begin the read-only shader-hook/rim-light probe.

## Do Not Repeat

- Do not infer visible contribution solely from material light counts.
- Do not use `numDirLightShadows` as the only shadow-success signal.
- Do not toggle shadows after attachment and assume that matches the working pre-attach path.
- Do not call the custom DirectionalLight a second sun.
- Do not hard-code runtime UUIDs or a single numeric scene path.
- Do not blame Witch Dock or Persistent Booth without an isolated test.
- Do not mix Fresnel rim-lighting work into the physical DirectionalLight probe.
- Do not modify Persistent Booth merely because lighting is tested inside Photo Booth.
