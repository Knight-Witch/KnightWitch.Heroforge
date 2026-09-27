# Decals Diagnostic Provider v1 — Design Specification

**Provider ID:** `decals`  
**Provider schema version:** 1  
**Owning runtime:** HeroForge decal model/display state plus Witch Dock Expanded Decal Slots and Corrected Bound Decal Gizmo integration  
**Modes:** snapshot, failure  
**Comparison mode:** none in v1  
**Pressure tests:** corrected bound-gizmo regression family; issue #22 reorder/state-movement contract

## Purpose

Capture enough evidence to separate decal failures across these boundaries:

1. model decal slot/order/state;
2. selected UI layer -> mapping binding;
3. rendered decal/material/projector binding;
4. Project ON/OFF / bound transform state;
5. native HeroForge gizmo vs Witch Dock corrected-gizmo ownership;
6. expanded-slot readiness;
7. undo/drag/preservation lifecycle.

A visually misplaced decal does not by itself establish which of these layers is wrong.

## Current named seams

Existing useful state:

- `CK.character.data.decals`;
- `CK.character.display.modded.orderedDecals`;
- `CK.character.display.modded.displayDecals`;
- `CK.character.display.meshes`;
- `UIState.editorMenu_color_decals_decals`;
- `KW_HeroForgeUI.correctedBoundDecalGizmo.getState()`;
- `KW_HeroForgeUI.expandedDecalSlots`;
- `KW_HeroForgeUI.slotBridge.isEnabled()`.

The corrected-gizmo public state already exposes active/mode/status/selected mapping/decal ID/native suppression, but v1 diagnostics need a narrow additive `getDiagnosticState()` seam for the current resolved binding, transform-preservation state, and active drag state. Diagnostics Core must not scan arbitrary private closure variables.

## Immediate freeze

At capture T0, preserve synchronously:

### Figure / model identity

- figure/display key;
- primary/extra marker where available;
- character generation identity;
- decal data availability;
- count of occupied splatter mappings.

### Slot/order state

For each occupied splatter mapping, bounded to the provider slot limit:
- mapping key;
- source slot;
- ordered/source-layer index;
- decal/artwork ID;
- label/name where safe;
- enabled/presence state;
- Project state / `forceProjectedScript`;
- normalized transform fields;
- paint/color/reference fields needed to prove complete slot state movement;
- deterministic record hash.

Also freeze the ordered layer list separately so order changes are distinguishable from record changes.

Do not serialize unrelated character data.

### Current selection/binding

- selected UI decal label;
- resolved source layer;
- resolved mapping;
- selected decal ID;
- selected record hash;
- whether selection resolved unambiguously.

### Corrected gizmo state

- feature build/enabledByUser/active/mode/status/error;
- selected mapping/decal ID;
- native visual suppressed;
- native transformer count;
- native scan truncated flag;
- active binding identity;
- active drag type/state;
- native transformer mode;
- native locator transform;
- projector center/spread/frame hash;
- rendered match count/targets/material indices;
- current selected raw transform;
- last-forward/finalization result.

### Transform-preservation state

For the active/affected mapping, preserve:
- known bound transform if present;
- pending preserved transform if present;
- pending artwork ID;
- freshBind flag;
- pending expiry age/remaining time;
- whether current record matches a recognized native bogus-default profile;
- last preservation action/reason if retained.

Do not export the entire preservation maps unless a bounded multi-slot failure explicitly needs them.

### Expanded-slot state

- slot bridge enabled/loaded;
- expanded-slot loaded/applied/status/reason;
- tries/maxTries/delay;
- configured target count;
- actual relevant slot counts for bodyUpper/bodyLower/face and special expanded parts, bounded to counts/labels rather than complete option objects.

## Normalized transform

The v1 provider uses one common transform descriptor for decal records:

```text
h, v, d,
s, sy,
a, i, u,
sz
```

Only finite values are included.

Also include:
- `forceProjectedScript`;
- transform field-presence bitmap/list;
- deterministic transform hash.

Do not infer semantic axes beyond what current runtime establishes.

## Deterministic summary

Manifest-first triage should see:

- figure count with decal data;
- occupied decal count;
- ordered-layer count;
- selected mapping / decal ID;
- selected Project state;
- selected transform hash;
- selected record hash;
- selection binding resolved yes/no;
- rendered match count;
- corrected gizmo enabled/active/mode/error;
- native gizmo count;
- projector spread + over-tolerance boolean;
- transform-preservation pending/known flags for selected mapping;
- expanded slots applied/status/target;
- warning/error codes.

