# Handoff — Witch Dock Dev Auto Host

**Branch:** `wd/dev-auto-host`  
**Status:** v0.2.0 immutable-head delivery candidate  
**Release task:** issue #28

## Architecture

`devtools/Witch_Dock_DEV_Auto_Host.user.js` is the separately installed Tampermonkey delivery host. On each HeroForge page load it resolves canonical `WITCH_DEV_MAIN` to its current commit SHA through GitHub's ref API, fetches the launcher by that immutable SHA, validates its userscript identity/version/branch/grant contract, and executes it once with synthetic payload-correct `GM_info`.

The direct Dev launcher remains the behavior/source contract. The auto-host provides only privileged delivery so normal Dev revisions can be applied by a Bridge-driven HeroForge reload rather than repeated direct launcher installation.

## v0.2.0 change

Issue #41 hardens the delivery seam after a live reload received stale mutable branch bytes even though `WITCH_DEV_MAIN` had already advanced.

v0.2.0 changes only the delivery lookup:
- host version -> 0.2.0;
- resolve `WITCH_DEV_MAIN` head through GitHub's ref API;
- fetch `Witch_Dock_DEV.user.js` by the resolved immutable SHA;
- report the resolved SHA/URL in diagnostics.

Launcher ownership, validation, retries, one-execution-per-page behavior, and rollback remain protected.

## Required live gate

Update/install v0.1.1 once with direct Dev disabled, then Bridge-reload and verify:
- auto-host v0.1.1;
- target branch `WITCH_DEV_MAIN`;
- payload launcher v1.5.1;
- launcher channel branch `WITCH_DEV_MAIN`;
- immutable payload `6603911658b426c6b95367697bedcc4c7acf67eb`;
- Core v2.0.0 running;
- Loader v0.2.0 23/23 / 0 failed;
- one Dock/compact/icon and normal geometry.

## Rollback

Disable auto-host and re-enable the direct Dev launcher. Do not mutate Stable as a rollback mechanism.
