# Advanced Lighting and Extra Lights

HeroForge advanced-lighting sub-project specification, technical history, probe inventory, current findings, and migration plan.

## Status

Investigating / unresolved.

This is a standalone-development track intended to become a Witch Dock lighting tool when the underlying runtime behavior is stable enough to migrate.

Current destination:

- eventual visible Witch Dock controls under the `Booth` tab;
- preferably a separate module such as `tools/Advanced_Lighting.js` that registers into the Booth tab;
- do not fold experimental lighting logic into `tools/Booth.js` merely because both features are used in Photo Booth;
- Persistent Booth remains live/working and separate.

Nothing in this investigation is currently live in `manifest.json` or Witch Dock.

## Documentation Confidence Labels

Use these labels when extending this file:

- **Confirmed:** directly observed in runtime and supported by probe output.
- **Observed:** user-visible behavior reported during a controlled test, but not fully isolated internally.
- **Inferred:** best current explanation supported by evidence, but not directly proven.
- **Unproven:** plausible path or hypothesis that still needs a probe.

When later evidence narrows or disproves an earlier statement, replace the active claim and preserve the old result only as explicitly historical context.

## Project Goal

Build an advanced lighting tool that extends HeroForge beyond the native two-orb UI without breaking native Photo Booth behavior.

Current desired capability set:

- additional controllable DirectionalLight instances;
- position controls;
- target/aim controls;
- intensity controls;
- color controls;
- reliable shadow behavior if HeroForge's shadow pipeline can be safely extended;
- later investigation of additional light families where practical;
- later camera-relative rim lighting as a separate shader/material path.

Potential later controls, not yet implementation commitments:

- kitbash-style XYZ translation controls;
- direct aim/rotation controls;
- optional target locks;
- per-light enable/disable;
- light-linking or per-object receiver controls only after the base light path is stable.

Light linking is a separate high-complexity problem. Do not mix it into basic injection/shadow stabilization.

## Scope Separation

### Physical Light Injection

Includes:

- DirectionalLight injection;
- SphereLight investigation;
- future PointLight/SpotLight/other physical-light probes if justified;
- physical-light position, target, intensity, color, lifecycle, and shadows.

### Shadow Pipeline

Includes:

- native sun shadow behavior;
- generic DirectionalLight shadow objects;
- Photo Booth shadow allocation;
- `additionalSunShadowMap` resources;
- renderer-owned shadow refresh/update paths.

### Camera-Relative Rim Lighting

Separate implementation family.

Preferred path remains a view-angle/Fresnel shader contribution, not another ordinary physical light.

### Persistent Booth

Separate production feature.

Rules:

- do not modify `tools/Booth.js` for lighting unless an isolated compatibility regression proves a concrete requirement;
- do not treat Advanced Lighting as a Persistent Booth rebuild;
- eventual Advanced Lighting UI may share the Booth tab while remaining a separate module and runtime subsystem.

## Current High-Level Position

### Confirmed

- A second custom non-shadow DirectionalLight visibly renders.
- The custom DirectionalLight can move between tested positions.
- Runtime intensity changes visibly affect it.
- An independent target object is valid and visibly affects the light in Photo Booth.
- The custom DirectionalLight can survive normal editor <-> Photo Booth transitions in standalone testing.
- HeroForge material configuration can count the custom DirectionalLight as an additional directional light.
- A third injected SphereLight can be counted by material light configuration.
- That third SphereLight still does not visibly illuminate, even when native orb lights are manually disabled and it is the only registered SphereLight.
- HeroForge uses a special `additionalSunShadowMap` path on at least two `HF.summonCircle` materials.
- Those `additionalSunShadowMap` textures are separate objects from the native `sun.shadow.map`.
- Copying the probe DirectionalLight state onto the native HeroForge sun caused the visible native sun shadows to disappear in testing.
- Restoring the original native sun state caused the visible sun shadows to return.
- The same native `sun.shadow.map` object persisted through baseline -> broken override -> restored state.
- The same two `additionalSunShadowMap` texture objects also persisted through baseline -> broken override -> restored state.