If a selected model record exists but no rendered match exists, elevate that as a factual invariant in summary; do not bury it in a giant render section.

## Stable sections

### `state`

Provider/runtime integration state:
- available Witch Dock decal modules/builds;
- figure/decal counts;
- selected label/mapping/decal ID;
- current provider warnings/errors;
- slot bridge/expanded-slot/corrected-gizmo availability.

### `slots`

Bounded normalized decal inventory.

For each occupied slot:
- figure key;
- source slot;
- mapping;
- ordered layer;
- decal ID;
- Project state;
- normalized transform;
- paint/color/reference fields;
- record hash.

Also include:
- deterministic ordered-layer hash;
- duplicate/missing mapping detection;
- empty-slot count/range when expanded slots are relevant;
- truncation/coverage.

This section is designed to support issue #22 later: moving a decal must move its complete applied record, not only its ID.

### `selection`

Current HeroForge UI -> model binding:
- selected label;
- matching ordered layer(s);
- chosen source layer;
- mapping;
- decal ID;
- record descriptor/hash;
- ambiguity/failure reason.

This makes UI-selection errors distinguishable from data/render errors.

### `rendered-binding`

For the selected/affected decal:
- rendered `displayDecals` match count;
- target mesh names/keys;
- material index;
- rendered decal/source-layer ID;
- relevant material identity;
- `l0_project` matrix values/hash;
- target mesh/display generation identity where available.

Bound the section to selected/affected decal by default. A whole-figure rendered inventory may be added only when triage specifically needs it.

### `projector`

Corrected-gizmo geometry facts:
- native transformer count and scan truncation;
- native locator parent/frame identity;
- locator position/quaternion/scale;
- projector reconstructed center;
- max spread;
- tolerance;
- world-frame hash;
- rendered projector matrix hashes;
- screen anchor/viewport relation when available;
- correction active / native visual suppression state.

Matrix values are small fixed arrays and may be preserved; do not dump scene graphs.

### `gizmo`

Witch Dock corrected-gizmo lifecycle:
- build;
- enabledByUser;
- active;
- mode;
- status/error;
- active binding;
- proxy/native transformer existence;
- drag state:
  - none / overlay move / native move / rotate / scale;
  - started;
  - finalized;
  - start/current raw transform where applicable;
- orbit enabled/disabled state if owned by the gizmo;
- last forwarded operation/result.

### `preservation`

Bound-transform preservation state:
- preserver installed;
- selected mapping known transform;
- selected mapping pending transform;
- freshBind;
- pending expiry;
- recognized bogus-default boolean/profile ID;
- artwork-change-while-bound discriminator;
- last action:
  - remember-bound;
  - preserve-on-artwork-change;
  - restore-known-bound;
  - normalize-fresh-bind;
  - expire-pending;
  - none.

The provider should retain before/after record descriptors for the most recent preservation action so a later capture can show what Witch Dock corrected.

### `expanded-slots`

- Slot Bridge enabled/loaded;
- Expanded Decal Slots status/reason/applied;
- retry counters;
- configured target;
- observed slot-count summary for supported primary/special parts;
- core-tweaks prerequisite/signature available.

No full `CK.Options.parts` dump.

### `failure-context`

Bounded recent failures from selection/binding/gizmo/preservation/expanded-slot logic.

Coverage is `not-applicable` when no retained provider failure exists.

### `events`

Meaningful lifecycle only:
- selected mapping changed;
- Project ON/OFF transition observed;
- artwork changed while bound;
- pending preservation created/applied/expired;
- fresh bind normalized;
- corrected gizmo enabled/disabled/rebound;
- drag start/finalize/cancel/fallback;
- expanded slots apply/wait/stop.

Do not log pointermove/frame-by-frame events.

## Retained failure evidence

Store a small bounded ring before transient state is overwritten.

Useful cases:

### Selection/binding failure
- selected UI label;
- ordered-layer candidates;
- mapping/decal ID if any;
- exact bounded reason;
- rendered match count.

### Gizmo resolution failure
- selected binding;
- Project state;
- native transformer count;
- scan visited/truncated;
- rendered match count;
- projector spread;
- prerequisite capability presence;
- error/reason.

### Drag/write failure
- mode;
- selected mapping;
- start record/transform;
- current attempted transform;
- whether live update or final commit;
- undo/finalization stage;
- bounded error;
- whether cancel/fallback restore ran.

