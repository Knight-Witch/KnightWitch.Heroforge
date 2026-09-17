# Pre-Flight Check Log

This is the rolling current Dev pre-flight log for `WITCH_DEV_MAIN`. Older Stable/legacy records remain durable in Git history.

## PFC-2026-09-17-003 — Issue #10 contract freeze

Date: 2026-09-17

### Scope

Documentation-only Stage A for issue #10 on `wd/10-modular-bootstrap`: record the current monolithic core responsibilities and protected behavioral contracts before moving runtime ownership.

### Source evidence

Confirmed from the current Stable-derived `Witch_Dock.user.js` and v0.1.1 module-loader source:

- userscript privilege APIs and manifest/bootstrap delivery are embedded in the core;
- Dock state, persistence, CSS, UI construction, drag/resize/minimize/compact behavior, tab/tool/section registry, About/Disclaimer, undo/redo/hotkeys, and bone detection are embedded in the same core;
- active storage keys include `kw.witchDock.v1`, `kw.witchDock.toolEnabled.*`, and `kw.witchDock.sectionOrder.*`;
- public seams include `WitchDock.registerTool`, `WitchDock.ensureDock`, `WitchDock.downloadBlob`, and `KWWitchDockManifestURL`;
- the hidden v0.1.1 module loader preserves concurrent fetch with manifest-order execution and per-module failure isolation;
- public Stable is not modified during this architecture work.

### Acceptance

- Architecture baseline recorded in `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- No runtime source, manifest, version/build, storage key, cache key, module order, module URL, or public Stable file changed.
- Live runtime validation is not required for this documentation-only commit; live baseline/host validation is required before behavioral extraction.

**Runtime/module/manifest/public behavior changed:** no.

---

## PFC-2026-09-17-002 — Canonical Dev launcher/channel identity

Date: 2026-09-17

### Scope

Issue #19 only: establish an unmistakable installed Dev identity and route Dev manifest/module loading to `WITCH_DEV_MAIN`. Public Stable remains untouched.

### Static evidence

- `Witch_Dock_DEV.user.js` parses with `node --check`.
- Dev userscript `@name` is `WITCH DOCK - DEV v1.2.2`; `@version` is `1.2.2`; update/download URLs point to `WITCH_DEV_MAIN`.
- Dev launcher exposes `KWWitchDockDevChannel`, fetches the shared branch core, requires exactly one known Stable manifest declaration seam, replaces that declaration with the Dev manifest URL, and shows a visible bootstrap error instead of silently falling back if the seam/fetch fails.
- `manifest.json` parses successfully.
- Registry IDs are unique: 27 entries including `witch-dock-dev-launcher` v1.2.2.
- Runtime module IDs are unique: 23 modules plus one hidden bootstrap.
- Every manifest-loaded runtime URL points to `WITCH_DEV_MAIN`; none points to `Witch_Scripts`, `WITCH_DEV_UI`, or legacy `WITCH_DEV`.
- Existing shared `Witch_Dock.user.js` core source remains untouched at its Stable-derived 1.2.1 identity.
- `DEV_DIVERGENCES.json` records issue #19 and the two intentional Dev-only runtime paths.

### Required live gate

With public Stable disabled and `Witch_Dock_DEV.user.js` installed/enabled:

1. refresh HeroForge;
2. confirm Tampermonkey shows `WITCH DOCK - DEV v1.2.2`;
3. confirm the Dock title bar shows exactly `WITCH DOCK - DEV v1.2.2`;
4. confirm `KWWitchDockManifestURL` resolves to `WITCH_DEV_MAIN/manifest.json`;
5. confirm `KWModuleLoader` completes with the expected enabled module count and zero unexpected failures;
6. confirm representative module request URLs resolve to `WITCH_DEV_MAIN`;
7. confirm normal Dock tools/tabs appear and basic interaction is unchanged.

Do not close #19 until that live/human gate passes.

### Governance change

The project contract/workflow now states explicitly that a passing Stable smoke automatically triggers Dev janitorial reconciliation. No additional user approval is required to complete cleanup for the already-authorized promotion; this does not authorize unrelated Stable changes.

**Runtime/module/manifest/public behavior changed:** Dev runtime/manifest behavior changed; public Stable unchanged.

---

## PFC-2026-09-17-001 — New Dev governance baseline

Date: 2026-09-17

### Scope

Documentation/governance only. Establish `WITCH_DEV_MAIN` as the canonical Stable-derived development lane and encode the rules required to prevent unexplained drift and branch clutter.

### Baseline evidence

- `WITCH_DEV_MAIN` was created directly from `Witch_Scripts` commit `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.
- No legacy `WITCH_DEV_UI` or `WITCH_DEV` runtime code was merged.
- Initial `DEV_DIVERGENCES.json` contains zero runtime divergences.
- Legacy harvest is tracked separately in #12 before any old branch is retired.
- Branch retirement is deferred to #13 until New Dev validation and harvest are complete.
- Dev -> Stable cleanup requirements are tracked in #14 and mirrored in the project contract/workflow.

### Acceptance

This commit changes no userscript, feature/tool module, manifest entry, module version/build, cache key, or public Stable content. No live runtime test is required for this documentation-only baseline.

**Runtime/module/manifest/public behavior changed:** no.