### Corrected / No Longer Claimed

The earlier v0.3 result was initially treated as proof that an independent custom DirectionalLight produced visible custom shadows.

That conclusion is no longer considered confirmed.

Why:

- later controlled runs repeatedly failed to reproduce visible custom shadows;
- a custom shadow object or render target can exist without the character materials visibly consuming it;
- `numDirLightShadows` remained `0` and standard directional shadow arrays remained empty;
- native sun shadows, occlusion, or another Photo Booth effect could have been mistaken for custom-light shadows in the first visual test.

Current rule:

- independent custom DirectionalLight shadow object/map allocation is diagnostic evidence only;
- visible independent custom DirectionalLight shadowing remains unproven and currently appears non-working;
- do not describe the v0.3 run as a solved shadow implementation.

### Unresolved

- The actual HeroForge update routine that regenerates or validates visible sun shadows.
- Whether `additionalSunShadowMap` texture contents are rerendered in place while object identity remains stable.
- Whether a stable second independent shadow-producing DirectionalLight can be integrated without replacing the native sun path.
- Why the third SphereLight is counted but visually inactive.
- Editor-specific target refresh behavior.
- Additional light-family viability beyond the currently tested DirectionalLight and SphereLight paths.

## Probe Inventory

### HeroForge Lighting Probe v0.1.0

Status:

- Read-only canonical diagnostic reference.

Files:

- `HeroForge_Lighting_Probe_v0.1.0.txt`
- `HeroForge_Lighting_Probe_v0.1.0_diff.txt`

Purpose:

- scan globals and object graphs;
- identify light constructors;
- locate active lighting roots;
- inspect material light counts;
- inspect bundle support;
- export JSON without intentionally mutating the scene.

Rule:

- keep this probe read-only;
- do not turn it into the active injection harness.

### HeroForge Lighting Injection Probe v0.1.0

Status:

- Historical diagnostic reference / partial success.

Key results:

- established tolerant active-rig discovery;
- established owned custom-group attachment and cleanup;
- confirmed a second non-shadow DirectionalLight visibly illuminates;
- confirmed a third SphereLight can be counted without visibly illuminating.

### HeroForge Lighting Injection Probe v0.2.0

Status:

- Historical diagnostic reference / transform and post-attach-shadow control probe.

Added:

- directional position presets;
- target presets;
- intensity presets;
- post-attachment shadow toggle;
- expanded matrix/shadow diagnostics.

Results:

- position changes worked in editor and Photo Booth;
- intensity changes worked in editor and Photo Booth;
- target changes visibly affected Photo Booth but not the editor during that test;
- enabling shadows only after attachment was not a reliable path.

### HeroForge Lighting Injection Probe v0.3.0

Status:

- Partial working reference for the known-good second DirectionalLight injection path.
- Historical shadow-allocation diagnostic reference.

Key change:

- set `castShadow: true` before first attachment.

Diagnostic results:

- the custom DirectionalLight remained controllable;
- Photo Booth could allocate an independent custom shadow map/render target in one run;
- the custom shadow matrix could change from identity to a calculated matrix;
- later movement did not reliably update the custom shadow matrix;
- detach/re-attach did not reliably refresh it.

Correction:

- this version is not proof of reliable visible independent custom shadows.

### HeroForge Lighting Injection Probe v0.4.0

Status:

- Historical diagnostic reference / native-sun shadow-path probe.

Added:

- detailed material shadow-binding inspection;
- native-sun takeover test;
- native-sun restore test.

Key findings:

- the custom DirectionalLight still visibly rendered but did not produce visible shadows;
- the custom shadow map remained null in the reported run;
- two materials used `additionalSunShadow: true` and had `additionalSunShadowMap` textures;
- those textures were not the same object as `sun.shadow.map`;
- copying the probe transform/intensity/color onto the real native sun removed visible sun shadows;
- restoring the original native sun state restored visible shadows;
- the logged native `sun.shadow.matrix` remained unchanged through the mutation/restore sequence.

