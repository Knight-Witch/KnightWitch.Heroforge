# Rendering Performance Diagnostic Provider v1 — Design Specification

**Provider ID:** `rendering-performance`  
**Provider schema version:** 1  
**Modes:** snapshot, performance  
**Purpose:** bounded point-in-time + short sampling for lag/stutter/resource-pressure reports

## Purpose

Diagnose performance degradation without turning Witch Dock into a permanent profiler.

Use when the symptom is:
- low/stuttering frame rate;
- input/render stalls;
- capture/render operations becoming progressively slow;
- suspected renderer/resource pressure;
- "works after restart, slows after long browser use" style reports.

Ordinary bug reports should not run this provider unless performance is relevant.

## Design principle

**Freeze current state first. Sample second.**

Do not "clean up," reload, force GC, reset renderer stats, disable tools, or wait for the page to become smooth before preserving the degraded state.

## Snapshot mode

Snapshot is read-only and fast.

### T0 facts

- timestamp / page visibility;
- `performance.now()`;
- current JS heap fields from `performance.memory` when browser exposes them;
- active renderer identity/capability class;
- `renderer.info` counters when available without reset;
- canvas pixel/client dimensions;
- devicePixelRatio;
- HeroForge updating/readiness state from General Capture;
- currently busy diagnostic/tool services through named public state:
  - Texture Quality busy/enabled;
  - Booth/native runtime active;
  - TRUE-resolution capture busy;
  - Spinny busy/paused;
  - other provider-declared busy flags.

Provider must not scan unknown globals looking for "busy."

## Explicit performance mode

Performance mode adds a **short bounded sample** initiated by the user.

Recommended initial policy:
- default sample around 10 seconds;
- hard cap around 30 seconds;
- automatically abort/mark partial if page visibility changes;
- no continuous background profiling.

The exact UX duration may change without breaking the provider schema.

### Frame timing sampler

Use `requestAnimationFrame` timestamps only.

Record aggregate statistics, not every frame indefinitely:
- sample duration;
- frame count;
- interval p50/p95/p99/max;
- approximate FPS;
- counts over thresholds such as 33 ms / 50 ms / 100 ms / 250 ms;
- longest bounded interval samples;
- visibility changes.

Do not call layout/style APIs every frame.

### Long tasks

If `PerformanceObserver` supports `longtask`:
- count;
- total long-task duration;
- p50/p95/max;
- bounded top durations;
- attribution category only when browser provides a safe useful descriptor.

No arbitrary cross-origin URLs or script bodies.

If unsupported, coverage=`unavailable`.

### Memory

At sample start/end when available:
- used JS heap;
- total JS heap;
- heap limit;
- delta.

Do not claim this is total browser/system memory.

No forced GC.

### Renderer counters

Read available active renderer counters at start/end without calling reset:
- geometries;
- textures;
- programs count;
- render calls;
- triangles;
- points;
- lines;
- frame counter where available.

Record unsupported fields as coverage, not zero.

Renderer counters may be cumulative; record start/end/delta and that semantic.

### Scene complexity

Optional bounded passive scan performed **outside the frame-timing sample** so it does not contaminate the sample.

If a stable scene root exists:
- cap visited objects;
- count Object3D/mesh/skinned-mesh/light/camera classes;
- count unique geometry/material/texture object identities via shallow known fields;
- scan duration;
- truncated boolean.

Do not recursively inspect material/uniform graphs.

If scan exceeds a small time/object budget, stop and mark `captured-bounded`.

### Active work

Snapshot provider states, not internals:
- enabled/active/busy status;
- current high-cost operation/profile;
- relevant target size/frame count for media capture;
- HR atlas target size;
- provider capture itself active yes/no.

This lets triage distinguish general browser slowdown from an expected high-cost Witch Dock operation without automatically blaming the operation.

## Deterministic summary

Manifest-first triage should see:
- sample present yes/no;
- sample duration;
- approximate FPS / p95 / max frame interval;
- long-task count/max if available;
- JS heap start/end/delta if available;
- renderer texture/geometry/program counts;
- renderer call/triangle deltas;
- scene object/mesh counts + truncation;
- active high-cost tools;
- performance warning codes;
- coverage limitations.

## Stable sections

### `snapshot`

Point-in-time T0 performance state:
- visibility;
- memory;
- renderer counters;
- canvas geometry;
- active-work summary.

### `frame-timing`

Aggregate bounded rAF sample.

### `long-tasks`

Aggregate PerformanceObserver result.

### `memory`

Start/end/delta with explicit browser API source and coverage.

### `renderer`

Renderer/capability identity plus start/end/delta info counters.

General `graphics` remains authoritative for general GPU/WebGL capability fields; do not duplicate its full payload.

### `scene-complexity`

Bounded shallow counts + scan budget/truncation.

### `active-work`

Named provider/service state correlated to sample start/end.

### `failure-context`

Sampler/provider errors only:
- observer unavailable;
- renderer disappeared/changed during sample;
- page hidden;
- rAF stopped;
- scene scan aborted/budget exceeded.

### `events`

- performance sample requested/start/end/abort;
- visibility change;
- renderer identity changed;
- high-cost provider state changed during sample.

Do not record every rAF callback.

## Warning/error codes

Mostly factual sample conditions:

- `PERF_SAMPLE_PAGE_HIDDEN`
- `PERF_SAMPLE_RAF_STALLED`
- `PERF_RENDERER_CHANGED`
- `PERF_LONGTASK_UNAVAILABLE`
- `PERF_MEMORY_UNAVAILABLE`
- `PERF_SCENE_SCAN_TRUNCATED`

Do not create arbitrary "LOW_FPS" severity without a documented threshold/use case; the raw metrics are more useful.

## Network/resource timing

Do **not** make performance v1 a second network diagnostic.

Module fetch timing belongs to `core-runtime`. Failed-request reproduction belongs to Core Runtime failure watch.

If later evidence shows resource-load timing is a major performance discriminator, add only bounded aggregate resource timing through a provider revision.

## Comparison modes

None.

A performance sample observes the current state. It does not restart the browser, reload HeroForge, toggle tools, change resolution, or force a "before/after" test.

Separate user captures before/after a restart or setting change can be compared by triage.

## Sampler overhead

The provider must record enough to interpret its own disturbance:
- sample duration;
- callbacks collected;
- whether scene scan occurred before/after, never during;
- provider version;
- instrumentation capabilities active.

Implementation should minimize allocations inside rAF callbacks and aggregate after/at bounded intervals.

## Privacy

No:
- browsing-history timing;
- unrelated tabs/processes;
- OS process data;
- URLs from arbitrary resource timing;
- browser extension list;
- device fingerprint expansion beyond General Capture;
- raw screenshots/canvas pixels.

## Acceptance

Rendering Performance v1 is capture-ready when:
- snapshot is quick and read-only;
- explicit sample automatically stops and cleans observers/listeners;
- frame timing collection does not query layout each frame;
- no GC/reset/reload/state toggle occurs;
- unsupported memory/longtask/renderer APIs produce truthful coverage;
- scene scan is bounded and excluded from timed sampling;
- active Witch Dock work is correlated through named provider state;
- output remains compact aggregates rather than thousands of frame entries.
