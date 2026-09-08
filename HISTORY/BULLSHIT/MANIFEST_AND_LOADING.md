# Manifest and Loading

Witch Dock manifest loading, module boot order, raw GitHub loading, and runtime registration behavior.

## Known Rules

- `Witch_Scripts` is the live branch used by install/update URLs and manifest raw URLs.
- `Witch_Dock.user.js` is the public Tampermonkey install script.
- `manifest.json` is the live module inventory.
- Visible tools load through `manifest.json` from `/tools/`.
- Hidden HeroForge UI utilities load through `manifest.json` from `/HeroForge_UI/`.
- Update `manifest.json` only when adding, removing, renaming, or changing live-loaded modules.
- Preserve module registration timing and retry loops unless a tested replacement exists.
- Working standalone Tampermonkey probes remain canonical until migrated and confirmed.

## Current Load Chain

1. Tampermonkey loads `Witch_Dock.user.js`.
2. `Witch_Dock.user.js` fetches `manifest.json` from the `Witch_Scripts` raw GitHub URL.
3. The manifest `tools` array is parsed.
4. Each enabled manifest entry is fetched from its raw GitHub URL.
5. The fetched module executes in the Witch Dock runtime context.
6. Visible tools register into the dock through `window.WitchDock.registerTool`.
7. Hidden HeroForge UI utilities patch or monitor HeroForge behavior without registering visible tabs.

## Current Manifest Entries

| ID | File | Visible? | Default | Type / Tab | Notes |
|---|---|---|---|---|---|
| `expanded-ui-scroll-guards` | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Hidden | Enabled | `heroForgeUI` | Scoped Decals source/slot scroll guard. |
| `hf-ui-scroll-split-safe` | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Hidden | Enabled | `heroForgeUI` | Split-layout scroll override. |
| `hf-ui-slot-bridge` | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Hidden | Enabled | `heroForgeUI` | Conditional loader for expanded decal slot module. |
| `body-editor` | `tools/Body_Editor.js` | Visible | Enabled | Body | Body Editor tab. |
| `pose-tool` | `tools/Pose.js` | Visible | Enabled | Pose | Pose tab. |
| `booth-tool` | `tools/Booth.js` | Visible | Enabled | Booth | Booth tab. |
| `json-tool` | `tools/JSON_Tool.js` | Visible | Enabled | JSON | JSON tab. |
| `utilities` | `tools/Utilities.js` | Visible | Enabled | Utilities | User-facing controls for optional utilities. |

## Storage / Enablement

- Tool enablement uses the `kw.witchDock.toolEnabled.` prefix.
- Dock UI preferences use `kw.witchDock.v1`.
- Utilities may mirror enablement through localStorage and GM storage for compatibility.
- If a hidden utility mutates HeroForge data, disabling it may require a refresh to fully unload.

## Findings

### Manifest Raw URLs Define the Live Branch

Context:
- The public install script and manifest entries use raw GitHub URLs pointing to `Witch_Scripts`.

Observed behavior:
- Any file loaded by manifest must exist on `Witch_Scripts` at the referenced path.
- Updating `main` alone will not update live Witch Dock users.

Working approach:
- Make release edits on `Witch_Scripts` unless intentionally changing branch strategy.
- Keep `README.md`, `Witch_Dock.user.js`, and `manifest.json` branch references consistent.

Affected tools:
- `Witch_Dock.user.js`
- `manifest.json`
- all manifest-loaded modules

### Hidden Utilities Are Still Live Modules

Context:
- HeroForge UI utilities use `hidden: true` and `type: "heroForgeUI"`.

Observed behavior:
- Hidden utilities do not create visible dock tabs, but they still load and can affect runtime behavior.

Working approach:
- Treat hidden utilities as production code.
- Document their toggles, runtime side effects, and refresh requirements.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`
- `HeroForge_UI/HF_UI_Slot_Bridge.js`
- `HeroForge_UI/Expanded_Decal_Slots.js`
- `tools/Utilities.js`

## Entry Template

### Finding Title

Context:
- 

Observed behavior:
- 

Working approach:
- 

Affected tools:
-

## 2026-09-07 Public cache-keyed loader repair

A live public page remained on an older branch-based raw GitHub manifest/module body even after the repository had advanced; hard refresh then obtained the current files. `Cache-Control: no-cache` on `GM_xmlhttpRequest` was therefore insufficient as the sole delivery strategy.

Public shell v1.2.1 ports the validated Dev cache-key design:

- every page load requests `manifest.json` with a unique `kwcache` session key;
- each module request receives a deterministic `kwcache` key derived from its manifest registry ID/version/build/path plus raw URL;
- existing query parameters are preserved;
- module execution order, enablement, and failure isolation remain unchanged;
- the manifest registry is now part of delivery identity, so a module version/build change changes its request URL automatically.

This fixes delivery freshness without introducing an external runtime service or changing the `Witch_Scripts` branch contract.