Interpretation:

- directly mutating the DirectionalLight object is not sufficient to reproduce HeroForge's visible shadow-update pipeline.

### HeroForge Lighting Injection Probe v0.5.0

Status:

- Current completed shadow-resource tracing milestone.

Added:

- `additionalSunShadowMap` reference tracing;
- owner-path tracing;
- baseline -> native-sun override -> restore comparison round.

Confirmed findings:

- native `sun.shadow.map` kept the same object identity across working baseline, broken override, and restored state;
- the two observed `additionalSunShadowMap` texture objects also kept the same identities across all three states;
- direct material owners were found at:
  - `HF.summonCircle.children[0].material.uniforms.additionalSunShadowMap.value`
  - `HF.summonCircle.children[1].material.uniforms.additionalSunShadowMap.value`
- the broad graph scan reached its `20000` node ceiling;
- object identity and binding changes do not explain the visible shadow loss/recovery.

Current inference:

- HeroForge may rerender or rewrite the contents of persistent texture objects;
- alternatively, a hidden renderer/controller state determines whether those persistent textures are valid/used.

### HeroForge Lighting Injection Probe v0.6.0

Status:

- Current active diagnostic probe.
- Created, not yet validated by a returned runtime report at this checkpoint.

Purpose:

- inspect `additionalSunShadowMap` texture state;
- inspect texture version and update state;
- inspect source/image identity and dimensions;
- inspect render-target/backing-resource relationships;
- trace the texture, source, source data, and image/backing object separately;
- compare the same working baseline -> broken override -> restored sequence.

Rule:

- do not treat v0.6.0 as a validated result until its report is reviewed.

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

Renderer/shader paths have been observed dynamically supporting counts for:

- directional lights;
- point lights;
- sphere lights;
- spot lights;
- rectangular area lights;
- hemisphere lights;
- environment lights.

This means HeroForge's two-orb UI is not a universal renderer light-count cap.

`RK.SpotLight` has not yet been identified as a confirmed public export even though renderer/shader support for spot lights exists.

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

- do not hard-code `CK.environment.children[3]` or any one numeric child path;
- preserve tolerant alias checks and scene traversal;
- UUIDs are runtime-instance diagnostics, not stable selectors.

### Custom Attachment Path

The working injection path creates an owned custom group by cloning the native part-light group non-recursively, then attaches that group as a sibling of native `partLights` under `Character0`.

Confirmed implications:

- general scene traversal can discover a custom DirectionalLight under that sibling group;
- the sibling attachment does not prevent DirectionalLight illumination;
- the SphereLight failure is type-specific, not proof that the custom group is globally invalid.

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

HeroForge's native sun has additional sun-specific systems and a special visible-shadow path that are not automatically duplicated by cloning the DirectionalLight.

### Position

Confirmed:

- position presets changed the visible illumination direction;
- tested positions included front, back, left, right, above, and below.

Required implementation behavior:

- refresh local/world matrices after position mutation;
- preserve tolerant method checks such as `setMatrixNeedsUpdate`, `updateMatrix`, and `updateMatrixWorld` where available.

### Targeting

Confirmed:

- the target object moved between feet, center, and head positions;
- Photo Booth visibly responded to target changes.

Observed limitation:

- the editor did not visibly respond to the same target changes during the v0.2 test.

Current interpretation:

- target assignment itself is valid;
- editor and Photo Booth likely differ in when or how directional vectors are refreshed or consumed;
- exact editor suppression/update behavior remains unproven.

### Intensity

Confirmed:

- runtime intensity mutation visibly changed the custom DirectionalLight;
- tested values included low, medium, high, off, and numeric values.

## Native Sun and Visible Shadow Pipeline

### Native Sun Shadow Object

The native sun has:

- `castShadow: true`;
- a shadow object;
- an orthographic shadow camera;
- a `sun.shadow.map` render target;
- a calculated shadow matrix.

However, visible character shadowing is not explained by that object alone.

### `additionalSunShadowMap`

At least two `HF.summonCircle` materials use:

- `additionalSunShadow: true`;
- a singular `additionalSunShadowMap` texture uniform.

Important findings:

- the two `additionalSunShadowMap` textures are distinct from `sun.shadow.map`;
- their JavaScript object identities remained stable across working/broken/restored states;
- their direct material uniform owner paths remained stable;
- visible shadow state can change without replacing these texture objects.

Current inference:

- the persistent textures may be regenerated in place;
- or another hidden state controls whether their current contents are valid/used.

### Native Sun Override / Restore Result

Observed sequence:

1. Native sun begins in a state with visible shadows.
2. Probe copies custom DirectionalLight world position, target, intensity, and color onto the native sun.
3. Visible sun shadows disappear.
4. Probe restores the original native sun state.
5. Visible sun shadows return.

Confirmed from diagnostics:

- the native sun object itself was not replaced;
- `sun.shadow.map` object identity remained stable;
- the two `additionalSunShadowMap` texture identities remained stable.

This proves that object replacement is not required for visible shadow loss/recovery.

It does not yet identify the hidden update mechanism.

## Custom Directional Shadows

### Historical v0.3 Allocation Result

In one v0.3 run:

- `castShadow: true` was set before first attachment;
- Photo Booth allocated an independent custom shadow map;
- the custom shadow matrix became non-identity.

Later tests showed:

- the custom shadow matrix could remain stale after movement;
- the custom map could remain null in other runs;
- visible independent custom shadows were not reproducible.

Current rule:

- preserve the pre-attach setup as historical diagnostic behavior;
- do not use it as proof of a working visible shadow feature.

### Material Shadow Counters

`numDirLightShadows` remained `0` in tested runs.

Current interpretation:

- the standard directional-shadow array path is not active for the custom light in the inspected character materials;
- a map/render-target object existing does not prove the character shader consumes it.

Do not use `numDirLightShadows` as the only signal, but also do not dismiss persistent zero counts when visible custom shadows cannot be reproduced.

## Third SphereLight

### Confirmed Renderer Registration

The injected custom SphereLight:

- remained attached;
- had its own UUID, color, intensity, distance, and decay state;
- increased material `numSphereLights` counts;
- continued to be counted when native orb lights were manually disabled.

Isolation sequence observed:

- two native lights + custom -> `numSphereLights: 3`;
- one native light + custom -> `numSphereLights: 2`;
- zero native lights + custom -> `numSphereLights: 1`.

Important correction:

- the native count reductions were caused by manual user toggles, not HeroForge lifecycle removal.

### Confirmed Visible Failure

With both native orb lights disabled, the custom SphereLight was the sole registered SphereLight and still produced no visible illumination.

This rules out:

- a hard maximum of two sphere lights;
- third-position/order alone;
- masking by native orb lights;
- failure to attach;
- failure to be counted by materials;
- the sibling group as a general scene-discovery failure.

Current inference:

- the custom SphereLight is missing a SphereLight-specific registration, occlusion, slot binding, or live uniform path.

Relevant native occlusion fields observed:

- `CK.character.children[0].partLightOcclusion0`
- `CK.character.children[0].partLightOcclusion1`

Exact mechanism remains unproven.

## Canvas Presets and Witch Dock Compatibility

### Canvas Presets

Observed:

- applying a canvas preset rewrote native Photo Booth lighting properties, including native sun position, intensity, and color.

Current rule:

- canvas presets are a confounding variable in lighting tests;
- do not attribute a regression to Witch Dock when a preset changed in the same test sequence.

### Witch Dock / Persistent Booth

Current status:

- Persistent Booth remains live/working;
- no report proves Witch Dock permanently disabled the lighting probe;
- the initial compatibility test was confounded by canvas-preset/state changes;
- later shadow failure persisted with Witch Dock disabled, so causation is not established.

Rule:

- test probe-only first;
- test probe + Witch Dock separately without changing presets;
- test preset changes as an independent variable;
- do not edit `tools/Booth.js` without isolated evidence.

## Probe Architecture Cleanup Plan

