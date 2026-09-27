# Core Runtime Diagnostic Provider v1 — Design Specification

**Provider ID:** `core-runtime`  
**Provider schema version:** 1  
**Owning runtime:** Witch Dock channel/bootstrap, modular Core, Module Loader, registry  
**Modes:** snapshot, failure  
**Optional reproduction aid:** explicit bounded failure watch  
**Pressure test:** issue #7 intermittent `Loading failed: connection error`

## Purpose

General Capture already records a compact Witch Dock identity/loader summary. `core-runtime` is the **deeper optional provider** for failures involving:

- Witch Dock startup/bootstrap;
- immutable payload resolution;
- module fetch/execute failures;
- disabled/missing modules;
- registry/tool readiness;
- update/channel identity;
- intermittent request failures or transient loading notifications.

Do not include this provider by default merely because Witch Dock is present. General Capture is sufficient for ordinary tool bugs.

## Existing named seams

Prefer:

- active channel state such as `KWWitchDockDevChannel.getState()` or Stable equivalent;
- `KWModuleLoader.getState()`;
- `KWWitchDockCore.getState()`;
- `KWWitchDockRegistry.getState()`;
- manifest/module registry already loaded by Witch Dock.

Do not inspect Tampermonkey internals or raw privileged host objects.

## Immediate freeze

At capture T0 preserve:

### Channel/bootstrap

- Stable/Dev channel;
- wrapper/runtime version/build;
- payload ref/root identity;
- immutable payload flag;
- bootstrap status/error;
- component counts fetched/evaluated;
- host API version where publicly exposed.

### Module loader

Freeze `KWModuleLoader.getState()` before enrichment changes timing:
- loader version/build;
- status;
- started/completed/duration;
- immutable/fallback resolution counts;
- total/enabled/started/fetched/executed/failed;
- per-module:
  - id;
  - status;
  - source mode;
  - fetch start/end/duration;
  - executed timestamp;
  - bounded error.

Request URLs are sanitized to repository/path + allowlisted cache identity only.

### Core / registry

- Core started/status/uiReady;
- active tab;
- tab/tool/pending counts;
- root/compact connected;
- registry tool IDs/tab names/pending count.

This is point-in-time evidence. Do not call mount/register/start methods while capturing.

## Deterministic summary

Manifest-first triage should see:

- channel + wrapper/runtime build;
- payload ref;
- bootstrap status/error code;
- loader status/duration;
- total/enabled/executed/failed;
- immutable/fallback counts;
- failed module IDs + phases;
- slowest bounded module fetch durations;
- core started/uiReady;
- registry pending count;
- failure-watch armed/result status;
- warning/error codes.

## Stable sections

### `channel`

Normalized channel/bootstrap identity:
- channel;
- wrapper/runtime version/build;
- payload ref;
- immutable flag;
- bootstrap transport class;
- host API version;
- bootstrap status;
- component fetch/eval counts;
- sanitized manifest/payload source descriptor.

### `module-loader`

Normalized loader state and per-module records.

Include deterministic hashes for:
- ordered module ID/status list;
- module version/build inventory;
- failures.

Do not hash raw request URLs containing arbitrary queries.

### `registry`

- Core state;
- registry state;
- active tab;
- tab names;
- tool IDs;
- pending registrations;
- root/compact connectivity;
- enabled/disabled module/tool state where available.

### `startup-timeline`

Compact ordered milestones from existing timestamps:
- bootstrap start;
- immutable component fetch completion if exposed;
- Core start;
- Module Loader start;
- each module fetch completion;
- each module execution;
- loader completion.

This is derived from existing timestamps; diagnostics must not add waits merely to complete the timeline.

### `failure-watch`

Present only when an explicit bounded watch was armed.

See below. Otherwise coverage is `not-captured`, not an empty success.

### `failure-context`

Recent retained Core/loader/provider-owned failures:
- phase;
- module/component ID;
- safe error code/message;
- sanitized source descriptor;
- timestamps;
- retry/readback state when relevant.

### `events`

Meaningful Core lifecycle:
- bootstrap state transition;
- Core ready/error;
- module fetch/execute failure;
- registry pending -> mounted;
- explicit failure-watch arm/stop/match.

## Explicit bounded failure watch

Issue #7 demonstrates one class of evidence that **cannot reliably be reconstructed after the fact**: an intermittent failed request paired with a transient HeroForge notification.

