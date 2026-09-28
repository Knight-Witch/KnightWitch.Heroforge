# JSON Diagnostic Provider v1 — Design Specification

**Provider ID:** `json`  
**Provider schema version:** 1  
**Owning runtime:** `tools/JSON_Tool.js` bulk HeroForge library backup plus bounded compatibility observation of general character-JSON workflows (including ReCK when present)  
**Modes:** snapshot, failure  
**Comparison mode:** none

## Purpose

Diagnose JSON workflows without capturing the private character/library data being moved.

v1 has two independent evidence surfaces:

1. Witch Dock bulk library backup;
2. general character JSON reload/apply/import/export compatibility, including ReCK when present.

The second surface is observational. Witch Dock does not own ReCK or HeroForge's local-file UI and must not become their runtime dependency.

This provider has a stricter privacy boundary than most Witch Dock tools because runtime state may contain:
- HeroForge config IDs;
- character names;
- folder/mark names;
- authenticated same-origin endpoint URLs;
- downloaded raw character JSON;
- ZIP contents.

None of those are required for ordinary diagnostics.

## Current workflow

The tool:

1. waits for HeroForge readiness;
2. loads JSZip if needed;
3. pages `all_user_config/?meta_only=true`;
4. reads save-folder marks;
5. downloads every config with concurrency 5;
6. builds a ZIP;
7. downloads it locally;
8. retains failures in memory.

The provider should report **workflow mechanics and outcomes**, not library contents.

## Immediate freeze

At capture T0:

- running;
- paused;
- current stage/status code;
- configsTotal/configsDone;
- failure count;
- JSZip available/initialized;
- mark-map count only;
- fixed PAGE_SIZE;
- fixed CONCURRENCY;
- current operation start time;
- last progress timestamp;
- last bounded failure category;
- output-generation state.

Do not freeze/copy `state.zip`, config metadata arrays, mark map entries, or failure URLs.

## Deterministic summary

- running/paused;
- stage;
- done/total;
- failure count;
- JSZip ready;
- index fetch completed yes/no;
- mark count;
- per-stage failure counts;
- archive generation result/size when known;
- last operation status;
- warning/error codes.

## Stable sections

### `state`

- provider/tool version/build;
- running/paused;
- stage;
- configsTotal/configsDone;
- progress ratio;
- PAGE_SIZE / CONCURRENCY;
- JSZip presence;
- current status/error code.

### `index`

Counts only:
- pages fetched;
- total configs discovered;
- folder-mark count;
- index stage duration;
- index/marks request success/failure.

Never include config IDs, character names, folder names, or mark IDs.

### `transfer`

- total attempted/completed;
- active worker count if instrumented;
- success count;
- failure count;
- failure buckets by sanitized class:
  - index;
  - marks;
  - config-fetch;
  - parse;
  - ZIP write;
  - ZIP generate;
  - download;
- HTTP status class/code when safe;
- timing summary.

Do not include failing config ID or endpoint URL.

### `archive`

- ZIP engine version when available;
- archive generation started/completed;
- compression mode/level;
- generated blob size;
- with-failures boolean;
- download attempted/result;
- generated-at timestamp.

Do not list archive file paths because they contain user folder and character names.

### `failure-context`

Bounded sanitized failures:
- timestamp;
- stage;
- safe error code;
- HTTP status where available;
- retryable/non-retryable classification if known;
- bounded message with URLs/IDs/names removed.

Current `state.failures` contains URL + config_id and must **not** be copied directly into diagnostics.

### `events`

- backup requested;
- JSZip load start/result;
- index page result;
- marks result;
- transfer progress checkpoint;
- pause/resume;
- archive generation start/result;
- download result.

Do not create an event per individual successful config.

## Retained failure evidence

Instrument safe failure normalization at the moment errors occur.

For config fetch failures retain:
- stage=`config-fetch`;
- HTTP/network/parse class;
- status;
- request ordinal or anonymous sequence number;
- timestamp.

Do **not** retain:
- config ID;
- config URL;
- character name;
- target ZIP path.

The normal user-facing "Copy Failures" feature may continue using richer private in-memory data for the user; the diagnostic provider must derive a redacted view.

## Warning/error codes

