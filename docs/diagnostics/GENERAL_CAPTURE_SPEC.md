# General Diagnostic Capture v1 — Design Specification

**Status:** Design draft for issue #88  
**Owner:** Witch Dock Diagnostics Core  
**Shared envelope:** `Knight-Witch/HF.Status/docs/contracts/DIAGNOSTIC_REPORT_CONTRACT.md`  
**Implementation issue:** #59 — Generic Bug Capture utility + HF.Status reproduction handoff

## Goal

Define the evidence that **every** Witch Dock diagnostic capture should contain regardless of the reported tool.

General Capture exists to answer the first triage questions cheaply:

- what exact Witch Dock/runtime build was running;
- what loaded, failed, or was disabled;
- what browser/rendering environment existed;
- whether HeroForge was ready, updating, or in a degraded/transient state;
- which provider evidence is available;
- what capture limitations apply.

It must remain useful for Witch Dock bugs, HeroForge/UI interaction bugs, and HF JSON/Lob script reports where Witch Dock is only the diagnostic host.

## Core capture sequence

A user-visible capture should follow this order.

### Phase A — freeze volatile state

Immediately, before waits or enrichment:

1. assign `captureId`, mode, and start timestamp;
2. snapshot cheap synchronous General state;
3. invoke each selected provider's optional `freeze()`;
4. freeze current bounded error/event rings;
5. record which sources were unavailable at T0.

This phase is read-only and should complete as quickly as practical.

Do **not** wait for HeroForge to become idle/healthy before preserving the current state. A broken/update-in-progress state can be the evidence.

### Phase B — passive enrichment

After T0 is preserved:

- collect normalized WebGL/capability facts;
- collect full Witch Dock loader/registry summaries;
- collect safe HeroForge readiness/scene context;
- let providers build their bounded sections from T0 seeds/current read-only state;
- compute summaries, sizes, hashes, coverage, and manifest entries.

No state-changing operation is allowed in ordinary `snapshot` mode.

### Phase C — package

Build the shared envelope, validate internal references, calculate final package size, and make the JSON available for local download / optional later HF.Status upload.

## Envelope relationship

The HF.Status contract owns the top-level envelope:

```text
diagnosticContractVersion
captureId
capturedAt
captureMode
source
manifest
general
providers
coverage
```

This spec defines the Witch Dock-owned `general` payload and the manifest entries that describe it.

## General schema version

`general.schemaVersion = 1`

Breaking changes to the General section require a General schema-version bump, not necessarily a shared diagnostic-contract bump.

## General sections

The v1 General payload contains these independently addressable sections.

### `environment`

Purpose: reproduce browser/device constraints without collecting account data.

Capture:
- bounded `navigator.userAgent`;
- bounded `navigator.platform`;
- `hardwareConcurrency`;
- `deviceMemory` when exposed;
- viewport width/height;
- devicePixelRatio;
- document visibility state;
- online/offline boolean;
- current document readyState.

Do not capture:
- language list;
- timezone;
- installed fonts/plugins;
- browsing history;
- arbitrary device identifiers.

### `graphics`

Purpose: distinguish renderer/GPU/capability boundaries.

Capture when available from HeroForge's active renderer/WebGL context:
- WebGL version;
- GLSL version;
- vendor;
- renderer;
- selected capability limits:
  - max texture size;
  - max renderbuffer size;
  - max viewport dimensions;
  - combined texture-image units;
- context lost/current-state flag where observable;
- selected capability/extension presence only when it has known diagnostic value.

Do not dump the full extension list or arbitrary GL state.

### `witch-dock`

Purpose: prove exactly what Witch Dock runtime was active.

Capture from named public seams where available:
- Stable/Dev channel identity;
- installed wrapper version when exposed;
- runtime/core version/build;
- immutable payload/ref;
- manifest/core source identity;
- compact module-loader status/summary counts;
- compact module inventory rows:
  - id;
  - registry version/build;
  - enabled/disabled;
  - final status;
- failed module IDs/status codes when present;
- registry state:
  - tool IDs;
  - tab names/counts;
  - pending count;
- active Witch Dock tab/tool context where available;
- Diagnostics Core version/schema/provider inventory.

Detailed module fetch/execute timing, request-source descriptors, and startup timeline belong to the optional `core-runtime` provider. General does not duplicate them.

Any source descriptors retained by General must be normalized/sanitized. Never preserve auth-like query parameters.

### `hero-forge`

Purpose: capture safe page/app identity without treating a HeroForge save URL as public data.

Capture:
- origin;
- normalized route kind;
- config/save identifier when it can be extracted from the HeroForge route;
- safe HeroForge build/version/update identifiers only from known scalar seams;
- presence/readiness of named runtime anchors needed by diagnostics.

