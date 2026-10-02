# Handoff — Witch Dock Dev Auto Host

**Branch:** `wd/dev-auto-host`  
**Status:** v0.2.2 custom-domain permission alignment  
**Maintenance task:** issue #41

## Architecture

`devtools/Witch_Dock_DEV_Auto_Host.user.js` is the separately installed Tampermonkey delivery host. On each HeroForge page load it resolves canonical `WITCH_DEV_MAIN` to its current commit SHA through GitHub's ref API, fetches the launcher by that immutable SHA, validates its userscript identity/version/branch/grant contract, and executes it once with synthetic payload-correct `GM_info`.

The direct Dev launcher remains the behavior/source contract. The auto-host provides only privileged delivery so normal Dev revisions can be applied by a Bridge-driven HeroForge reload rather than repeated direct launcher installation.

## v0.2.2 change

Issues #90/#97 move canonical Dev payload delivery and HF.Status transport to provider-independent custom domains.

v0.2.2 changes only the validated permission boundary:
- host version -> 0.2.2;
- preserve immutable GitHub branch-head resolution for this development-only helper;
- permit launcher `@connect` only for `witchdock.knightwitch.dev` and `status-dev.knightwitch.dev`;
- reject the retired workers.dev launcher host.

Launcher ownership, validation, retries, one-execution-per-page behavior, and rollback remain protected.

## Required live gate

Update/install v0.2.2 once with direct Dev disabled, then reload through the Bridge and verify:
- auto-host v0.2.2;
- target branch `WITCH_DEV_MAIN`;
- `resolvedHeadSha` equals the current canonical Dev head;
- `resolvedTargetUrl` uses that immutable SHA;
- current canonical Dev launcher/version executes;
- launcher channel remains `WITCH_DEV_MAIN`;
- loader completes with zero failures/fallback;
- one Dock/compact/icon and normal geometry.

Then publish one bounded canonical Dev launcher bump and reload again without touching Tampermonkey; the auto-host must resolve and execute the newer branch head automatically.

## Rollback

Disable auto-host and re-enable the direct Dev launcher. Do not mutate Stable as a rollback mechanism.
