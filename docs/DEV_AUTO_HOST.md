# Witch Dock Dev Auto Host

**Status:** canonical Dev delivery helper on `wd/dev-auto-host`; v0.2.0 live gate pending.  
**Payload:** current `WITCH_DEV_MAIN/Witch_Dock_DEV.user.js`, resolved by immutable branch-head SHA.  
**Purpose:** let Dev reloads execute the current canonical launcher without waiting on Tampermonkey's scheduled update cycle or mutable raw-branch propagation.

## Operating model

`devtools/Witch_Dock_DEV_Auto_Host.user.js` is installed once in Tampermonkey. On every HeroForge page load it first resolves the current `WITCH_DEV_MAIN` head through GitHub's ref API, then fetches the Dev launcher from that immutable commit SHA, validates its identity, version, branch, grants, and connection scope, and executes it inside the userscript sandbox with the same bounded Tampermonkey capabilities.

The fetched launcher remains authoritative for its own version and visible Dock title. The host supplies a synthetic `GM_info.script` matching the fetched launcher's metadata so About/diagnostics do not report the host's version as the Dock version.

After a future Dev commit, the Bridge can reload the HeroForge tab. That reload fetches and runs the new launcher immediately; Amanda does not need to open Tampermonkey or wait for its scheduled update interval. The host does not poll or reload on its own, so a push cannot interrupt an in-progress mutation or human visual gate.

## One-time switch

1. Install `devtools/Witch_Dock_DEV_Auto_Host.user.js` from its raw branch URL.
2. Disable the directly installed `WITCH DOCK - DEV` script. Leave public Stable disabled during Dev validation as before.
3. Reload HeroForge once.
4. Verify `KWWitchDockDevAutoHost.getState()` reports `launcher-executed` with the expected payload version, then run the normal launcher/Dock/loader live checks.

The host deliberately fails with a visible error if the direct Dev launcher is also active. Rollback is immediate: disable the auto host, re-enable the direct Dev launcher, and reload.

## Safety boundary

- Only the fixed `Knight-Witch/KnightWitch.Heroforge` repository and canonical `WITCH_DEV_MAIN` ref are resolved.
- Branch freshness is resolved through `api.github.com` first; launcher bytes are then fetched by immutable commit SHA from `raw.githubusercontent.com`.
- Every request uses a fresh cache key and `Cache-Control: no-cache`.
- Fetch retry is bounded to three attempts; execution occurs at most once per page load.
- The fetched source must remain `WITCH DOCK - DEV` / `KnightWitch`, have synchronized metadata/runtime versions, declare the expected branch, request only the host's known grants, and keep its launcher connection scope within the validated contract.
- New Tampermonkey permissions, `@require`, `@resource`, branch migration, or host-boundary changes fail visibly and require a deliberate host update/live gate.
- Normal launcher, core, module, timing, storage, UI, and rollback behavior remain owned by the fetched source. This candidate changes delivery only.
- Human gates remain required for visual correctness. Route/runtime success does not certify pixels.

## Diagnostics

`unsafeWindow.KWWitchDockDevAutoHost.getState()` returns the host version, target branch/ref URL, resolved head SHA, immutable launcher URL, payload version, status, fetch attempts, timestamps, and bounded error text. Normal launcher diagnostics remain unchanged under `KWWitchDockDevChannel` and the existing module/runtime globals.
