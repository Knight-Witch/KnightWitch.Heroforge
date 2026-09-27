# Texture Quality Diagnostic Provider v1 — Design Specification

**Provider ID:** `texture-quality`  
**Provider schema version:** 1  
**Reference implementation:** High Res Diagnostic Capture v0.1.3  
**Owning runtime:** `Texture_Quality_Native_Reconcile.js` + current diagnostic service  
**Modes:** snapshot, comparison, failure  
**Pressure tests:** #24, #32, #34

## Purpose

Expose the reusable state needed to distinguish:

- model paint/channel data;
- part/source identity;
- atlas allocation/topology;
- body/face mask and AAID resource selection;
- material bindings;
- color-bake state;
- High Res lifecycle/adoption/restore state;
- provider-owned verification failures.

The provider does not diagnose a root cause. It preserves the evidence needed to locate the first divergence.

## Migration rule

Do not rewrite v0.1.3 from scratch.

The generalized provider must retain:
- observational current capture;
- controlled Native OFF -> HR ON comparison;
- original-state restoration;
- deterministic summary/delta;
- explicit coverage;
- bounded events;
- local JSON export;
- targeted comparison-section retrieval.

General Diagnostics Core should take ownership of shared environment/Witch Dock/scene packaging while this provider keeps Texture Quality-specific evidence.

## Immediate freeze

At capture T0, synchronously preserve the smallest volatile state available from named seams:

- Texture Quality service state:
  - enabled;
  - busy;
  - persistent;
  - sessionSuppressed;
  - status;
  - lastError;
  - lastVerification;
  - lastRestoreVerification;
- current diagnostic-state seam result, if available;
- active session identifiers/generation counters exposed by the seam;
- current figure/display keys;
- current target part identities;
- current atlas dimensions/target allocations;
- current bound core-target `masksMap` / `masksMapOverride` / `aaidMap` identity+size+path where cheaply available.

The freeze seed must be normalized/bounded and read-only.

Do not wait for idle before freezing it.

## Retained failure evidence

Texture Quality must retain a bounded provider-owned failure record **before** cleanup clears the private session.

This specifically addresses the #34 class of failure.

A retained record should include:
- timestamp;
- provider warning/error code;
- lifecycle phase;
- core target/figure;
- exact verifier input facts used to make the decision;
- expected vs actual descriptors;
- relevant native source descriptor;
- relevant HR override descriptor;
- session/generation identifiers;
- restore step reached;
- whether cleanup subsequently cleared live session state.

Retain only the latest small number of failure records (for example 5–10), not complete historical sessions.

## Deterministic summary

The manifest/index summary should expose, per capture/snapshot where applicable:

- High Res enabled/busy/status;
- figure count;
- core-target part IDs;
- native/current atlas dimensions;
- core-target allocation sizes;
- paint / paintByIntent hashes and counts;
- per core target:
  - part identity;
  - bakeSize / usedTextureSize;
  - active mask size/path class;
  - active AAID size/path class;
  - `aaidFallback1x1` boolean;
- provider warning/error codes;
- last verification/restore verification outcome;
- comparison restoration outcome;
- changed-area categories.

Do not bury `aaidFallback1x1` only inside a huge material diff; #32 proved it is a reusable invariant.

## Stable sections

### `state`

Texture Quality service + diagnostic seam state.

Include:
- runtime version/build;
- enabled/busy/persistent/sessionSuppressed;
- status/error;
- lifecycle flags;
- session availability/reason;
- target IDs;
- adopted generation/adoption counters;
- restore refresh counters;
- bounded retained failure summary.

### `figures`

Per figure/display:
- figure key / primary;
- display/modded identity;
- generation identity where available;
- core target part descriptors;
- relevant slot metadata;
- target presence/missing status.

Avoid dumping every arbitrary part property.

### `paint-state`

Per figure:
- normalized `data.paints`;
- deterministic paints hash;
- normalized `paintByIntent`;
- deterministic intent hash;
- counts;
- reusable channel/patch metadata needed to distinguish channel-definition loss from render-input loss.

### `atlas`

Per figure:
- atlas object identity;
- width/height;
- target allocations;
- target atlasScale;
- live texture-slot participation where relevant;
- baseline/native allocations when retained by the service.

### `materials`

Per target mesh:
- main material identity;
- bake material identities;
- relevant uniforms only;
- explicit descriptors for:
  - `masksMap`;
  - `masksMapOverride`;
  - `aaidMap`;
  - `gradientsMap` dimensions/shape where meaningful;
- object identity only when identity itself is a diagnostic discriminator.

### `resources`

Deduplicated referenced texture/resource inventory.

