# Witch Dock Diagnostic Capture Architecture

**Status:** Design source of truth for issue #88  
**Runtime implementation owner:** `Knight-Witch/KnightWitch.Heroforge`  
**Shared intake contract owner:** `Knight-Witch/HF.Status/docs/contracts/DIAGNOSTIC_REPORT_CONTRACT.md`  
**Reference implementation:** High Res Diagnostic Capture v0.1.3

## Purpose

Witch Dock diagnostics preserve broad, structured runtime evidence so bug investigation can begin from a reproducible snapshot rather than ad hoc console probing.

Capture is evidence collection, not diagnosis. A capture may expose a useful divergence without proving causality. Absence from a capture never means a subsystem is healthy unless coverage explicitly says it was tested.

## Ownership

Witch Dock owns:
- runtime evidence collection;
- general environment / Witch Dock / HeroForge context;
- provider registration and execution;
- local diagnostic export;
- safe controlled comparison operations owned by a provider.

HF.Status owns:
- canonical report identity and intake;
- private diagnostic attachment storage;
- report/evidence linkage;
- triage state and issue linkage;
- the shared diagnostic-report envelope contract.

HF.Status must never be required for Witch Dock startup or core tool operation.

## Architecture

The long-term runtime has three layers.

### 1. Diagnostics Core

Common infrastructure, independent of any one tool:

- capture/package IDs;
- schema + provider version metadata;
- manifest and coverage vocabulary;
- general environment capture;
- Witch Dock launcher/module/registry state;
- lightweight HeroForge scene/readiness state;
- provider registry;
- provider selection;
- bounded recent diagnostic events;
- section indexing/addressable retrieval;
- deterministic package summary;
- local JSON export;
- optional handoff metadata for HF.Status.

The core does not know High Res AAIDs, Decal slot bindings, Booth capture targets, Pose bones, etc.

### 2. Diagnostic Providers

Each provider owns feature-specific evidence and any feature-specific controlled comparison.

Initial provider family:

- `texture-quality` — existing High Res reference provider;
- `booth`;
- `decals`;
- `body-editor`;
- `pose`;
- `json`;
- `rendering-performance`;
- optional startup/module-loader provider if general capture proves insufficient.

Provider rules live in `PROVIDER_CONTRACT.md`.

### 3. User / Intake Surface

Issue #59 owns the eventual public-Stable Bug Capture surface.

The surface should:
- capture explicitly on user action;
- show/save a local diagnostic JSON;
- allow feature-specific providers to contribute;
- remain useful when HF.Status is offline;
- never silently upload evidence;
- later support an explicit, optional HF.Status handoff under the shared contract.

## General Capture

Every diagnostic package should include a small common context before provider-specific sections.

Expected common surfaces:

- metadata: capture ID, timestamp, schema/build identities, mode;
- manifest: available sections/providers, approximate sizes, warnings, coverage;
- environment: browser/platform/viewport/DPR/GPU/WebGL where available;
- witchDock: channel/version/payload/module registry/loader/tool enablement;
- scene: safe route/build/readiness/figure counts and lightweight scene facts;
- warnings/errors: bounded Witch Dock-owned warnings and safe recent errors;
- events: bounded meaningful diagnostic events;
- coverage: captured / partial / unavailable / intentionally-not-captured;
- providers: provider-specific summaries and addressable sections.

The shared serialized envelope is defined by HF.Status's `DIAGNOSTIC_REPORT_CONTRACT.md`. Witch Dock may keep richer in-memory state as long as the exported package satisfies that boundary.

## Capture Modes

The core supports common mode names; providers declare which they implement.

### snapshot

Read-only current state. This is the default and must not mutate HeroForge or tool state.

### comparison

Optional provider-owned controlled transition. The provider must:
- preserve an immutable initial snapshot first;
- declare the transition;
- use supported lifecycle seams;
- stop on uncertain/failed mutation;
- read back before any retry;
- restore the original state where safe;
- record restoration success/failure.

The core does not invent generic transition logic.

### failure

Immediate snapshot after a known warning/error. May include bounded pre-failure events. Must not assume the warning proves root cause.

### performance

Bounded passive sampling. It should preserve the current laggy state before any optional transition or expensive probe.

Not every provider implements every mode.

## Provider Composition

A report should not run every provider automatically.

Typical packages:

- High Res bug: general + `texture-quality`;
- Booth bug: general + `booth` (+ rendering/performance only when relevant);
- Decal bug: general + `decals`;
- cross-feature interaction: general + explicitly selected providers.