The cumulative injection probe has grown too large and exposes obsolete historical actions in the Tampermonkey menu.

After the v0.6 diagnostic result is reviewed, split the work into two standalone scripts.

### 1. Lighting Injection Reference

Purpose:

- preserve the minimal known-good second DirectionalLight behavior;
- serve as the canonical reference for future Witch Dock migration.

Keep only what is needed for:

- tolerant runtime discovery;
- owned custom-group creation;
- second DirectionalLight injection;
- position controls;
- target controls;
- intensity/color controls;
- cleanup;
- focused report export if still useful.

Do not carry forward obsolete shadow experiments unless they are required to preserve a proven behavior.

### 2. Shadow Pipeline Probe

Purpose:

- isolate current shadow diagnostics from the working light-injection reference.

Keep only what is needed for:

- native sun baseline/override/restore comparison;
- `additionalSunShadowMap` tracing;
- texture/source/image/backing-resource diagnostics;
- renderer/controller lifecycle probing;
- targeted report export.

This split should occur only after the current v0.6 result is documented so no diagnostic history is lost.

## Witch Dock Migration Plan

Do not migrate while the physical-light foundation is still changing.

Recommended sequence:

1. Preserve a compact standalone Lighting Injection Reference.
2. Resolve or explicitly scope the shadow limitation.
3. Re-test the reference against current Witch Dock without modifying Persistent Booth.
4. Define the minimum user-facing control set.
5. Add a separate visible lighting module under `/tools/`, intended to register into the Booth tab.
6. Add a manifest entry only when the module is ready for Witch Dock Dev testing.
7. Test standalone reference vs Witch Dock-integrated behavior for parity.
8. Keep shadow-pipeline code isolated from ordinary light controls where practical.

Candidate eventual module:

- `tools/Advanced_Lighting.js`

Candidate tab:

- `Booth`

This is an architecture direction, not a live file or manifest commitment yet.

## Future Camera-Relative Rim Lighting

Begin only after the physical DirectionalLight foundation is stable.

Goal:

- illuminate grazing-angle surfaces near the visible silhouette;
- avoid broadly blowing out rear-facing surfaces;
- remain camera-relative during spin capture;
- optionally bias the rim toward left/right/up or opposing colors.

Preferred path:

- Fresnel/view-angle shader contribution, probably through emissive or additive material output.

Core form:

- `rim = pow(1 - dot(normal, viewDirection), rimPower)`

Potential controls:

- color;
- intensity;
- width/power;
- softness;
- directional bias;
- optional material exclusions.

Rule:

- keep this separate from physical DirectionalLight and SphereLight injection;
- begin with a read-only shader/material hook probe.

## Current Investigation Order

1. Run and analyze `HeroForge_Lighting_Injection_Probe_v0.6.0.txt`.
2. Determine whether the persistent `additionalSunShadowMap` textures change version/source/image/backing state across working -> broken -> restored states.
3. Identify the renderer/controller path that refreshes or validates the visible native sun shadows.
4. Decide whether an independent second shadow-producing DirectionalLight is realistically extendable or whether the native sun path is effectively singular.
5. Split the cumulative probe into the compact Lighting Injection Reference and focused Shadow Pipeline Probe.
6. Retest the compact injection reference beside Witch Dock without editing Persistent Booth.
7. Only after physical-light behavior is stable, begin a read-only rim-light shader probe.

## Do Not Repeat

- Do not infer visible contribution solely from material light counts.
- Do not treat an allocated shadow map as proof that character materials visibly consume it.
- Do not claim reliable visible custom DirectionalLight shadows based on the initial v0.3 visual observation.
- Do not call the custom DirectionalLight a second sun.
- Do not hard-code runtime UUIDs or one numeric scene path.
- Do not blame Witch Dock or Persistent Booth without an isolated test.
- Do not modify Persistent Booth merely because Advanced Lighting will eventually appear under the Booth tab.
- Do not mix Fresnel rim-lighting experiments into the physical light-injection reference.
- Do not let material probe milestones remain only in chat; checkpoint the repo before the next material code stage.