Do not serialize arbitrary globals or page storage looking for a version.

Raw HeroForge URLs remain private evidence if included elsewhere.

### `scene`

Purpose: identify whether the app was stable, updating, multi-figure, or missing a usable display.

Capture bounded scene facts:
- character/runtime object availability;
- figure/display count;
- primary display presence/key;
- `_needsUpdating` / `_inUpdate` where available;
- resources-ready / finished/readiness flags where exposed;
- current display existence;
- known maker/render-manager readiness;
- lightweight figure keys/primary markers only.

Part, material, paint, atlas, decal, pose, or Booth-specific details belong to providers.

### `errors`

Purpose: preserve recent technical failure context without console scraping.

Diagnostics Core may maintain a bounded in-memory ring from:
- `error`;
- `unhandledrejection`;
- Diagnostics Core/provider failures;
- Witch Dock module-loader failures.

Each record is bounded:
- timestamp;
- source/type;
- message;
- sanitized source path;
- line/column;
- bounded stack if available.

No full console interception and no unbounded history.

### `events`

Purpose: provide minimal lead-up context.

Core events should be meaningful lifecycle events only, e.g.:
- diagnostic core/provider registration;
- route change observed by the core;
- visibility/online transition;
- capture requested/started/completed;
- provider capture failed/unavailable.

Provider-owned feature events remain in the provider.

### `coverage`

Purpose: make absence interpretable.

Every General section receives:
- coverage state;
- capturedAt;
- limitation/reason code if not complete;
- truncation facts when bounded.

## Manifest entry

Every General/provider section should produce a compact manifest row conceptually like:

```json
{
  "owner": "general",
  "sectionName": "graphics",
  "schemaVersion": 1,
  "coverage": "captured",
  "capturedAt": "2026-09-26T00:00:00Z",
  "sizeBytes": 1832,
  "hash": {
    "algorithm": "sha256",
    "value": "..."
  },
  "limitations": []
}
```

Logical address:

`captureId / general / sectionName`

Provider addresses remain:

`captureId / providerId / sectionName`

## Stable hashing

For exported v1 packages, preferred section hashing is SHA-256 over deterministic normalized JSON.

Rules:
- object keys sorted;
- arrays retain semantic order;
- volatile object identity tokens are included only where the provider intentionally exposes them;
- truncation markers are part of the hashed content;
- hash algorithm is always recorded.

Existing provider-local legacy hashes may remain during migration but should not be mistaken for the canonical section hash.

## Size / bounding policy

The current HF.Status direct diagnostic attachment ceiling is 10 MiB, but the capture format must not depend on that number.

Design targets:
- General payload: normally well below 256 KiB;
- ordinary provider: normally below 1 MiB;
- full package target: comfortably below the server-advertised limit;
- large sections: truncate or mark `captured-referenced-only` rather than silently exploding package size.

The future reporter must consult HF.Status capabilities before upload. Local download should remain possible even if a package is too large for direct intake, with an explicit oversize warning/manifest limitation.

## URL sanitation

Generic capture must never copy arbitrary query strings.

Represent URLs as bounded descriptors:
- origin;
- pathname;
- allowlisted non-secret identifiers when needed;
- query/hash omitted by default.

Provider/resource paths known to be public/static assets may preserve their paths when diagnostically necessary.

## Capture limitations

The manifest must state relevant limits such as:
- event ring began after page startup;
- provider loaded after the failure;
- WebGL debug renderer info unavailable;
- scene had no ready display;
- section truncated at item/byte limit;
- capture occurred while HeroForge was updating.

These are evidence, not warnings to "fix" before capture.

## Failure behavior

If one General section fails:
- preserve all completed sections;
- mark the failed section `unavailable` or `partial`;
- add a bounded warning/error;
- continue provider capture where safe.

If Diagnostics Core itself cannot build a valid envelope, local UI should surface the failure and must not pretend a usable diagnostic file exists.

## Privacy boundary

General Capture never includes by default:
- HeroForge account identity;
- cookies/tokens/auth headers;
- arbitrary local/session storage;
- browsing history;
- raw full character JSON;
- screenshots/video;
- clipboard;
- filesystem contents;
- unbounded network/console logs.

Those remain separate explicit evidence channels.

## v1 acceptance tests

Before implementation is considered ready:

1. Works with no provider loaded: General-only package remains valid.
2. Works with one provider failure: General + other providers still export.
3. Captures an actively updating HeroForge state without waiting it away.
4. Loader failure appears in `witch-dock` and `errors`.
5. WebGL details unavailable -> truthful coverage, not missing fields interpreted as healthy.
6. Same normalized section state -> same canonical section hash.
7. Sensitive-token-shaped URL/query data is not exported.
8. Package can be indexed manifest-first without deserializing every provider section.
