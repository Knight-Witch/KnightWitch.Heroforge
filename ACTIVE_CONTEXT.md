# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-17  
**Current task:** Issue #10 — replace the legacy monolithic `Witch_Dock_DEV.user.js` development foundation with a modular Dev shell/bootstrap architecture.  
**Protected public state:** `Witch_Scripts` is live at Stable head `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`. Issue #9 was promoted and passed its public smoke. Do not change Stable during issue #10 unless Amanda later authorizes a separate narrow promotion.  
**Current Tampermonkey state:** Stable is enabled; `Witch Dock DEV - Spinny Integration` is disabled after the public smoke.  
**Bridge status:** HF-Chat-Bridge main userscript v0.3.2 is healthy; use it autonomously for runtime reads/probes once Dev is re-enabled for testing.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. GitHub issue `#10`;
4. `Witch_Dock_DEV.user.js`;
5. `manifest.json`;
6. `features/core/Witch_Dock_DEV_Module_Loader.js`;
7. `MODULE_VERSIONING.md`;
8. directly related core files only as discovered during architecture inspection;
9. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not preload `MASTER.md`, old changelogs/preflight history, session logs, unrelated `HISTORY/BULLSHIT/*`, or HeroForge.Compatibility unless source/runtime evidence makes one specifically necessary.

## Completed milestone — issue #9 slow module loading

Issue #9 is **PASS / CLOSED**.

Confirmed outcome:
- The legacy manifest loader multiplied per-request delay because it awaited module network requests strictly serially.
- Dev now uses `witch-dock-dev-module-loader` v0.1.1 / build `0.1.1-page-fetch-ordered-exec`.
- Dev module requests start concurrently but execute in original manifest order, preserving deterministic cache keys and per-module failure isolation.
- Live Dev gate in the already-degraded Chrome session: 23/23 started, 23/23 fetched, 23/23 executed, 0 failures, total loader duration **432.8 ms**.
- Amanda visually confirmed the Dock finished noticeably faster.
- Stable promotion commit `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4` passed: 23/23 fetched/executed, 0 failures, **451.4 ms** total, Stable manifest provenance confirmed.

Important architectural fact exposed by issue #9: `Witch_Dock_DEV.user.js` is still the outer Tampermonkey userscript and still owns a large amount of Dock/core behavior. The v0.1.1 bootstrap solved module-fetch scheduling but did **not** modernize the monolithic Dev shell itself.

## Active architecture task — issue #10

Amanda explicitly wants to change gears and stop operating Dev from the old monolithic script.

Goal: retire `Witch_Dock_DEV.user.js` as the long-term development foundation and replace it with a bounded modular shell/bootstrap while preserving current working behavior.

Start with diagnosis/inventory, not a blind rewrite. Determine exactly what the monolith still owns, including at minimum:
- userscript metadata/grants and privileged APIs;
- Dock shell/UI construction and styling;
- persistence/storage keys;
- `WitchDock` registration/public API contracts;
- manifest/bootstrap orchestration;
- cache-key behavior;
- download helpers;
- undo/redo and hotkeys;
- compact/minimized/drag/resize behavior;
- shared UI helpers and any other responsibilities discovered in source.

Then identify which responsibilities already have modular equivalents and which need extraction. Prefer bounded seams and staged replacement over a big-bang rewrite.

### Protected behavior/contracts

Preserve unless testing proves a change safe:
- current Dock appearance and interaction behavior;
- current storage keys and user preferences;
- tool registration and module contracts;
- module execution order;
- deterministic cache keys;
- module enablement behavior;
- optional-feature failure isolation;
- validated parallel-fetch performance;
- existing feature-module readiness, polling, retries, ownership, snapshots, and rollback behavior.

HF-Chat-Bridge remains development infrastructure only and must never become a Witch Dock runtime dependency.

### Immediate next sequence

1. Read issue #10 and inspect `Witch_Dock_DEV.user.js`, `manifest.json`, and the current Dev module loader.
2. Produce a responsibility/seam map of the monolith before editing.
3. Identify the smallest viable modular Dev entrypoint and migration order.
4. Decide which code can be extracted byte-for-byte first versus which requires an adapter/interface.
5. Implement on `WITCH_DEV_UI` only, with required version/build/log updates.
6. Static-check the candidate, then re-enable Dev for live Bridge validation and human visual gate where relevant.
7. Do not promote any architecture change to Stable without a later explicit narrow approval.

## Deprioritized bug — #7 connection-error toast

Issue #7 remains open but is intentionally deprioritized while issue #10 is active. Resume it only when Amanda changes priority.