### Preservation correction/failure
Before a pending preservation entry is cleared, retain:
- previous record;
- incoming patch fields;
- effective record;
- known/pending transform;
- recognized bogus-default profile;
- action chosen;
- resulting normalized record.

This is the Decals equivalent of #34's "capture before cleanup destroys the reason."

## Warning/error codes

Initial stable families:

- `DECAL_SELECTION_UNRESOLVED`
- `DECAL_SELECTION_AMBIGUOUS`
- `DECAL_RENDER_BINDING_MISSING`
- `DECAL_RENDER_BINDING_AMBIGUOUS`
- `DECAL_NATIVE_GIZMO_MISSING`
- `DECAL_NATIVE_GIZMO_AMBIGUOUS`
- `DECAL_PROJECTOR_SPREAD_EXCEEDED`
- `DECAL_GIZMO_BINDING_LOST`
- `DECAL_GIZMO_WRITE_FAILED`
- `DECAL_GIZMO_FINALIZE_FAILED`
- `DECAL_BOUND_TRANSFORM_CORRECTED` (informational when a known bad native initialization was repaired)
- `DECAL_BOUND_TRANSFORM_PRESERVE_FAILED`
- `DECAL_EXPANDED_SLOTS_NOT_APPLIED`

Do not turn every normal "no decal selected" state into a warning.

## Comparison modes

**None in v1.**

Project toggles and gizmo drags mutate character data and undo history. A normal diagnostic capture must not toggle Project, change artwork, move decals, or manufacture an undo entry.

If a future repeated bug justifies a controlled comparison, design it separately with exact undo/restore semantics.

## Cross-provider dependencies

- General Scene supplies figure/display readiness.
- Texture Quality may be added when a decal failure correlates with atlas/rebake state.
- JSON provider may later help when import/export changes decal order/state.
- Body Editor is unrelated unless a body/host mutation is itself part of reproduction.

Decals must remain independently useful.

## Privacy / bounding

Decal IDs, mappings, transforms, and paint references are private diagnostic model metadata but acceptable inside the private diagnostic bundle.

Do not include:
- full character JSON;
- arbitrary CK.Options objects;
- full scene graph;
- shader source;
- texture pixel data;
- screenshots.

Default whole-figure slot inventory should be capped (for example 128 occupied records) with explicit truncation. Selected/affected decal evidence is always prioritized.

## Pressure tests

### Corrected bound-gizmo regression family

Current validated module behavior should be diagnosable without scene-wide probes:
- selected layer maps to one model record;
- rendered material matches the same source layer/decal;
- native gizmo count is exactly one;
- corrected projector center/spread is known;
- live drag does not create undo entries on every pointer move;
- cancel/interruption restores without manufacturing history;
- Project-OFF fresh-slot native bogus defaults can be recognized and normalized;
- prior real bound transforms survive artwork changes/toggles.

### Issue #22 — future decal slot reordering

The capture should make it possible to compare before/after evidence and prove:
- ordered layer changed intentionally;
- mapping/record moved as intended;
- artwork ID moved with paint/color/transform/Project state;
- another figure's inventory did not change;
- projected and bound decals remain internally coherent.

This does not require a built-in comparison mode; separate captures can be compared by triage through deterministic record/order hashes.

## Implementation seams needed

1. Add a bounded read-only diagnostic seam to Corrected Bound Decal Gizmo exposing current resolved binding/projector/drag state and selected-mapping preservation state.
2. Retain a small recent preservation-action/failure ring before pending entries are cleared.
3. General Decals provider should read model/render state directly through named CK structures; do not make the placeholder `tools/Decals.js` the source of truth.
4. Reuse `KW_HeroForgeUI.expandedDecalSlots` and Slot Bridge state rather than duplicating readiness logic.

These are future provider implementation changes under #59 or a provider-specific implementation issue, not #88 runtime work.

## Acceptance

Decals provider v1 is capture-ready when:

- snapshot is fully read-only and creates no undo entries;
- selected UI -> ordered layer -> model mapping -> rendered material can be followed explicitly;
- Project state and transform fields are preserved as normalized values;
- corrected/native gizmo ownership and projector state are independently visible;
- transform-preservation transient state survives long enough for an explicit post-failure capture;
- expanded-slot readiness is explicit;
- issue #22's complete-state-movement invariant can be evaluated from bounded captures;
- no full figure/scene dump is required.
