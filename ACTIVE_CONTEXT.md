# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-16
**Current task:** Continue diagnosis of issue #7, the intermittent grey `Loading failed: connection error` toast. The prior upstream-only closeout was premature and #7 is reopened.
**Protected public state:** `Witch_Scripts` remains live and closed at Stable head `acaf18a0cfd2c751886e85a269b9427ddfaa5040`. Do not change Stable unless a new Dev fix passes its own gate and Amanda explicitly approves another narrow promotion.
**Bridge status:** HF-Chat-Bridge main userscript v0.3.2 is installed/live-validated; relay v0.2.2 and Power v0.1.0 unchanged.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. GitHub issue `#7` for the active network-load bug;
4. GitHub backlog issue `#8` for wider agenda/status;
5. only source/runtime surfaces directly required by #7 diagnosis;
6. `MODULE_VERSIONING.md` only if a runtime fix becomes necessary;
7. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not preload unrelated history. Do not consult HeroForge.Compatibility unless #7 reaches an unresolved HeroForge engine seam.

## Active bug — #7 connection-error toast

Confirmed user-visible behavior:

- transient grey popup reads `Loading failed: connection error`;
- reproduces repeatedly during ordinary HeroForge/Witch Dock interaction;
- exact reported text is absent from current Witch Dock source;
- Witch Dock's own module-loader fetch failures are silently caught and do not render this toast;
- Hero Forge documents a native part-load network-error/retry mechanism, but that is only a plausible ownership hypothesis until the actual failing request/emitter is captured.

The first 30-second trace was too broad: normal DOM text-node churn saturated the retained hook results and later network/error evidence was truncated. Do not use that trace as proof of the emitter.

### Immediate diagnostic sequence

1. Use a low-noise capture focused on failed network requests and transient notification insertion.
2. Reproduce the popup under that bounded capture and correlate timestamp, request URL/status, and notification path.
3. Determine whether the failure is upstream-only or whether a Witch Dock module materially causes/increases it.
4. Do not suppress the warning cosmetically. Do not edit runtime code until the failing request/call path is isolated.
5. Any fix stays in `WITCH_DEV_UI`, preserves optional-feature isolation, and receives the narrowest live regression before any Stable promotion discussion.

## Deferred JSON note — do not resume yet

The brief JSON detour established useful status but is not next in the agenda.

- `tools/JSON_Tool.js` is `Backup My Library (Bulk JSON)`; it has no character-import/restore implementation.
- Current Dev `json-tool` v1.0.0 registered cleanly.
- Live smoke indexed 1,890 configs, loaded 35 folder marks, and downloaded at least 650 individual config JSONs without reported failures before being manually paused.
- Pause/resume worked.
- Full ZIP completion was intentionally not awaited. If a separate historical character-level JSON import/export feature is meant later, identify that exact surface first.

Amanda has additional bugs to add before JSON work resumes. Do not infer their priority/order until she adds them.

## Recently closed — Texture Quality

The promoted Texture Quality lifecycle/projected-host patch remains PASS/CLOSED after the full post-promotion regression matrix. Broader Enhanced Object Textures remains a separate future feature track.
