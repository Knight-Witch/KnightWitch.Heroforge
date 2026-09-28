# Booth Diagnostic Provider v1 — Design Specification

**Provider ID:** `booth`  
**Provider schema version:** 1  
**Owning runtime:** Booth v27.1.0, Booth Runtime Bootstrap v0.2.1, Photo Booth media services  
**Modes:** snapshot, failure  
**Performance mode:** deferred to `rendering-performance` / later media-specific design  
**Pressure tests:** issue #20 Booth settings JSON; issue #10 Booth cold-start, explicit session handoff, media-readiness repairs

## Purpose

Capture enough state to separate Booth failures across four distinct boundaries:

1. Witch Dock's requested/persistent Booth state;
2. HeroForge's lazy native Booth runtime/bootstrap state;
3. Photo Booth presentation/settings state;
4. Witch Dock media capture providers that depend on a ready Booth runtime.

The provider must not treat "Booth looks wrong" as one failure class.

## Current named seams

Prefer these existing public seams:

- `KW_WD_BOOTH.getState()`;
- `KW_WD_BOOTH_BOOTSTRAP.getState()`;
- `KWPhotoBoothTrueResolution` public state/getters;
- `KWPhotoBoothTrueResolutionReadiness.sync()` only for UI behavior, **not during snapshot**;
- `KWSpinnyMiniWebP.diagnostics`, `lastCapture`, and capability getters.

Current Booth v27.1.0 also has internal state that is diagnostically useful but not exposed by `getState()`. Implementation should add a **bounded read-only diagnostic seam** rather than having Diagnostics Core reach into private closure state or scrape `KW_WD_BOOTH_DIAG()` JSON strings.

The new seam must not replace the existing public API or alter Booth ownership.

## Immediate freeze

At capture T0 preserve synchronously:

### Witch Dock Booth state

- version/build;
- default Booth persistence;
- default Black Canvas;
- session Booth View;
- session Black Canvas;
- whether the session was default-owned;
- saved Booth setup detected/mode/signals;
- seen-Booth / auto-applied flags;
- loop active;
- character root/generation key;
- component toggles:
  - lighting;
  - effects;
  - overlays;
  - background.

### Native/runtime state

- BT present;
- `BT.setBoothMode` present;
- `BT.liveEngine || BT.maker` present;
- engine enabled;
- current Booth mode;
- display/environment/overlay presence;
- whether native Booth UI is currently active.

### Bootstrap state

Freeze `KW_WD_BOOTH_BOOTSTRAP.getState()`, including:
- inFlight;
- attempts/bootstrapCount;
- trigger/mode/signals;
- loader strategy;
- native readiness;
- script count/duplicate count;
- script status/ownership descriptors;
- last error;
- direct session request counters/timestamps.

### Presentation state

Bounded descriptors:
- background/frame/shadow/mask overlay visibility;
- canvas dimensions/client dimensions;
- canvas and holder background style;
- environment/background mesh/material identity class;
- Black Canvas expected/applied boolean;
- current layout key or normalized layout geometry;
- frame/shader-frame hidden state where owned by Witch Dock.

### Media state

- TRUE-resolution service enabled/installed/lost/busy/status/error;
- current/last TRUE-resolution capture status;
- Spinny busy/paused/mode/profile/capability/progress/status/error;
- last Spinny capture status and restoration flags;
- last guarded user-action descriptor.

T0 freeze must not call readiness `sync()`, activate Booth, save settings, request resources, or start media capture.

## Retained failure evidence

Booth should retain a bounded provider-owned failure ring before transient state is overwritten.

Useful failure classes:

### Runtime/bootstrap

- native Booth script load failure;
- `BT.setBoothMode` failure;
- engine-enable timeout;
- duplicate native Booth script;
- default reconciliation failure;
- direct session request accepted but bootstrap failed.

Record:
- trigger;
- mode/signals;
- loader strategy;
- script topology;
- attempt number;
- exact bounded error;
- runtime/native readiness before cleanup.

### Settings file operations

