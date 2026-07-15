# Lighting Shadow Refresh Diagnostics

Focused diagnostic appendix for the Advanced Lighting / Extra Lights sub-project.

Canonical project/spec file:
- `HISTORY/BULLSHIT/LIGHTING_AND_EXTRA_LIGHTS.md`

This file records the controlled native-shadow refresh comparison performed with `HeroForge_Shadow_Pipeline_Probe_v0.1.0.txt` after the cumulative lighting probe was split.

## Status

Confirmed diagnostic milestone.

The comparison isolates three distinct HeroForge-controlled lighting transitions:

1. native sun adjustment only;
2. environmental lighting preset adjustment only;
3. full Booth preset selection only.

Reports:

- `HF_Shadow_Pipeline_Probe_v0.1.0_2026-07-15T01-02-14-906Z.json` — native sun adjustment only;
- `HF_Shadow_Pipeline_Probe_v0.1.0_2026-07-15T01-03-42-554Z.json` — environmental lighting preset adjustment only;
- `HF_Shadow_Pipeline_Probe_v0.1.0_2026-07-15T01-04-50-087Z.json` — full Booth preset selection only.

All three reports recorded zero probe errors.

## Critical Finding

A legitimate native sun adjustment uses a two-stage update sequence that the earlier direct-property mutation did not reproduce.

Observed sequence in the `906Z` sun-only report:

1. Baseline native sun position:
   - `x = 8.826620169431965`
   - `y = 9.805237071293732`
   - `z = 1.796563371090197`
2. User adjusts the native sun through HeroForge UI.
3. First post-interaction snapshot:
   - sun position has already changed to:
     - `x = 4.796861604800018`
     - `y = 9.805237071293728`
     - `z = -7.624105344639563`
   - native shadow camera is still at the old baseline position;
   - native `sun.shadow.matrix` is still the old baseline matrix.
4. Approximately 83 ms later in the captured run:
   - native shadow camera position updates to the new sun position;
   - native shadow camera rotation updates;
   - native `sun.shadow.matrix` updates.
5. The existing native shadow render target and texture objects remain the same objects.

This is the first direct proof in this investigation that HeroForge performs a follow-up shadow-camera/matrix refresh after a legitimate native sun control change.

## Native Sun Adjustment — `906Z`

### Confirmed

- Native sun position changed immediately before the captured native shadow camera/matrix update.
- The first `0ms` post-interaction snapshots showed the new sun position with the old shadow camera and old shadow matrix.
- The scheduled `50ms` snapshot executed roughly 83 ms after the first post-interaction snapshot and showed:
  - updated shadow camera position;
  - updated shadow camera rotation;
  - updated native shadow matrix.
- The native shadow render-target UUID remained stable.
- The native shadow-map texture UUID remained stable.
- The shadow-map texture version remained `0` in the captured JavaScript state.

### Meaning

A successful native sun move does not require replacement of the shadow render target or its texture object.

The important observable transition is:

`sun position change -> delayed shadow camera/matrix synchronization`

The earlier direct-mutation probe changed the sun position/intensity/color but never produced this second synchronization phase.

## Environmental Lighting Preset — `554Z`

### Confirmed

Across 33 captured snapshots:

- no `native-shadow-state-change-detected` action fired;
- native sun position remained unchanged;
- native sun target remained unchanged;
- native sun intensity remained unchanged;
- native sun color remained unchanged;
- native shadow camera state remained unchanged;
- native `sun.shadow.matrix` remained unchanged;
- native shadow render-target and texture identities remained unchanged.

A full recursive comparison of the probe's captured baseline and final native-shadow snapshots found no captured state difference other than timestamp/reason metadata.

### Narrow interpretation

This proves only that the tested environmental-lighting preset did not change the native sun or native `sun.shadow` state captured by this probe.

It does not prove that environmental lighting itself did nothing.

The current Shadow Pipeline Probe does not deeply snapshot the internal state of `EnvironmentLight`, ambient lighting, environment maps, or all environment-preset resources.

Current rule:

- treat environmental-lighting presets as a separate lighting subsystem unless later evidence shows they intentionally drive native directional shadows;
- do not use the `554Z` result to claim that environment presets cannot affect any kind of shading, occlusion, reflections, ambient contribution, or environment lighting.

## Full Booth Preset — `087Z`

### Confirmed

The Booth preset changed the native sun from:

- position approximately `(8.8266, 9.9011, 1.7966)`
- intensity `0.85`
- color `#ffffff`

to:

- position approximately `(8.0590, 9.8106, 4.2038)`
- intensity `0.31`
- color `#e5bb94`

The first captured post-preset state also contained:

- updated native shadow camera position;
- updated native shadow camera rotation;
- updated native `sun.shadow.matrix`.

The existing shadow render-target and texture objects remained in place.

### Timing limitation

The Booth preset is a composite operation.

The click was recorded at approximately `01:04:28.512Z`, while the first scheduled post-interaction snapshots did not execute until approximately `01:04:34.416Z`.

By that time the sun and shadow camera/matrix were already synchronized.

Therefore this report does not reveal the internal ordering of the Booth preset transition.

It proves that the completed Booth-preset path ends with synchronized native sun and shadow state, but not whether the preset uses the exact same immediate/delayed sequence as the manual sun adjustment.

## Corrected Shadow-Pipeline Model

The earlier v0.6 model correctly identified that direct native-sun mutation failed to refresh the native shadow state, but the mechanism is now more specific.

### Failed direct mutation

`direct sun property mutation`

-> visible illumination changes

-> native shadow camera remains stale

-> native `sun.shadow.matrix` remains stale

-> visible shadow result becomes invalid or disappears

### Legitimate native sun control

`HeroForge native sun control`

-> sun transform changes

-> short delayed refresh phase

-> native shadow camera position/rotation synchronize to the new sun state

-> native `sun.shadow.matrix` recalculates

-> existing shadow render target continues to be used

This narrows the missing behavior from a vague hidden resource replacement to a concrete shadow-camera/matrix update lifecycle.

## Next Probe Target

Do not guess the refresh method yet.

The next Shadow Pipeline Probe should observe the callable API around the actual native shadow object during a legitimate native sun adjustment.

Recommended scope:

1. Enumerate callable own/prototype methods on:
   - native `sun.shadow`;
   - native shadow camera;
   - native sun object.
2. Instrument only the smallest relevant native shadow instance methods, not broad global prototypes.
3. Preserve original functions exactly and restore them automatically after the watch ends.
4. Capture:
   - method name;
   - timestamp;
   - argument summaries;
   - before/after sun position;
   - before/after shadow camera state;
   - before/after shadow-matrix hash;
   - short stack trace where available.
5. Repeat the clean native sun-adjustment test.
6. Identify the method or call chain that occurs during the approximately 80 ms refresh phase.

A likely Three.js-family concept is a shadow-matrix update routine, but no exact method name should be treated as confirmed until runtime observation proves it.

## Do Not Repeat

- Do not continue searching for a replacement shadow render target when legitimate sun adjustment reuses the existing object.
- Do not assume texture `version` must change when a render target is rerendered.
- Do not infer environment-preset internals from the native sun/shadow snapshot alone.
- Do not use the full Booth preset as the primary timing reference when the manual sun control provides a cleaner isolated two-stage transition.
- Do not globally monkey-patch renderer or light prototypes before the native shadow instance API is enumerated.
- Do not modify Persistent Booth for this investigation.