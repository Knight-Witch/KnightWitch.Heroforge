# Witch Dock Master

This is a compact repository index. Current task state belongs in `ACTIVE_CONTEXT.md`; detailed investigations belong in targeted `HISTORY/` files or Git history.

## Branches

- Dev / integration: `WITCH_DEV_UI`
- Public Stable: `Witch_Scripts`
- Current accepted public Texture Quality release: Stable commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`
- HF-Chat-Bridge: private development control plane only; never a runtime dependency
- HeroForge.Compatibility: upstream engine investigation/reconstruction source, consulted only when needed

## Runtime architecture

Witch Dock is a manifest-driven userscript shell plus independently versioned modules.

- `manifest.json.moduleRegistry` is the canonical active-module/version registry.
- `Witch_Dock_DEV.user.js` loads Dev integration modules from `WITCH_DEV_UI` where required.
- `Witch_Dock.user.js` is the public Stable shell on `Witch_Scripts`.
- Public delivery is cache-keyed by manifest/module identity.
- Service/UI splits are preferred for substantial features when they improve failure isolation and diagnostics.
- Stable promotions are narrow and should preserve unrelated module blobs.

See `MODULE_VERSIONING.md` for the versioning contract and `PROJECT_CONTRACT.md` for development/release rules.

## Current validated feature set — high level

The exact active registry is authoritative; this is only a navigation summary.

- Booth v27.0.4 with Black Canvas replay v0.1.5 and Booth runtime bootstrap v0.1.1.
- Booth duplicate-runtime repair prevents Witch Dock/HeroForge from loading competing `/gated/booth.js` runtimes.
- TRUE high-resolution still capture service/UI is public and validated.
- Spinny Mini WebP service/UI is public; performance optimization is a separate concern from correctness.
- Corrected Bound Decal Gizmo v1.1.1 is public and validated for the repaired fresh Project-OFF initializer plus existing move/rotate/scale undo/state behavior.
- Texture Quality Native Reconcile v0.1.0 is public and validated on Blood Moon and D4, including Stable Blood Moon runtime + visual acceptance.
- JSON, Body, Pose, Decals, Utilities, Developer Mode, and HeroForge UI helper modules remain independently versioned in the manifest.

For current task-specific status, read `ACTIVE_CONTEXT.md` instead of expanding this file.

## Texture Quality architecture boundary

Public Texture Quality keeps HeroForge's native atlas/generation ownership. It applies source policy (`atlasScale=4`, `bakeSize=2048`, 1024 minimum used-size seed), pins real exact 1024 body color-bake masks, adopts expected native replacement generations, and accepts native allocation/source promotion through 2048.

Do not reintroduce persistent custom atlas ownership, giant atlas forcing, custom `CK.Atlas`, `buildAtlas` replacement, direct atlas assignment, or stale cross-figure snapshots.

Detailed current record: `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md`.

## Documentation map

Startup for material work:

1. `PROJECT_CONTRACT.md`
2. `ACTIVE_CONTEXT.md`
3. only files routed by the active context

Other files:

- `MODULE_VERSIONING.md` — canonical versioning rules.
- `CHANGELOG.md` — rolling recent committed changes; older entries in Git history.
- `PRE_FLIGHT_Check.md` — rolling recent preflight/validation records; older entries in Git history.
- `STYLE_KEYS.md` — shared UI styling references; read only for UI/styling tasks.
- `HISTORY/BULLSHIT/*` — detailed feature/engine records, loaded only when relevant.
- `HISTORY/DECISIONS.md`, `HISTORY/SESSION_LOG.md`, `HISTORY/STANDALONE_REFERENCES.md` — historical/reference material, not startup context.
- `CHATGPT_PROJECT_INSTRUCTIONS.md` — paste-ready compact ChatGPT Project rules matching this governance model.

## Working principle

Keep current truth easy to retrieve without dragging old investigations into every chat. Diagnose with GitHub + HF-Chat-Bridge, test in Dev, require human visual validation when appearance matters, promote narrowly to Stable, and persist only the conclusions future work actually needs.