Record the most recent Save/Load attempt without retaining user file contents:
- operation: save/load;
- started/completed timestamps;
- input format classification: Witch Dock / legacy effects / raw Booth config / invalid;
- expected/current Booth mode;
- apply seam used;
- success/failure code;
- bounded error;
- post-apply render-refresh requested;
- deterministic **settings-shape/hash** before/after when available.

Do not retain imported raw JSON as provider diagnostic state. The user's selected file is separate explicit evidence if ever needed.

### Presentation / persistence

When Witch Dock-owned rearm/restore logic fails, retain:
- expected session/default toggles;
- observed native runtime mode/enabled state;
- component states;
- Black Canvas expected/applied;
- overlay visibility;
- character generation key;
- silent-cycle / one-shot-rearm phase;
- bounded recent Booth debug events.

### Media

TRUE-resolution/Spinny already retain strong last-capture state. The Booth provider should preserve the latest provider-owned failure summary:
- requested profile/size;
- capability state;
- provider installed/lost;
- capture phase/status;
- restoration flags;
- bounded error;
- guarded/cancellation context.

## Deterministic summary

Manifest-first triage should see:

- Booth runtime available/ready;
- current native Booth mode;
- session Booth View ON/OFF;
- Black Canvas ON/OFF and expected/applied;
- saved Booth setup present/mode;
- component toggles;
- bootstrap inFlight/attempts/bootstrapCount;
- native Booth script count/duplicates;
- bootstrap last-error code;
- normalized current Booth settings hash;
- presentation invariant summary;
- TRUE-resolution provider ready/busy/last result;
- Spinny ready/busy/paused/last result;
- warning/error codes.

The summary must distinguish **capability ready but UI stale/disabled** from capability unavailable. Issue #10 proved that distinction matters.

## Stable sections

### `state`

Witch Dock Booth state:
- version/build;
- defaults/session toggles;
- default/session ownership;
- saved setup mode/signals;
- component toggles;
- seen/autoApplied/loop state;
- character generation key/change timestamp;
- bounded provider status/error.

### `bootstrap`

Normalized `KW_WD_BOOTH_BOOTSTRAP.getState()`:
- bootstrap version/build;
- persistence/session request;
- native readiness;
- stability counters;
- inFlight/attempts/bootstrap count;
- trigger/mode/signals;
- HeroForge version used for native script URL;
- loader strategy;
- script topology;
- timestamps/errors;
- direct-session counters.

Script URLs must follow General URL sanitation. The relative public `/gated/booth.js?version=...` descriptor may be retained when useful; do not copy arbitrary query strings.

### `native-runtime`

Read-only descriptors of native HeroForge Booth ownership:
- BT presence;
- engine presence/type;
- engine enabled/enabled-for;
- current mode;
- named capability presence such as `setBoothMode`, `composeDisplayState`, `loadPortrait`, `takeScreenshot`;
- display/environment/overlays/lighting presence;
- saved-config signals.

Capture capability presence, not function source text.

### `settings`

Read-only normalized current Booth settings.

Prefer `composeDisplayState()` where available because current source already uses it as authoritative state. Snapshot must **not** call `captureBoothSettingsFile()` because that path intentionally invokes save operations before export.

Record bounded known domains:
- camera / camera-save descriptors;
- filters;
- selected filter IDs;
- lighting;
- effects/pass identifiers/state;
- aspect;
- mode;
- other known scalar/config domains present in current HeroForge state.

For potentially large/nested domains:
- keep normalized high-value fields;
- include deterministic domain hash;
- include field/key inventory;
- mark truncation explicitly.

Do not include character/model payloads merely because a composed state contains a `model` field. Character JSON remains separate explicit evidence.

### `presentation`

Capture:
- native Booth active/inactive;
- background/frame/shadow/mask visibility;
- canvas pixel/client dimensions and DPR-related geometry;
- canvas/holder background;
- environment/background availability;
- material identity/texture source descriptors when Witch Dock Black Canvas/backdrop ownership is involved;
- Black Canvas expected/applied;
- Witch Dock frame/shader-frame hiding state;
- canvas layout key/normalized geometry;
- captured/editor baseline availability booleans.