Provider selection may use the active tool/report category as a hint, but users/triage must be able to request additional providers when evidence crosses subsystem boundaries.

## Addressable Sections

Large diagnostics must be section-addressable.

Consumers should be able to retrieve a provider section without loading an entire capture. High Res v0.1.3 proved this requirement when whole-snapshot Bridge output exceeded transport bounds.

The package manifest must expose:
- provider IDs and provider schema versions;
- section names;
- presence/coverage state;
- approximate serialized size;
- stable deterministic hash when useful.

### Triage-facing retrieval rule

The default downstream workflow is **manifest first, selective evidence second**.

Capture must therefore make it possible for triage/backend consumers to:
- identify providers and sections without loading the full bundle;
- compare deterministic summaries/hashes before requesting raw sections;
- address evidence stably as `captureId / providerId / sectionName`;
- retrieve only the section needed to answer a discriminator question;
- see explicit limitations when a section was partial, unavailable, intentionally omitted, or not applicable.

The local JSON remains the complete private source evidence. Section addressing is a logical contract and does not require Witch Dock to physically split one export into many files.

## Coverage

Coverage is mandatory.

Allowed core states:

- `captured`;
- `captured-bounded`;
- `captured-referenced-only`;
- `partial`;
- `unavailable`;
- `not-captured`;
- `not-applicable`.

Providers may add safe detail but should not invent incompatible meanings.

## Events

Continuous diagnostics should be cheap.

Providers/core may keep small in-memory ring buffers of meaningful lifecycle events. They must not retain unbounded console/network history or behave like telemetry recorders.

Capture freezes the recent bounded history at user action.

## Privacy / Default Exclusions

Default diagnostics must exclude:
- account identity;
- cookies/auth/session tokens;
- unrelated local/session storage;
- browsing history;
- arbitrary local files;
- raw full character JSON unless separately and explicitly staged;
- unbounded console/network logs;
- raw texture/pixel buffers unless a future provider explicitly adds an opt-in evidence mode.

Environment/GPU/browser data is diagnostic metadata, not guaranteed anonymous data.

## Failure Isolation

A provider failure must not block:
- Witch Dock startup;
- unrelated tools;
- other diagnostic providers;
- local export of already-captured sections.

Provider errors become coverage/warning records.

## Versioning

There are separate versions for:
- shared diagnostic-report contract;
- Witch Dock package/core schema;
- each provider schema;
- provider runtime implementation.

Additive provider fields should not require a breaking shared-contract bump.

Consumers must preserve unknown provider sections rather than discard them merely because they are not understood yet.

## High Res Reference Provider

High Res v0.1.3 is the reference implementation because it proved:
- immutable current snapshot;
- controlled comparison;
- deterministic facts/deltas;
- explicit coverage;
- bounded events;
- local JSON export;
- addressable OFF/ON section retrieval.

Generalization must preserve these working behaviors. Do not rewrite the provider simply to make it aesthetically generic.

## Architecture pressure tests

Use real prior bugs to test whether the architecture exposes reusable evidence, without hard-coding providers around those symptoms.

Reference cases:
- **#24 — HR ON/OFF body visual paint tint change:** capture should preserve the lifecycle/restore evidence needed to distinguish a visually wrong restored color-bake result from a healthy restore.
- **#32 — HR body paint zone collapse:** capture should preserve model paint intent, atlas/material/resource identity, AAID/mask bindings, and coverage well enough to locate the first runtime divergence without rebuilding broad ad hoc probes.
- **#34 — HR false restore warning / native body mask verification:** failure capture should preserve the exact bounded verifier inputs/state needed to distinguish a real restore failure from a verifier false positive before transient session state is destroyed.

These are validation cases, not provider-specific requirements. A useful field should enter a provider contract because it represents a reusable diagnostic surface.

## Implementation Sequence

1. Finalize this architecture and the provider contract.
2. Finalize HF.Status `DIAGNOSTIC_REPORT_CONTRACT.md` with intake + triage.
3. Under issue #59, implement the smallest Diagnostics Core around proven High Res concepts.
4. Adapt High Res to register through the core without losing v0.1.3 behavior.
5. Build the public-Stable generic Bug Capture surface.
6. Integrate local export with HF.Status's existing `diagnostic-json` evidence flow.
7. Add the next provider based on real bug value, not architecture completionism.
8. Add performance capture after ordinary snapshot/provider flow is stable.
