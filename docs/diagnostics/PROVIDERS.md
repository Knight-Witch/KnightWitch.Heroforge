# Diagnostic Provider Inventory

**Status:** Planning inventory for issue #88. This is not an implementation checklist.

| Provider ID | Design status | Primary evidence surface | Modes | Spec |
|---|---|---|---|---|
| `texture-quality` | v1 design drafted; existing reference runtime | figures/parts, paints, atlas, AAID/masks/resources, materials, color-bake, HR lifecycle | snapshot, comparison, failure | `providers/TEXTURE_QUALITY.md` |
| `booth` | v1 design drafted | Booth state/readiness, native bootstrap, settings, presentation, media capture integration | snapshot, failure | `providers/BOOTH.md` |
| `decals` | v1 design drafted | slot/order/model state, rendered bindings, Project/bound transforms, gizmo/preservation, expanded slots | snapshot, failure | `providers/DECALS.md` |
| `body-editor` | v1 design drafted | arm sync, breast/butt mirror transform subsets, adjunct hand/slider state, undo/commit | snapshot, failure | `providers/BODY_EDITOR.md` |
| `pose` | v1 design drafted; current scope is Main/Extra swap | figure-role structure, pinned Main invariants, undo/commit | snapshot, failure | `providers/POSE.md` |
| `json` | v1 design drafted | bulk backup workflow/progress/failure classes/archive result with strict redaction | snapshot, failure | `providers/JSON.md` |
| `rendering-performance` | v1 design drafted | frame timing, long tasks, JS heap where exposed, renderer counters, bounded scene complexity, active work | snapshot, performance | `providers/RENDERING_PERFORMANCE.md` |
| `core-runtime` | v1 design drafted; optional deep runtime provider | channel/bootstrap/module loader/registry timeline plus explicit bounded request/toast failure watch | snapshot, failure | `providers/CORE_RUNTIME.md` |
| `bone-hud` | v1 design drafted | bone-selection source, detector lifecycle, candidate/baseline health, detection/failure context | snapshot, failure | `providers/BONE_HUD.md` |

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


## Default provider selection

General Capture is always present. Providers are additive and should be selected from the report feature/symptom, not all executed blindly.

| Report scope | Default provider(s) |
|---|---|
| Unknown / generic Witch Dock bug | General only; add `core-runtime` if General shows startup/module failure |
| High Res / Texture Quality | `texture-quality` |
| Booth / Black Canvas / Booth media readiness | `booth` |
| Decals / projected or bound gizmo | `decals` |
| Body Editor | `body-editor` |
| Current Pose Main/Extra swap | `pose` |
| JSON bulk backup | `json` |
| Bone HUD / bone detection | `bone-hud` |
| Lag / stutter / progressive slowdown | `rendering-performance` |
| Startup / update / module load / repeated connection failure | `core-runtime` |

Cross-feature symptoms may include more than one provider, but triage should request extra providers because the evidence crosses boundaries—not because more data is automatically better.

### Heavy/armed modes

These are never automatic during an ordinary snapshot:
- Texture Quality controlled comparison;
- Rendering Performance timed sample;
- Core Runtime failure watch.

The user/developer explicitly starts them because they either mutate provider state (comparison) or temporarily add instrumentation/sampling.


## Deliberately no dedicated provider in v1

The provider audit does **not** assign one provider per module/tab.

These surfaces are adequately represented elsewhere until real bugs prove a reusable missing evidence boundary:

- Witch Dock Notifications / Release Notices — General + `core-runtime` module/registry/errors are sufficient; UI-specific visual issues still use screenshots/human gate.
- Developer Mode — module identity/state belongs to General/Core Runtime; no separate diagnostic state machine currently justifies a provider.
- UI scroll guards / slot bridge plumbing — Core Runtime covers module load; feature-specific state is owned by the affected provider (for example Decals owns Expanded Decal Slots readiness).
- Utilities — current actions are small independent utilities; use General/Core Runtime unless a specific utility develops a reusable diagnostic boundary.
- Photo Booth TRUE-resolution / Spinny — operational state is grouped under `booth` because their current capability depends on Booth runtime; detailed timing pressure belongs to `rendering-performance`.

A new provider should be added only when repeated investigation shows a coherent state owner that General/current providers cannot represent cleanly.


## Design-freeze coverage check

Current v1 coverage is intentionally organized around **state ownership**, not one provider per visible tool.

The inventory now covers:
- generic runtime/environment;
- startup/module/update/network-failure reproduction;
- rendering performance;
- High Res/Texture Quality;
- Booth and Booth-dependent media;
- Decals;
- Body Editor;
- current Pose/Main-Extra swap;
- JSON bulk backup;
- Bone HUD detection.

Known current gaps are **implementation seams**, not missing provider architecture:
- several tools need bounded read-only `getDiagnosticState()`-style seams;
- retained pre-cleanup failure/action rings need to be added where current runtime discards context;
- Core Runtime failure watch needs safe live validation before adoption;
- performance sampling needs overhead validation;
- provider schemas may gain additive fields from real triage capture-gap feedback.

Do not add another v1 provider without evidence that a coherent state owner is not represented by General or the current provider set.