- `JSON_DEPENDENCY_LOAD_FAILED`
- `JSON_LIBRARY_INDEX_FAILED`
- `JSON_MARKS_FETCH_FAILED`
- `JSON_CONFIG_FETCH_FAILED`
- `JSON_CONFIG_PARSE_FAILED`
- `JSON_ARCHIVE_GENERATE_FAILED`
- `JSON_DOWNLOAD_FAILED`
- `JSON_PARTIAL_BACKUP`

## Comparison modes

None. Diagnostics must never start/restart a library backup.

## Privacy exclusions

Strictly excluded from diagnostic export:
- character names;
- folder/mark names;
- config IDs;
- raw endpoint URLs containing config IDs;
- raw config metadata;
- character JSON;
- ZIP entries/paths;
- ZIP contents/blob;
- cookies/auth/session information;
- copied failure payload from the user UI.

Even though the HF.Status diagnostic attachment is private, this data is unnecessary for triage and should not enter the diagnostic bundle.

## Implementation seam needed

The current state is private inside `buildTool()`. Add a provider registration/read-only seam exposing only the normalized redacted fields above plus a sanitized event/failure ring.

Do not give Diagnostics Core access to the raw `state.zip`, `markNameById`, or `failures` structures.

## Acceptance

JSON provider v1 is capture-ready when:

- a mid-backup capture can show exactly which workflow stage is stuck/failing;
- pause/progress/concurrency/dependency state is visible;
- partial failure counts/categories are useful;
- generated archive success/size is visible;
- diagnostic JSON contains zero config IDs, character/folder names, raw save JSON, ZIP paths, or authenticated request URLs.


## General character JSON / ReCK compatibility

### Why this belongs here

Current ReCK uses HeroForge's own runtime seams:
- Reload reads `CK.UndoQueue.queue[CK.UndoQueue.currentIndex]` into its editor.
- Apply parses the editor contents and calls `CK.tryLoadCharacter(...)`.

Those operations can fail after a HeroForge update even when Witch Dock's bulk backup is completely healthy. The `json` provider therefore owns **workflow/capability evidence**, not just bulk-backup evidence.

### Privacy boundary

Never capture:
- ReCK/CodeMirror editor text;
- the current UndoQueue entry;
- raw character JSON;
- clipboard contents;
- selected local file contents;
- character/config identifiers merely to prove JSON loading;
- a deterministic full-character hash that could become a cross-report identifier.

It is safe/useful to capture **shape and operation metadata only**.

### `character-json` stable section

Capture:
- ReCK detected yes/no;
- ReCK version when exposed by its visible version tag;
- Reload/Apply controls present;
- `CK.UndoQueue` present;
- queue length;
- current index;
- current entry present yes/no;
- current entry top-level key count/key-name inventory only, bounded;
- current entry serialized byte length when safely measurable without retaining contents;
- `CK.tryLoadCharacter` capability present;
- `CK.character._needsUpdating` / `_inUpdate`;
- native/local JSON import/export UI capability presence when discoverable through stable named surfaces;
- explicit limitations for any UI/runtime path that cannot be identified safely.

### Passive operation evidence

The provider may install **bounded passive observers** for known JSON controls when they exist. Observation must never intercept/replace ReCK or HeroForge functions.

For ReCK:
- observe known Reload/Apply button activation;
- record operation type + timestamp;
- freeze UndoQueue length/current index before;
- read back length/current index/update flags after a short bounded settling window;
- correlate a bounded provider-owned error record if the click causes a same-window exception/rejection;
- never read editor contents.

For native/local-file surfaces:
- record only known control activation/result when a stable observable seam exists;
- do not inspect chosen file content or path.

Retain at most a small recent ring.

### General JSON warning/error codes

Add:
- `JSON_EDITOR_RUNTIME_UNAVAILABLE`
- `JSON_EDITOR_RELOAD_FAILED`
- `JSON_EDITOR_PARSE_FAILED`
- `JSON_EDITOR_APPLY_FAILED`
- `JSON_TRY_LOAD_CHARACTER_UNAVAILABLE`
- `JSON_UNDO_QUEUE_UNAVAILABLE`
- `JSON_LOCAL_IO_SURFACE_CHANGED`

Codes describe the boundary, not a specific third-party implementation.

### Acceptance extension

A JSON/ReCK failure report is capture-ready when triage can determine:
- whether ReCK/general JSON UI was present;
- whether HeroForge still exposed UndoQueue + `tryLoadCharacter`;
- whether an Apply/Reload was attempted;
- whether queue/update state changed afterward;
- whether a bounded error occurred;
- without receiving the user's JSON text.
