# Diagnostic Provider Inventory

**Status:** Planning inventory for issue #88. This is not an implementation checklist.

| Provider ID | Design status | Primary evidence surface | Modes | Spec |
|---|---|---|---|---|
| `texture-quality` | v1 design drafted; existing reference runtime | figures/parts, paints, atlas, AAID/masks/resources, materials, color-bake, HR lifecycle | snapshot, comparison, failure | `providers/TEXTURE_QUALITY.md` |
| `booth` | v1 design drafted | Booth state/readiness, native bootstrap, settings, presentation, media capture integration | snapshot, failure | `providers/BOOTH.md` |
| `decals` | next design target | active decal slots, bindings, projected hosts, gizmo/slot state, relevant material/decal resources | snapshot, failure | pending |
| `body-editor` | planned | active body controls/targets, source/derived body state, relevant update lifecycle | snapshot, failure | pending |
| `pose` | planned | selected bones/joints, pose state, constraints/ownership, relevant update lifecycle | snapshot, failure | pending |
| `json` | planned | JSON tool mode/import/export state and safe validation metadata; not raw character JSON by default | snapshot, failure | pending |
| `rendering-performance` | later | frame timing, renderer stats, canvas/DPR, bounded long-task/performance context | snapshot, performance | pending |
| `core-runtime` | evaluate after General v1 | module loader/startup/readiness failures beyond the common package | snapshot, failure | pending |

## Provider Design Rule

Add providers because they reduce real diagnostic/reproduction cost, not to make every Witch Dock tab symmetrical.

Before implementing a provider:
1. identify recurring failure surfaces;
2. inspect current tool/runtime ownership;
3. define immediate volatile-state freeze needs;
4. define bounded sections;
5. define retained pre-cleanup failure evidence if needed;
6. define what is unavailable without mutation;
7. define privacy exclusions;
8. determine whether snapshot alone is sufficient;
9. add comparison only when there is a real safe controlled transition.

Use `providers/PROVIDER_TEMPLATE.md`.

## Cross-provider reports

The primary report feature selects the default provider. Additional providers may be included when a failure crosses boundaries.

Examples:
- Decal + High Res interaction: general + `decals` + `texture-quality`;
- Booth rendering failure under load: general + `booth` + `rendering-performance`.

Do not execute all providers for every report.

## Design validation cases

Provider/core design should be pressure-tested against prior resolved or well-bounded failures before implementation:

| Issue | What the architecture should have made cheap to retrieve |
|---|---|
| #24 — HR ON/OFF body visual paint tint change | restore lifecycle state, color-bake state, before/after verification, exact coverage |
| #32 — HR body paint zone collapse | paint intent, atlas/material/resource/AAID/mask state, stable OFF/ON section comparison |
| #34 — HR false restore warning | bounded pre-failure verifier inputs and transient state before cleanup destroys it |

The goal is not to encode these bugs into the provider. The goal is to prove the provider surfaces are broad enough that future bugs in the same subsystem do not require rebuilding the same probes.