Do not solve this by permanently monkeypatching all traffic or recording full network history.

The provider may expose an explicit user/developer action:

**Arm Runtime Failure Watch**

Suggested contract:
- maximum bounded session, default about 60 seconds and hard-capped;
- user reproduces the issue;
- watch automatically stops on first high-value match or timeout;
- every hook is removed on stop/dispose/navigation;
- capture/export remains a separate explicit action.

### Network observations

Use the least-invasive available source first:

1. capture-phase resource `error` events for failed element/resource loads;
2. Resource Timing / PerformanceObserver facts where the browser exposes useful status;
3. only if needed and validated safe, temporary wrappers around `fetch` and XHR.

Temporary wrappers, if required:
- preserve original arguments, `this`, return values/promises, prototype behavior as far as practical;
- never retry, delay, consume, clone, or read response bodies;
- record only failures/non-2xx status where relevant;
- cap records aggressively;
- uninstall exactly;
- record that instrumentation was active.

Network record:
- timestamp;
- API/source: resource/fetch/xhr;
- method when known;
- sanitized origin/path descriptor;
- HTTP status/status class when available;
- failure class;
- initiator type when safely available;
- duration when known.

No request/response bodies, headers, cookies, tokens, or arbitrary query strings.

### Transient notification observations

Do **not** repeat the old broad DOM text-node trace that saturated on normal HeroForge churn.

For known transient errors, use a bounded child-addition observer:
- inspect only newly added nodes/subtrees;
- retain only exact/allowlisted error-text matches such as `Loading failed: connection error`;
- record timestamp, bounded text, element tag/class descriptor, and removal timestamp if observed;
- cap matches.

Once a stable native notification container/semantic seam is proven, prefer it over broad body observation.

### Correlation output

The failure-watch summary may correlate by timestamp:
- notification match;
- nearest failed request(s);
- request status/path class;
- active Witch Dock modules/provider states at that instant.

Correlation is factual timing evidence, **not attribution**.

## Warning/error codes

- `CORE_BOOTSTRAP_FAILED`
- `CORE_PAYLOAD_IDENTITY_MISMATCH`
- `CORE_MANIFEST_FETCH_FAILED`
- `CORE_MODULE_FETCH_FAILED`
- `CORE_MODULE_EXEC_FAILED`
- `CORE_MODULE_FALLBACK_RESOLUTION`
- `CORE_REGISTRY_PENDING`
- `CORE_FAILURE_WATCH_TIMEOUT`
- `CORE_FAILURE_WATCH_MATCH`

A failed HeroForge asset request observed by the watch should keep its network failure class; do not label it a Witch Dock failure without evidence.

## Comparison modes

None.

Startup/channel/module capture is observational. A diagnostic must not reload the page, refetch modules, toggle tools, or change channels.

## Privacy / bounding

Exclude:
- raw GM/Tampermonkey values;
- auth headers/cookies/tokens;
- arbitrary request query strings/bodies/responses;
- full network history;
- unrelated DOM text;
- browser history.

Failure watch should cap records (for example tens, not thousands) and stop itself.

## Pressure test — issue #7

A useful reproduction should let triage answer:

- did a transient `Loading failed: connection error` notification actually occur;
- what failed request(s) occurred nearest it;
- status/path/source class;
- whether the request was a Witch Dock module/payload request, HeroForge asset request, or another origin;
- which Witch Dock modules/features were active;
- whether repeated failures targeted the same sanitized resource path.

It must **not** conclude ownership merely from temporal correlation.

## Implementation seams needed

Most snapshot evidence already exists through named APIs.

Future implementation work:
1. normalize Stable/Dev channel identity behind Diagnostics Core;
2. sanitize Module Loader request URLs before export;
3. add a bounded shared Core diagnostic event/failure ring;
4. implement failure watch only as an explicit optional diagnostic capability after validating wrappers/observers do not alter request behavior.

## Acceptance

Core Runtime v1 is capture-ready when:
- ordinary snapshot adds no network/DOM instrumentation;
- startup/module failures are readable without console logs;
- General Capture is not duplicated unnecessarily;
- explicit failure watch is bounded, reversible, body/header/token-free, and leaves request semantics unchanged;
- issue #7 can be investigated without another unbounded DOM/network trace.
