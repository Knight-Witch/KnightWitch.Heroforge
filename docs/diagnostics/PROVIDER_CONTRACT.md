# Witch Dock Diagnostic Provider Contract

**Status:** Draft design contract for issue #88  
**Core architecture:** `CAPTURE_ARCHITECTURE.md`  
**Shared serialized boundary:** `Knight-Witch/HF.Status/docs/contracts/DIAGNOSTIC_REPORT_CONTRACT.md`

## Purpose

Providers contribute bounded feature-specific evidence to the general Witch Dock diagnostic package without coupling Diagnostics Core to tool internals.

## Stable Identity

Every provider declares:

- `providerId` — stable lowercase slug, never a UI label;
- `providerSchemaVersion` — serialized provider-section schema version;
- runtime `version` / `build`;
- supported capture modes;
- optional capability/dependency metadata.

Examples:
- `texture-quality`;
- `booth`;
- `decals`;
- `body-editor`;
- `pose`;
- `json`;
- `rendering-performance`.

Provider IDs must not change merely because UI names change.

## Conceptual Registration

The exact JS API may evolve during issue #59, but the provider boundary should resemble:

```js
registerProvider({
  providerId,
  providerSchemaVersion,
  version,
  build,
  modes,
  capabilities,
  capture(context),
  compare?(context, comparisonMode),
  dispose?()
})
```

Diagnostics Core owns registry/lifecycle/package assembly. Providers own feature-specific reads and safe provider-specific transitions.

## Capture Result

A provider returns normalized evidence, not arbitrary live objects.

Conceptual result:

```json
{
  "providerId": "texture-quality",
  "providerSchemaVersion": 1,
  "summary": {},
  "sections": {
    "figures": {},
    "atlas": {},
    "resources": {}
  },
  "coverage": [],
  "warnings": [],
  "events": []
}
```

The core may store sections separately internally/export-side while preserving the same logical structure.

## Snapshot Rule

`snapshot` capture is read-only.

A snapshot provider must not:
- toggle feature state;
- rebuild HeroForge state;
- refresh resources merely to make evidence prettier;
- navigate;
- mutate user preferences;
- clear caches.

If useful state is unavailable without mutation, record it as unavailable and expose a separate explicit mode.

## Comparison Rule

Comparison is optional and provider-owned.

A comparison provider must:
1. freeze the original state first;
2. declare intended transitions;
3. use supported/named lifecycle seams where possible;
4. perform each mutation at-most-once;
5. read back after uncertain execution rather than replaying;
6. stop on failed transition;
7. retain partial evidence;
8. restore original state when safe;
9. record restoration result.

The provider must never imply that a detected delta is causal.

## Bounded Evidence

Provider output must be bounded.

Prefer normalized facts:
- IDs/names/slots instead of entire part objects;
- path/dimensions/identity instead of texture objects;
- allocation rectangles instead of renderer dumps;
- hashes/signatures plus normalized underlying values;
- relevant material uniforms rather than whole shader graphs.

Large optional evidence must be separately addressable.

## Sections

Section names are provider-owned but should be stable once published.

Providers should expose meaningful surfaces rather than symptom-specific one-off fields.

A field discovered during investigation should be promoted when it represents a reusable diagnostic surface, not merely because it helped one bug.

When triage repeatedly records the same capture gap, treat that as provider-design evidence. The provider may evolve after reviewing privacy, size, stability, and runtime ownership; triage does not edit provider schemas itself.

## Triage-readiness

Providers must support downstream **manifest-first / selective-evidence** triage.

At minimum:
- every published section has a stable section name;
- provider schema identity is explicit;
- deterministic summaries contain high-value factual state only;
- hashes/signatures are used when they help detect equality/change without hiding normalized values needed for investigation;
- warning/error codes are stable when the provider owns the condition;
- coverage truthfully records unavailable/partial/bounded evidence;
- large or expensive evidence is independently addressable where practical.

Providers must not require triage to deserialize arbitrary live objects or load the entire capture merely to discover what evidence exists.

## Summary

Each provider returns a compact deterministic summary containing factual high-value state.

The summary must not contain model-generated diagnosis.

Good:
- bodyUpper allocation 2048x2048;
- paintByIntent hash unchanged;
- 2 warnings;
- 1 resource fallback observed.

Bad:
- likely stale cache;
- probably HeroForge bug;
- root cause is AAID.

## Coverage

Every provider reports coverage using the core vocabulary.

Coverage should distinguish:
- unsupported;
- unavailable at capture time;
- deliberately not captured;
- partially captured/truncated;
- captured successfully.

Missing evidence must never silently look healthy.

## Warning / Error Records

Providers own stable codes for provider-controlled conditions.

Common record shape:

```json
{
  "provider": "texture-quality",
  "code": "HR_RESTORE_MASK_NOT_ADOPTED",
  "phase": "disable_restore",
  "severity": "warning",
  "message": "...",
  "expected": {},
  "actual": {}
}
```

Unknown HeroForge/browser exceptions remain raw bounded observations until a stable code is justified.

## Events

Providers may maintain bounded event rings.

Only meaningful lifecycle events belong there. Do not record every animation frame or all network/console activity.

## Provider Dependencies

Dependencies are capabilities, not hard runtime coupling.

A provider may declare that another provider/context improves capture, but:
- failure of the dependency must be represented as coverage;
- unrelated capture must continue;
- no optional provider may become required for Witch Dock startup.

## Privacy

Providers inherit Diagnostics Core exclusions and may only expand data collection through an explicit reviewed provider design.

Never collect secrets/auth/account data merely because an object is reachable.

## Compatibility

Consumers must ignore/preserve unknown additive fields.

Breaking provider-section changes require a provider schema-version bump. They do not automatically require a shared report-contract bump.

## High Res Migration Constraint

`texture-quality` should be adapted from the validated High Res Diagnostic Capture v0.1.3 rather than rewritten from scratch.

Its current behaviors are protected until regression testing proves a generalized implementation equivalent:
- observational current capture;
- Native OFF -> HR ON controlled comparison;
- restoration;
- deterministic summary/delta;
- coverage;
- sectional retrieval;
- local export.