Do not serialize full materials/uniform graphs. If a backdrop bug later needs specific uniforms, promote only reusable bounded fields.

### `components`

Capture persisted/current Booth component ownership:
- lighting ON/OFF;
- effects ON/OFF;
- overlays ON/OFF;
- background ON/OFF;
- captured-state availability;
- current enabled effect-pass names where safely available;
- lighting-state structural/hash summary;
- selected token-background/frame identifiers where safe.

This section distinguishes "state was lost" from "state exists but presentation did not replay."

### `media`

Subrecords for current Booth-dependent capture services.

#### TRUE-resolution
- service build;
- enabled;
- providerInstalled/providerLost;
- busy/status/error;
- readiness/capability facts without mutating UI;
- last capture:
  - requested size;
  - capture mode;
  - native/tiled topology;
  - tile/grid/phase counts;
  - source groups;
  - result dimensions/bytes where known;
  - effectsRestored;
  - status/error/timestamps.

#### Spinny
- version/build;
- selected profile;
- capability;
- busy/active mode;
- pause requested/paused/boundary frame;
- bounded timing summary;
- progress/status/error;
- last capture:
  - profile/mode;
  - rendered/encoded frames;
  - frame-source diagnostics summary;
  - output validation/result;
  - cancellation cause;
  - guarded action;
  - rotationRestored;
  - status/error/timestamps.

Full timing history/per-frame details belong to a later performance provider unless a specific media failure requires a bounded sample.

### `failure-context`

Bounded retained provider failures from runtime/bootstrap/settings/presentation/media.

Coverage is `not-applicable` if no retained Booth failure exists.

### `events`

Bounded meaningful Booth lifecycle events, such as:
- user/default session request;
- native runtime bootstrap start/success/failure;
- native Booth entered/exited;
- character generation changed;
- saved setup detected/missing;
- silent rearm scheduled/completed;
- Black Canvas apply/restore;
- settings save/load start/result;
- media provider ready/lost;
- media capture start/result.

Current private `debugLog` is a useful implementation source but should be normalized into stable event codes rather than exported wholesale forever.

## Warning/error codes

Initial provider-owned code families should be small and stable:

- `BOOTH_NATIVE_RUNTIME_UNAVAILABLE`
- `BOOTH_NATIVE_SCRIPT_LOAD_FAILED`
- `BOOTH_NATIVE_SCRIPT_DUPLICATE`
- `BOOTH_BOOTSTRAP_TIMEOUT`
- `BOOTH_BOOTSTRAP_FAILED`
- `BOOTH_SETTINGS_INVALID`
- `BOOTH_SETTINGS_MODE_MISMATCH`
- `BOOTH_SETTINGS_APPLY_FAILED`
- `BOOTH_PRESENTATION_MISMATCH`
- `BOOTH_MEDIA_READINESS_MISMATCH`
- `BOOTH_MEDIA_CAPTURE_FAILED`
- `BOOTH_MEDIA_RESTORE_FAILED`

Do not map every thrown string to a permanent code.

## Comparison modes

**None for provider v1.**

Booth transitions are broad and stateful:
- loading lazy native runtime;
- enabling/disabling Booth;
- replaying lighting/effects/overlays/background;
- mutating camera/settings;
- potentially interacting with capture providers.

Ordinary diagnostics should snapshot the failure as-is. Controlled Booth round-trip/rearm tests remain explicit engineering probes until a repeatable, safely restorable comparison case proves worth productizing.

## Cross-provider dependencies

- General `graphics` supplies GPU limits used by media.
- `rendering-performance` may later add detailed performance evidence for slow captures.
- Texture Quality/Decals should only be included when the reported symptom crosses those boundaries.

Booth capture must remain valid without them.

## Privacy exclusions

Beyond General Capture, do not include:
- character name used in exported Booth filename;
- raw imported settings file contents;
- full character/model data embedded in Booth state;
- screenshots/captured image bytes;
- output media bytes;
- arbitrary native runtime object dumps.

