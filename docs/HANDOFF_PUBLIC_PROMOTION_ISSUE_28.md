# Handoff — Issue #28 Public Modular Promotion

**Updated:** 2026-09-20  
**Active issue:** #28 — Promote modular Witch Dock architecture to public Stable  
**Canonical Dev:** `WITCH_DEV_MAIN` @ `f69daf5b8b791f03c3e83ae19028e461f42acced`  
**Public Stable:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4` — untouched  
**Public RC:** `wd/28-public-rc` @ `95b5cdae4c8840d950d984c73bce101ba887011e`  
**Temporary RC host:** `wd/28-public-rc-host` @ `536b89c7747e0a2f1f0f31561b1194ea00f73f3f`  
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
- Temporary Public RC Host v0.1.0 exists on isolated branch `wd/28-public-rc-host` at `536b89c7747e0a2f1f0f31561b1194ea00f73f3f`; it loads only `wd/28-public-rc/Witch_Dock.user.js` and statically validates public v2.0.0 / build / Stable routing / immutable payload / grants / public update URLs before execution.
- RC-host static checks PASS; `node --check` passed before commit and the exact RC launcher passed identity/routing checks.
- HF-Chat-Bridge ping request #2961 returned SUCCESS on userscript v0.4.0 with page context available, pump healthy, and DEV writes enabled.

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

The temporary RC host is built and committed. The next gate requires one human Tampermonkey switch:

1. Install raw `wd/28-public-rc-host/devtools/Witch_Dock_Public_RC_Host.user.js`.
2. Disable Dev Auto Host v0.1.1 and any directly installed public Witch Dock for the RC gate. Do not uninstall them.
3. Reload HeroForge once.
4. Through HF-Chat-Bridge require:
   - `KWWitchDockPublicRCHost` v0.1.0 with `launcher-executed`;
   - stable public launcher v2.0.0 / build `2.0.0-immutable-modular-bootstrap`;
   - branch `Witch_Scripts`;
   - payload `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`;
   - Core v2.0.0;
   - Loader v0.2.0, 23/23 fetched/executed, 0 failed;
   - immutable resolution=23 / fallback=0;
   - one Dock / one compact icon and no Dev channel identity.
5. Run the narrow Dock/interactions/public seams/representative-tools regression through Bridge.
6. Amanda performs the final visual confirmation.
7. Re-enable normal Dev Auto Host after the RC gate.

After RC live PASS, stop for Amanda's explicit Stable-promotion approval. After approved promotion + Stable smoke, issue #14 cleanup/reconciliation triggers automatically.

## Protected state

- Do not mutate `Witch_Scripts` before explicit promotion approval.
- Do not delete the Stable archive ref, RC branch, public payload ref, #10 task history, or Dev payload refs before Stable smoke and #14 cleanup.
- Do not resume #10.
- Keep Dev Auto Host v0.1.1 targeting canonical `WITCH_DEV_MAIN`; disable it only for the isolated RC gate, then restore it.
- Preserve temporary RC host branch `wd/28-public-rc-host` until the RC live gate is complete.
- HF-Chat-Bridge is development infrastructure only and must never become a Witch Dock runtime dependency.
