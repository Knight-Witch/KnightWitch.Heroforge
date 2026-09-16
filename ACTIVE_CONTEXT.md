# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-16
**Current task:** Re-test the historical JSON character import/export breakage on current HeroForge/Witch Dock before deciding whether any fix is still required.
**Protected public state:** `Witch_Scripts` remains live and closed at Stable head `acaf18a0cfd2c751886e85a269b9427ddfaa5040`. Do not change Stable unless a new Dev fix passes its own gate and Amanda explicitly approves another narrow promotion.
**Bridge status:** HF-Chat-Bridge main userscript v0.3.2 is installed/live-validated; relay v0.2.2 and Power v0.1.0 unchanged.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `tools/JSON_Tool.js` and only directly connected runtime seams needed for the re-test;
4. GitHub backlog issue `#8` for agenda/status;
5. `MODULE_VERSIONING.md` only if a runtime fix becomes necessary;
6. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not preload unrelated history. Do not consult HeroForge.Compatibility unless the re-test reaches an unresolved HeroForge engine seam.

## Active status re-check — JSON character import/export

Historical report: Witch Dock JSON character import/export broke after HeroForge UI/runtime changes. This is not yet treated as a present-day bug.

### Immediate diagnostic sequence

1. Inspect the current JSON tool source and identify its export/import runtime contracts.
2. Verify those named/runtime dependencies still exist on current HeroForge `heroforge07.1.10.2`.
3. Exercise the narrowest safe export path first and compare output structure with current live character state.
4. Exercise import only with a reversible/snapshot-backed test; mutation-capable Bridge work remains at-most-once.
5. If the historical breakage no longer reproduces, close the re-check with no runtime edit. If it does reproduce, diagnose the exact stale seam before editing.

## Resolved immediately before this task — issue #7

The transient `Loading failed: connection error` toast is closed as upstream/not a confirmed Witch Dock-owned defect. Witch Dock source contains no matching emitter and its own module-fetch failures are silently caught. Hero Forge's official release notes document a native part-load network-error popup plus automatic retry on later changes, matching the observed transient/self-recovering behavior. Reopen #7 only if a controlled vanilla-vs-Witch-Dock comparison proves a specific Dock module materially causes or increases those native failures.

## Recently closed — Texture Quality

The promoted Texture Quality lifecycle/projected-host patch remains PASS/CLOSED after the full post-promotion regression matrix. Broader Enhanced Object Textures remains a separate future feature track.

## Agenda after JSON re-check

Backlog issue `#8` remains the durable agenda. Next historical re-checks are Photo Booth settings import/export, 4K/8K capture, and minimized-launcher UX. Deferred work includes Enhanced Object Textures, Spin/WebP quality controls, in-app bug reporting, and the separate Extra Characters revamp.
