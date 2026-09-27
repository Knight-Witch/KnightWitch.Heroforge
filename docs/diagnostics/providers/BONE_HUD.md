# Bone HUD Diagnostic Provider v1 — Design Specification

**Provider ID:** `bone-hud`  
**Provider schema version:** 1  
**Owning runtime:** `features/core/Witch_Dock_Bone_HUD.js`  
**Modes:** snapshot, failure  
**Comparison mode:** none  
**Pressure test:** issue #26 stale HeroForge summonCircle anchors

## Purpose

Diagnose the Bone HUD's **selection-detection seam**, not merely whether its footer UI/module loaded.

Issue #26 proved an important distinction:
- Witch Dock Bone HUD module/UI can be present and healthy;
- `HF.summonCircle` can exist;
- the detector can still be functionally dead because its HeroForge selection anchors/candidate seam is stale.

General/Core Runtime can prove the module loaded. This provider proves whether bone detection itself has a usable source, is attached, observes selection changes, and resolves a bone name.

## Strategy identity

The provider must expose the detector's current strategy as a stable descriptor, for example:
- `legacy-summon-circle-diff`;
- future named/capability selection seam.

Do not make the old child-index paths the long-term provider contract.

While the legacy implementation remains active, diagnostics may summarize whether its configured anchors resolve so #26 is explainable. Once a stable native seam replaces it, the provider can report that seam without preserving obsolete path details forever.

## Existing named seam

Current public API:
- `KWWitchDockBoneHUD.getState()`

It already exposes:
- version/build;
- configured/initialized;
- row connected/visible;
- value text;
- copy disabled;
- detector attached;
- failed/stopped;
- retry count;
- last bone name.

Provider v1 needs an additive bounded diagnostic seam for detector-source/candidate/baseline/failure facts.

## Immediate freeze

At capture T0 preserve:

### HUD/module state
- version/build;
- configured;
- initialized;
- row connected/visible;
- copy enabled/disabled;
- displayed state class: idle/detecting/failed/detected;
- last detected bone name.

### Detector lifecycle
- strategy ID;
- attached;
- failed;
- stopped;
- tries/maxTries;
- retry scheduled yes/no;
- delayMs;
- last initialization/retry timestamp if instrumented;
- last detection event timestamp/result.

### Selection source
- HeroForge selection source root available yes/no;
- source seam/capability ID;
- current candidate count;
- baseline entry count;
- source generation/identity when safely available;
- last source rebuild reason/result.

For the legacy strategy only:
- configured anchor count;
- resolved anchor count;
- unresolved anchor count.

Do not export arbitrary scene-tree objects.

## Deterministic summary

Manifest-first triage should see:

- detector strategy;
- initialized/attached/failed/stopped;
- source available;
- candidate count;
- baseline count;
- legacy resolved-anchor count when applicable;
- last bone detected yes/no + name when present;
- last detection outcome;
- warning/error codes.

A loaded module with zero usable candidates should be an explicit factual invariant.

## Stable sections

### `state`

Public HUD/module state plus detector strategy/lifecycle.

### `selection-source`

- source seam ID/type;
- root/source available;
- source generation/identity descriptor;
- candidate count;
- baseline count;
- source rebuild timestamp/result;
- legacy anchor-resolution counts when legacy strategy is active;
- limitations.

If future HeroForge exposes a named selected-bone API, this section should report capability/readiness without dumping the containing object.

### `detection`

Latest bounded detection facts:
- input event class: pointerup/click/other supported event;
- event accepted/ignored;
- candidate snapshot available;
- delta count;
- bind-joint candidate count;
- selected/best bone;
- selection score where current strategy uses scoring;
- result code;
- timestamp.

Do not record arbitrary clicked DOM contents.

### `failure-context`

Small retained recent failures/no-op reasons:
- selection source missing;
- configured anchors all missing;
- candidates empty;
- baseline unavailable;
- detector exception;
- listener attach failure;
- no qualifying bone delta after accepted event.

A normal click that simply selects no bone is not necessarily an error; retain only when useful for a failed-detection reproduction.

### `events`

- initialization attempt/result;
- source/candidates built;
- listener attached/detached;
- retry scheduled/started;
- accepted selection event;
- bone detected;
- detector failed/stopped/recovered.

## Retained failure evidence

Current detector can repeatedly retry and later overwrite the context that explains why it never attached.

Provider implementation should retain the latest bounded initialization failure:
- strategy;
- source root presence;
- configured candidate/anchor counts;
- resolved candidate count;
- reason;
- try number;
- timestamp.

For event-time failures retain:
- source/candidate/baseline availability;
- delta/bind candidate counts;
- bounded exception/result.

No scene graph dump.

## Warning/error codes

- `BONE_HUD_SELECTION_SOURCE_UNAVAILABLE`
- `BONE_HUD_CANDIDATES_UNAVAILABLE`
- `BONE_HUD_DETECTOR_NOT_ATTACHED`
- `BONE_HUD_DETECTOR_STOPPED`
- `BONE_HUD_DETECTION_FAILED`

Legacy-specific stale-anchor detail should normally be a factual limitation/reason, not a permanent universal warning-code taxonomy.

## Comparison modes

None.

Diagnostics do not synthesize clicks, select bones, rebuild HeroForge selection state, or retry the detector merely to make capture look healthier.

User clicks/retries remain user actions; capture observes the result.

## Privacy / bounding

Bone/joint names are acceptable private engineering evidence.

Exclude:
- arbitrary scene-tree dumps;
- clicked DOM text/content;
- full candidate object graphs;
- clipboard contents;
- unrelated character data.

Candidate/baseline evidence is counts and bounded string identifiers only.

## Pressure test — issue #26

A capture on the known stale implementation should make it immediately visible that:

- Bone HUD module/UI initialized;
- HeroForge selection root/summonCircle exists;
- legacy configured anchors resolve zero usable nodes/candidates;
- detector never attaches;
- retry/stopped lifecycle continues;
- no bone can be detected.

After #26 is repaired, the same provider should instead expose the new stable selection seam and prove listener/detection health without relying on old scene indices.

## Implementation seam needed

Extend Bone HUD with `getDiagnosticState()` or provider registration exposing:
- strategy identity;
- candidate/baseline counts;
- source availability;
- bounded anchor-resolution counts for the legacy strategy;
- latest detection/failure record.

Do not expose the internal detector object itself.

## Acceptance

Bone HUD provider v1 is capture-ready when:
- module-loaded and detector-functional states are distinguishable;
- #26 stale-anchor failure is obvious from bounded evidence;
- future detector strategy can replace legacy anchors without a new shared contract;
- capture never retries or synthesizes selection input;
- no scene graph or unrelated DOM content is exported.
