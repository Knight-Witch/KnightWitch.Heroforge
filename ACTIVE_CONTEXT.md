# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-16
**Current task:** Diagnose issue #7, the intermittent grey `Loading failed: connection error` toast. The prior Texture Quality regression matrix is CLOSED/PASS and the mandatory HF-Chat-Bridge ergonomics gate is COMPLETE.
**Protected public state:** `Witch_Scripts` remains live and closed at Stable head `acaf18a0cfd2c751886e85a269b9427ddfaa5040`. Do not change Stable unless a new Dev fix passes its own gate and Amanda explicitly approves another narrow promotion.
**Bridge status:** HF-Chat-Bridge main userscript v0.3.2 is installed/live-validated; relay v0.2.2 and Power v0.1.0 unchanged. Direct trusted named-path calls and same-request result handles are available; issue `HF-Chat-Bridge#2580` is CLOSED.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. GitHub issue `#7` for the active bug;
4. GitHub backlog issue `#8` only for broader agenda/status;
5. `MODULE_VERSIONING.md` only before a runtime/version change;
6. only source files directly required by the diagnosis/fix;
7. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not preload unrelated history. Do not consult HeroForge.Compatibility unless this diagnosis reaches an unresolved engine seam.

## Active bug — #7 connection-error toast

Confirmed user-visible behavior:

- transient grey container/toast reads `Loading failed: connection error`;
- occurs repeatedly during ordinary HeroForge/Witch Dock clicking/navigation;
- observed on both public Stable and current development use;
- no obvious functional failure is yet tied to it.

Unknowns to resolve before editing:

- exact emitter/module/request;
- whether the message originates in Witch Dock, HeroForge, or an optional network-backed feature;
- trigger/call path and retry behavior;
- whether the failed operation is harmless/noisy or causes a hidden functional failure.

### Immediate diagnostic sequence

1. Search the current Witch Dock source for the exact/partial message and generic loading-error/toast surfaces.
2. Use HF-Chat-Bridge v0.3.2 to inspect current DOM/runtime notification surfaces and identify likely emitters without requiring Amanda to capture the transient toast.
3. If static source does not identify it, use bounded runtime/network/event tracing around normal UI interaction.
4. Do not edit runtime code until the emitter and failure path are confirmed or strongly isolated.
5. Any fix stays in `WITCH_DEV_UI`, preserves optional-feature isolation, then receives the narrowest live regression before any explicit Stable promotion discussion.

## Recently closed — Texture Quality

The already-promoted Texture Quality lifecycle/projected-host patch passed the full post-promotion matrix with no additional runtime fix required: 2/3 figure lifecycle, real kitbash downgrade/recovery, add/remove, deliberate figure switching, persistent canvas round-trip, projected-host isolation, and a no-projected-host control all passed. The prior muddy/green artifact remains closed absent fresh reproduction.

Broader Enhanced Object Textures remains separate future work; it is not unfinished work on the closed lifecycle patch.

## Agenda after #7

The durable broader backlog remains issue `#8`. Historical JSON import/export, Photo Booth settings import/export, 4K/8K capture, and minimized-launcher UX are status re-checks rather than confirmed current bugs. Deferred feature work includes Enhanced Object Textures, Spin/WebP quality controls, in-app bug reporting, and the separate Extra Characters revamp.
