# Body Editor Diagnostic Provider v1 — Design Specification

**Provider ID:** `body-editor`  
**Provider schema version:** 1  
**Owning runtime:** `tools/Body_Editor.js` v4  
**Modes:** snapshot, failure  
**Comparison mode:** none in v1

## Purpose

Capture the small transform/undo boundaries Body Editor actually mutates without exporting a full HeroForge character JSON.

Current Body Editor operations are:

- sync Main arm transforms to 2nd/3rd arm sets, optionally including hands/fingers, hand poses, and arm-length sliders;
- mirror breast transforms left/right;
- mirror butt transforms left/right with optional saved baselines;
- participate in HeroForge undo/redo through `CK.UndoQueue` and `CK.tryLoadCharacter`.

Diagnostics must make a failed or surprising edit explainable without treating the full undo snapshot as diagnostic evidence.

## Current runtime boundary

Body Editor currently keeps preferences/private operation logic inside its module and reads:
- `CK.UndoQueue`;
- current undo entry as character source;
- `CK.tryLoadCharacter`;
- provider-owned settings;
- provider-owned butt-baseline storage.

Future implementation should register a bounded provider/read-only seam rather than expose raw undo entries.

## Immediate freeze

At capture T0 preserve:

### Editor preferences
- arms target2/target3;
- arms copy position/rotation/scale;
- syncHands;
- breast direction + copy fields;
- butt direction + copy fields.

### Undo boundary
- queue available;
- queue length;
- current index;
- canUndo/canRedo;
- current entry present;
- previous/next entry present.

Never copy undo queue payloads into diagnostics.

### Relevant transform state

Read only the Body Editor-owned transform families from the current character state:

- `transforms.bodyUpper`;
- `transforms.bodyUpper0`;
- `transforms.bodyUpper1`.

Within them include only:
- numeric transform keys actually participating in arm sync, bounded;
- named `main_arm*`, `main_hand*`, `main_finger*` records when relevant;
- recognized breast `main_chestL_*` / `main_chestR_*` pairs;
- the fixed butt key pairs used by the tool.

Each transform record contains only normalized:
- `pos`;
- `qtn`;
- `scl`;
- `isKitbashed` when relevant.

### Related non-transform state

For arm sync:
- presence/hash of `custom.handPoses.human`, `human_0`, `human_1`;
- scalar arm-length sliders `armsL`, `armsR`, `arms0L`, `arms0R`, `arms1L`, `arms1R` when present.

### Butt baseline state

Provider-owned baseline storage is allowlisted, but export only:
- baseline store present/parseable;
- relevant known butt-key coverage;
- per-key transform hash/presence.

Do not export arbitrary localStorage content.

## Deterministic summary

Manifest-first triage should see:

- UndoQueue available/length/index/canUndo/canRedo;
- selected Body Editor operation preferences;
- main/secondary arm transform record counts + hashes;
- selected target arm sets present/missing;
- hand-pose target slots present/missing;
- arm-length target sliders present/missing;
- breast pair count / unmatched count / hash;
- butt pair count / unmatched count / baseline coverage;
- last operation type/result;
- warning/error codes.

## Stable sections

### `state`

- tool/provider version/build;
- current editor preferences;
- CK/UndoQueue/tryLoadCharacter capability presence;
- latest provider status/error.

### `undo`

- queue length/current index;
- canUndo/canRedo;
- current entry available;
- last Body Editor commit:
  - operation;
  - pre-index/post-index;
  - queue length before/after;
  - tryLoad result;
  - commit result.

No undo entry body is serialized.

### `arms`

For main + requested secondary arm sets:
- relevant transform records;
- record counts;
- presence maps;
- deterministic per-set hash;
- main-vs-secondary equality/difference summary for pos/qtn/scl;
- hand/finger inclusion state;
- hand-pose slot presence/hashes;
- arm-length slider values.

Do not diagnose whether a difference is intentional; report it.

### `breast`

- mirror direction;
- copy field choices;
- recognized L/R signature map;
- unmatched signatures;
- normalized relevant transforms;
- pair hashes/difference flags;
- whether default keys were absent/present in source state.

### `butt`

- mirror direction;
- copy field choices;
- fixed key-pair presence;
- normalized transforms;
- pair hashes/difference flags;
- baseline coverage/hash;
- whether destination records are absent/empty.

### `last-operation`

Bounded retained context for the latest Body Editor mutation:
- operation type: arms-sync / breast-mirror / butt-mirror / undo / redo;
- timestamp;
- source/target selection;
- requested copy fields;
- relevant pre-state hashes;
- relevant post-state hashes when commit succeeded;
- undo indexes before/after;
- result/error code.

Do not retain the full before/after character JSON.

### `failure-context`

Small bounded recent operation failures/no-op reasons:
- missing current undo snapshot;
- no target selected;
- missing bodyUpper rig;
- no matched breast signatures;
- unavailable load/undo capability;
- tryLoad/commit failure;
- malformed provider-owned baseline.

### `events`

Meaningful actions only:
- preferences changed;
- operation started/result;
- undo/redo observed;
- relevant character generation changed.

## Retained operation evidence

Body Editor currently often returns silently on missing prerequisites. Provider implementation should retain a safe operation record so an explicit capture after "nothing happened" can show why.

The record should distinguish:
- operation was not attempted;
- operation had no eligible source/targets;
- transformed candidate was created;
- `tryLoadCharacter` failed;
- load succeeded but undo bookkeeping failed;
- operation completed.

Instrumentation must not change current mutation/undo timing.

## Warning/error codes

Suggested stable codes:

- `BODY_EDITOR_UNDO_UNAVAILABLE`
- `BODY_EDITOR_CURRENT_STATE_UNAVAILABLE`
- `BODY_EDITOR_TARGET_UNAVAILABLE`
- `BODY_EDITOR_NO_MATCHING_TRANSFORMS`
- `BODY_EDITOR_LOAD_FAILED`
- `BODY_EDITOR_COMMIT_FAILED`
- `BODY_EDITOR_BASELINE_INVALID`

Normal user choices such as "no secondary arms selected" are operation outcomes, not global errors.

## Comparison modes

**None in v1.**

Body Editor operations mutate a complete character snapshot and intentionally create undo state. Diagnostics must not run sync/mirror operations automatically.

Separate before/after user captures can be compared by hashes, and retained `last-operation` gives the exact mutation boundary.

## Privacy / bounding

Allowed private diagnostic evidence:
- recognized bone/joint key names;
- normalized transform values for the small allowlisted families;
- relevant slider values;
- provider preferences;
- hashes.

Excluded:
- full undo entries;
- full character JSON;
- arbitrary transform families;
- unrelated slider/paint/part data;
- arbitrary localStorage.

## Implementation seam needed

Add a provider-facing read-only diagnostic seam or register the provider from Body Editor itself.

Also instrument operation start/result with bounded relevant pre/post hashes. Do not expose or persist full snapshots merely for diagnostics.

## Acceptance

Body Editor provider v1 is capture-ready when:

- snapshot never loads/changes character data;
- no full UndoQueue entries are serialized;
- arm sync source/targets and hand/slider adjunct state are independently visible;
- breast/butt pair matching and baseline coverage are explicit;
- "button did nothing" can be distinguished from "commit failed";
- a successful operation exposes bounded pre/post hashes plus undo-index movement.