## Pressure tests

### Issue #20 — Booth JSON import/export

The provider should make it cheap to prove:
- current authoritative Booth runtime/seams;
- current settings shape/hash;
- settings operation format classification and result;
- pre/post settings state;
- mode mismatch or invalid-file failure;
- unrelated Booth session state remained coherent.

### Issue #10 — Booth cold-start/bootstrap

The provider should expose:
- user/default Booth request;
- BT absent/present;
- native script loader strategy;
- script count/duplicates;
- attempts/inFlight;
- `setBoothMode` / engine readiness;
- final native-ready state.

### Issue #10 — stale media readiness

The provider should distinguish:
- TRUE-resolution / Spinny capability actually ready;
- service provider installed;
- Booth engine ready;
- UI/readiness surface stale.

That should not require manually calling `sync()` merely to learn whether the service was capable.

## Implementation seams needed

Provider v1 should be implementable mostly from existing public state, with narrow additive read-only seams:

1. Add `KW_WD_BOOTH.getDiagnosticState()` (or a dedicated Booth diagnostic provider seam) exposing bounded private state needed by `presentation`, `components`, events, and failure context.
2. Add non-mutating TRUE-resolution readiness state instead of invoking `sync()` to infer readiness.
3. Normalize existing Spinny `diagnostics` / `lastCapture`; do not duplicate its state machine.
4. Add small bounded retained settings/presentation failure records where current code only updates UI/log text.

These seams are future issue #59/provider implementation work, not #88 runtime changes.

## Acceptance

Booth provider v1 is capture-ready when:

- snapshot does not activate/load/toggle Booth or call save/apply operations;
- a cold-start failure is classifiable from manifest + `bootstrap`;
- a settings round-trip failure preserves operation outcome without embedding the user's file;
- Black Canvas/presentation mismatch exposes expected vs actual presentation state;
- ready-capability/stale-UI media mismatch is distinguishable;
- current TRUE-resolution/Spinny failure/restoration state is preserved;
- no character/model JSON or media bytes leak into the diagnostic bundle.


## Booth settings JSON — operation evidence amendment

New user reports of Booth JSON import failures make the previously planned settings-operation evidence a **current implementation requirement**, not a deferred nicety.

### `settings-io` stable section

Booth should retain the most recent bounded settings-file operations independently of generic current `settings` state.

For each retained operation:
- operation: `save` / `load`;
- started/completed timestamp;
- result: success / cancelled / failed;
- input classification for loads: `witch-dock`, `legacy-effects`, `raw-config`, `invalid`, or unknown if parse failed before classification;
- file-format version when present;
- file-declared Booth mode, if present;
- current native Booth mode at attempt;
- capability presence for `savePortrait`, `loadPortrait`, `loadCameraSave`, `loadEffectsFromConfig`, and render refresh;
- normalized settings shape/hash before operation when available;
- normalized settings shape/hash after successful load when available;
- whether camera/effects follow-up seams were requested;
- whether render refresh was requested;
- `legacyEffectsOnly`;
- stable result/error code;
- bounded sanitized message.

Never retain filename, character name, raw selected JSON, raw Booth config/model, or arbitrary local-file metadata.

### Required operation codes

Use the existing Booth code family plus:
- `BOOTH_SETTINGS_PARSE_FAILED`
- `BOOTH_SETTINGS_RUNTIME_UNAVAILABLE`
- `BOOTH_SETTINGS_SAVE_FAILED`
- `BOOTH_SETTINGS_LOAD_FAILED`

`BOOTH_SETTINGS_INVALID`, `BOOTH_SETTINGS_MODE_MISMATCH`, and `BOOTH_SETTINGS_APPLY_FAILED` remain valid for narrower failures.

### Capture behavior

A snapshot after a failed import must still expose the retained `settings-io` attempt even if the UI status text has since changed.

Diagnostics must **not** retry the import or call `loadPortrait`/`savePortrait` merely to obtain evidence.