For each resource:
- role(s);
- owner(s);
- UUID/object identity;
- path/source;
- actual dimensions;
- resource readiness/status when available.

Texture Quality-specific derived rows should include, per core target:
- expected/native AAID path+supported size when known;
- requested AAID path/size;
- actual bound `aaidMap` path/size;
- cache presence/readiness/status;
- `aaidFallback1x1`;
- native/current mask path/size;
- mask readiness.

This is the generalized capture-gap fix learned from #32.

### `color-bake`

Per figure:
- colorBake identity;
- bounded surface/scalar state;
- paints surface;
- target group identities/resources;
- refresh/force-render flags when available;
- material-setup structural signature.

Do not capture raw pixel buffers.

### `verification`

Include provider-owned invariant/verification outputs:
- last HR verification;
- last native-restore verification;
- target-level expected vs actual facts;
- verification timestamp/phase;
- explicit pass/fail/unavailable.

Verification output is evidence. It may itself be wrong (#34), so preserve its inputs in `failure-context`.

### `failure-context`

Bounded retained pre-cleanup failure records.

Coverage is `not-applicable` when no retained failure exists, not `captured` with an empty fake error.

### `events`

Provider lifecycle ring, e.g.:
- enable requested/start/settled;
- display changed/adopted;
- resource preloaded/failed;
- material setup;
- atlas rebuilt;
- disable/restore requested/completed;
- verification warning/failure.

Do not log every render/update frame.

## Comparison section naming

Comparison capture must remain selectively addressable through opaque stable section keys.

Recommended keys:

- `snapshot.native-off.state`
- `snapshot.native-off.figures`
- `snapshot.native-off.paint-state`
- `snapshot.native-off.atlas`
- `snapshot.native-off.materials`
- `snapshot.native-off.resources`
- `snapshot.native-off.color-bake`
- `snapshot.high-res-on.*`
- `snapshot.restored.*` when restoration snapshot exists
- `comparison.delta`
- `comparison.transition`

This keeps the shared logical address three-part:

`captureId / texture-quality / sectionName`

while preserving targeted OFF/ON/restored retrieval.

## Controlled comparison

Current reference comparison: Native OFF -> HR ON -> restore original state.

Requirements:
1. freeze original state;
2. if initially ON, use the provider's supported comparison plan without blindly replaying toggles;
3. transition at-most-once;
4. wait only for the provider's already-established readiness/idle contract;
5. preserve partial snapshots if transition fails;
6. restore the original HR state;
7. verify restoration;
8. record exact transition/restoration outcomes.

Comparison must not run automatically as part of ordinary bug-report capture.

## Warning/error codes

Provider-owned stable codes should cover at least:
- transition/settle timeout;
- missing target/display;
- resource request failed;
- 1x1 AAID fallback detected;
- restore verification warning/failure;
- comparison restore failure.

Existing user-facing warnings may map to stable codes without changing their text.

Do not create a code for every upstream thrown string.

## Size / bounding

Potentially large:
- `paint-state`;
- `materials`;
- `resources`;
- comparison snapshots/delta.

Rules:
- preserve normalized underlying values, not hashes only;
- deduplicate resource descriptors;
- cap material/uniform traversal;
- section-level truncation must be explicit;
- generic changed-path diff caps must never hide high-value provider invariants from the summary.

## Pressure-test results

### #24 — ON/OFF tint restore

Provider must make it cheap to compare:
- original native color-bake state;
- HR ON state;
- restored state;
- restore verification;
- exact changed lifecycle/color-bake facts.

### #32 — body paint zone collapse

Provider must make it cheap to establish:
- paints/paintByIntent unchanged;
- body channel metadata intact;
- 2048 atlas allocations intact;
- masks present;
- bound body `aaidMap` collapsed to 1x1;
- requested 2048 body AAID unavailable while supported smaller AAIDs exist.

The summary/resource section should now elevate these facts directly.

### #34 — false restore warning

Provider must preserve the verifier's pre-cleanup inputs so triage can compare:
- expected native mask size/source;
- actual restored material mask;
- HR override identity;
- cache/shared-object identity;
- verifier decision;
- post-restore state.

A user capturing after the warning must not lose the evidence merely because `disable()` cleared the live session.

## Acceptance

Texture Quality provider v1 design is implementation-ready when:

- all v0.1.3 capabilities map cleanly to the provider/core split;
- #24/#32/#34 discriminators are available without ad hoc Bridge-wide dumps;
- ordinary snapshot remains read-only;
- comparison remains explicit and restoration-safe;
- a provider warning can retain bounded pre-cleanup failure facts;
- triage can read the manifest/summary first and request only the needed section.
