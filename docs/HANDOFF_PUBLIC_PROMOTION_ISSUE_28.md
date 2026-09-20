# Handoff — Issue #28 Public Modular Promotion

**Updated:** 2026-09-20  
**Active issue:** #28 — Promote modular Witch Dock architecture to public Stable  
**Canonical Dev:** `WITCH_DEV_MAIN` @ `fa92b0c9f777479dbf679e1c3b534f26e88ce5c6`  
**Public Stable:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4` — untouched  
**Public RC:** `wd/28-public-rc` @ `95b5cdae4c8840d950d984c73bce101ba887011e`  
**Public payload:** `wd/28-public-payload-2.0.0` @ `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`

## Completed

- Issue #10 is complete/closed.
- Validated modular architecture: Core v2.0.0, Loader v0.2.0, 23/23 runtime modules, 0 failures, human visual PASS.
- Canonical Dev reconciliation is complete.
- Dev Auto Host v0.1.1 is installed and now targets `WITCH_DEV_MAIN`.
- Canonical Dev live smoke PASS:
  - launcher v1.5.1 / build `1.5.1-canonical-dev-reconcile`;
  - branch `WITCH_DEV_MAIN`;
  - payload `6603911658b426c6b95367697bedcc4c7acf67eb`;
  - Core v2.0.0 running;
  - Loader v0.2.0 23/23 / 0 failed;
  - immutable resolution=23 / fallback=0;
  - legacy monolith/source-transform path false;
  - one Dock/compact/icon.
- Current Stable rollback is preserved at exact SHA `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4` and archive branch `archive/Witch_Scripts-pre-modular-20260920`.
- Public immutable payload candidate exists at `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`.
- Public RC exists at `95b5cdae4c8840d950d984c73bce101ba887011e`, based on the exact Stable baseline.

## RC composition

The RC changes only the public launcher/manifest plus the validated #10 architecture files required for modular delivery.

Public launcher:
- userscript name `Witch Dock v2.0.0`;
- `@version 2.0.0`;
- update/download URLs remain `Witch_Scripts/Witch_Dock.user.js`;
- visible Dock title remains `WITCH DOCK`;
- channel is `stable`;
- immutable payload pinned to `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`;
- no Dev/task-branch identifiers.

Public payload/manifest:
- public `witch-dock-launcher` v2.0.0;
- Core v2.0.0;
- Loader v0.2.0;
- 23 runtime modules;
- public `Witch_Scripts` fallback URLs;
- no `WITCH_DEV_MAIN`, `wd/10-modular-bootstrap`, or legacy Dev routing.
- runtime/core/module source bytes are the validated canonical Dev bytes.

RC runtime files promoted from validated Dev:
- `features/core/Witch_Dock_Application.js`
- `features/core/Witch_Dock_Assets.js`
- `features/core/Witch_Dock_Bone_HUD.js`
- `features/core/Witch_Dock_Core.js`
- `features/core/Witch_Dock_History.js`
- `features/core/Witch_Dock_Interactions.js`
- `features/core/Witch_Dock_Modals.js`
- `features/core/Witch_Dock_Module_Loader.js`
- `features/core/Witch_Dock_Preferences.js`
- `features/core/Witch_Dock_Registry.js`
- `features/core/Witch_Dock_Shell.js`
- `features/core/Witch_Dock_Styles.css`
- `features/booth/Booth_Runtime_Bootstrap.js`
- `tools/Booth.js`
- `tools/Utilities.js`
- `manifest.json`
- `Witch_Dock.user.js`

Everything else on the RC remains current Stable bytes.

## Important confirmed test-harness finding

The exact public RC has **not yet been live-tested**.

Do not claim that Bridge can directly execute the public launcher as an exact userscript test. The installed HF-Chat-Bridge host v0.4.0 grants `unsafeWindow`, `GM_info`, `GM_xmlhttpRequest`, `GM_getValue`, `GM_setValue`, and `GM_registerMenuCommand`, but it does **not** grant `GM_addStyle`, `GM_setClipboard`, or `GM_download`. The public launcher requires those capabilities.

## Exact next step

Create a temporary isolated **Public RC Host** userscript, preferably on a short-lived release-test branch, with:
- a unique Tampermonkey name so it cannot replace public Stable or Dev Auto Host;
- the same grants/connect surface required by the public launcher;
- target fixed to exact RC source `wd/28-public-rc/Witch_Dock.user.js`;
- strict validation that payload metadata is public v2.0.0 and contains no Dev identity;
- synthetic payload-correct `GM_info`;
- conflict protection so it refuses to run beside normal Dev/Public Dock instances;
- visible failure state and bounded retries matching the proven Dev Auto Host pattern where applicable.

This may require one manual Tampermonkey install from Amanda. Do not retarget or dismantle the working Dev Auto Host v0.1.1 merely to test the RC.

After installing the temporary RC host:
1. disable Dev Auto Host only for the RC gate;
2. Bridge-reload HeroForge;
3. require exact public v2.0.0 channel state, payload `aa54a3cd...`, Core v2.0.0, Loader 23/23 / 0 failed, immutable=23/fallback=0;
4. run narrow Dock/interactions/public seams/representative-tools regression;
5. Amanda visual confirmation if appearance differs or as final release gate;
6. restore normal Dev Auto Host after RC test;
7. stop and request explicit Stable-promotion approval.

After approval:
- promote the exact tested RC tree to `Witch_Scripts`;
- run narrow Stable smoke;
- automatically execute issue #14 cleanup/reconciliation; do not ask for a second cleanup approval.

## Protected state

- Do not mutate `Witch_Scripts` before explicit promotion approval.
- Do not delete the Stable archive ref, RC branch, public payload ref, #10 task history, or Dev payload refs before Stable smoke and #14 cleanup.
- Do not resume #10.
- Keep Dev Auto Host v0.1.1 targeting canonical `WITCH_DEV_MAIN`.
- HF-Chat-Bridge is development infrastructure only and must never become a Witch Dock runtime dependency.
