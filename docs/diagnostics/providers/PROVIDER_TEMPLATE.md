# Diagnostic Provider Design Template

Use this template for each provider under `docs/diagnostics/providers/`.

## Identity

- Provider ID:
- Provider schema version:
- Owning runtime/module(s):
- Supported capture modes:
- Reference issues/fixtures:

## Purpose

What reusable diagnostic boundary does this provider expose?

## Runtime seams

List the named/public/capability seams the provider reads. Private/minified seams require explicit justification and should be avoided where a stable seam exists.

## Immediate freeze

Define the smallest synchronous/read-only state that must be frozen at capture T0 before asynchronous work can alter it.

If no volatile state exists, say `none`.

## Retained failure evidence

Define whether the provider keeps a small bounded last-failure/event record before its own cleanup destroys transient evidence.

Retained failure evidence:
- is local/in-memory only until the user explicitly captures;
- is bounded;
- contains facts needed to explain the provider-owned warning/error;
- never includes secrets/raw giant objects.

## Deterministic summary

List high-value factual fields that triage should see from the manifest/index without loading sections.

No diagnosis/hypothesis text.

## Sections

For each stable section specify:
- section name;
- purpose;
- source seam;
- required/optional fields;
- bounding/truncation;
- coverage behavior;
- privacy notes;
- hashes/signatures that are useful.

## Warning/error codes

List provider-owned stable codes only. Unknown upstream exceptions remain bounded observations.

## Events

List meaningful lifecycle events worth retaining. Do not log frame-by-frame noise.

## Comparison modes

For each controlled comparison:
- starting-state requirement;
- mutations/transitions;
- at-most-once/readback rules;
- snapshots retained;
- restoration contract;
- abort conditions.

If no comparison is safe/useful, say `none`.

## Cross-provider dependencies

Identify optional provider/context dependencies. Failure must degrade coverage, not block unrelated capture.

## Size budget

Set expected/soft limits and identify potentially large sections.

## Privacy exclusions

Provider-specific exclusions beyond General Capture.

## Pressure tests

List prior bugs/fixtures used to prove the provider captures reusable evidence. Do not encode the bug symptom into the schema.

## Acceptance

State what must be demonstrated before provider implementation is considered capture-ready.
