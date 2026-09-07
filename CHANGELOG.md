# Changelog

## DOCK-2026-09-07-038 — Add Dev Black Canvas post-display replay

Date: 2026-09-07

### Summary

Added a separate hidden Dev compatibility module to address the remaining one-frame white flash while Black Canvas is active without suppressing HeroForge's native character rebuild. Public Stable is unchanged.

### Confirmed diagnosis

- live isolation established `CK.character.refresh()` -> `display.change()` -> resource load -> `display.update()` as the common rebuild path;
- suppressing only `display.update()` produced a clean **no flash** result while the earlier native stages still occurred, so the flash is inside that update/rebuild boundary;
- suppressing HeroForge's native update is not acceptable maintained behavior;
- the flash also occurs in Booth, so a Kitbash-only production fix is rejected;
- renderer clear/resize/backing-store paths, loading state, Booth overlay/environment churn, lighting, ground, custom update hooks, deferred FX, Kitbash mirror/parenting, and Kitbash mesh replacement were ruled out as sufficient causes;
- the actual main-scene background is a separate missing Black Canvas target and is semantically discoverable from the Booth scene root through named `environment` -> `background`.

### Changes

- added hidden `booth-black-canvas-display-replay` v0.1.0 / build `0.1.0-dev-post-display-update-replay` at `features/booth/Black_Canvas_Display_Replay.js`;
- the module wraps only the current primary `CK.character.display` instance's named `update()` method;
- HeroForge's native update always runs untouched; the wrapper reasserts Black Canvas state synchronously in `finally` only when the existing Booth API reports `sessionBlackCanvas` ON;
- display replacement is detected and the owned wrapper is moved/restored rather than stacked;
- the real scene background is found by semantic names, its previous visibility is captured, it is hidden while Black Canvas is active, and it is restored on Black Canvas OFF/dispose;
- diagnostic child indexes are not used in maintained source;
- replay hides frame/shadow/mask, reasserts named environment visibility OFF, and blackens canvas/holder CSS;
- replay deliberately does not force `overlays.backgroundPlane.visible`, preserving the existing Booth Background component choice;
- replay deliberately does not request another render refresh;
- `tools/Booth.js` remains unchanged at v27.0.0/build `v27`.

### Module version

- new `booth-black-canvas-display-replay`: v0.1.0.
- `booth-tool`: unchanged v27.0.0.

### Preserved boundaries

- public `Witch_Scripts` unchanged;
- Corrected Bound Decal Gizmo unchanged;
- Spinny Mini WebP unchanged;
- High Res Image Capture unchanged;
- JSON, Utilities, Developer Mode, Decals host, and tab infrastructure unchanged;
- HF-Chat-Bridge remains development-only and is not a runtime dependency.

### Test status

- Node syntax check: PASS.
- Mock lifecycle test: PASS for native-update passthrough, post-update replay, semantic-background hide/restore, Black Canvas OFF restoration, and wrapper disposal.
- Live browser flash validation: **pending**. This commit does not claim the visible flash is fixed until Amanda runs the Dev smoke.
- No Dev GitHub Actions workflow exists; no CI claim is made.

### Rollback

Disable/remove the hidden manifest entry or revert this single Dev commit. `tools/Booth.js` v27 is not modified by this experiment.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

## DOCK-2026-09-06-037 — Stabilize Booth v27 startup and state replay

Date: 2026-09-06
Timestamp: 21:15 PDT

### Confirmed v26 regression

- v26 waited for `BT.maker` before its runtime loop/startup defaults could do useful work, so saved Booth/Black Canvas state could remain visually dormant until HeroForge initialized Photo Booth later in the session.
- Once that runtime appeared, the saved Black Canvas startup path replayed `refreshBTComponentRender()` six times; that helper explicitly called `CK.character.refresh()` on every replay.
- HeroForge's native `BT.display.lighting.apply(next, previous)` also calls `CK.character.refresh()` when `previous.sphereLights` differs from `next.sphereLights`. v26's Booth lighting helper passed `null` as `previous`, creating another unnecessary whole-character refresh path.
- Live bridge inspection confirmed the figure's saved Booth effects and lighting remained present in `CK.data.custom.portrait`; the regression was application/runtime churn rather than deleted saved settings.
- A live bridge probe calling `BT.display.lighting.apply(savedLighting, savedLighting)` produced zero `CK.character.refresh()` calls.

### Changes

- Booth advances to v27.0.0 / build `v27`.
- Runtime resolution no longer requires `BT.maker` merely to inspect character-owned Booth config or apply display-only Black Canvas state; the BT facade can exist before the Booth engine, and uses `BT.liveEngine || BT.maker` when an engine is available.
- Saved Booth config detection scans character-owned portrait/token mode config rather than depending on `cameraSave` or a live maker object; current HeroForge saved figures may legitimately have `camera`, `effects`, `filters`, `lighting`, and `selected` with no `cameraSave` field.
- Character-owned saved effects/lighting/background selection seed Booth's figure-scoped snapshots before the engine is available.
- Figure changes are detected from the current `CK.data` object generation plus `CK.character.uuid`; figure-scoped Booth snapshots are cleared so one figure's renderer/effect/lighting references are not replayed onto another figure.
- Default-owned figure-switch handling gets a short settle grace before deciding that the new figure has no saved Booth config. Manual session overrides remain distinct.
- Persistent Booth re-enables the named BT engine when it becomes available and Booth View is intended, instead of making all startup logic wait for that engine first.
- `refreshBTComponentRender()` no longer calls `CK.character.refresh()`.
- Booth lighting replay now passes the captured lighting state as both `next` and `previous`, matching the live-proven no-character-refresh replay path.
- Black Canvas startup retries now reassert only Black Canvas/display state; they no longer replay the broad component/character refresh path.
- Black Canvas layout invalidation now includes canvas/holder geometry, viewport size, and DPR in addition to backing/client dimensions so responsive right-edge strip regressions can trigger HeroForge's native overlay resize/refresh sequence.
- No mask/shader hack was added for the thin 1:1 square edge; that artifact remains a separate unresolved mask/shader-path issue.

### Preserved boundaries

- `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` is untouched; v27 does not modify the validated decal gizmo/runtime to address the reported projected-decal corruption.
- Utilities behavior/storage keys remain unchanged at v1.2.1.
- Spinny, High Res Image Capture, JSON, tab infrastructure, and public Stable are unchanged.
- Public `Witch_Scripts` remains untouched pending live v27 validation.

### Validation gate

The v27 source was built off-branch and compared against v26 before branch movement; the runtime-code candidate changes only `tools/Booth.js`. Manifest identity is `27.0.0` / `v27`. The repository has no Dev GitHub Actions workflow, so live `WITCH_DEV_UI` smoke remains the decisive gate.

Required live checks: saved-figure fresh reload; Black Canvas without opening Photo Booth; absence of the v26 white-flash storm; saved effects/lighting preserved; projected decal transform unchanged; same-page figure switching; `+ New Figure` exclusion; manual session overrides; component toggles; and responsive Black Canvas edge behavior.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

## DOCK-2026-09-06-036 — Repair Booth defaults on fresh figure/page load

Date: 2026-09-06
Timestamp: 18:45 PDT

### Changes

- Booth advances to v26.0.0/build `v26`.
- Saved Booth Persistence now actively enables the Booth View session on fresh load when the loaded figure contains meaningful Photo Booth configuration in `CK.data.custom[BT.currentMode]`.
- Fresh `+ New Figure` / no-Booth-config figures are intentionally excluded from automatic startup; the established real-Booth-visit fallback remains.
- Default-owned Booth sessions track sustained loss of saved Booth config on figure switch and disable themselves without affecting manual Booth View overrides.
- Internal silent-cycle off/on preserves default/manual session ownership.
- Saved Black Canvas now replays the existing activation plus native display refresh during HeroForge's delayed startup settling, while respecting a session override to OFF.
- Booth diagnostics expose saved-config detection, default-owned session state, and startup Black Canvas kick count.
- Utilities advances to v1.2.1 and explains the saved-figure gate/override status.

### Source evidence

HeroForge build `heroforge07.1.9.98` source confirms deliberate Booth camera state is written to `CK.data.custom[BT.currentMode].cameraSave`, and figure switching reloads saved camera/display/effect config. Runtime-only `_modeCameraJSON` is not used as the eligibility gate.

### Gate

Static syntax/manifest/semantic assertions pass before commit. Live Dev validation is required for: saved-figure fresh-load restore, `+ New Figure` exclusion, same-page saved -> new behavior, Black Canvas visual startup, and both session-only overrides.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

## DOCK-2026-09-06-035 — Add Booth cross-session defaults in Utilities

Date: 2026-09-06

### Changes

- Booth v25 separates saved automatic defaults from Booth-tab session overrides while preserving the existing persistence/Black Canvas engine.
- Existing `kw.witchDock.booth.consent.v1` is retained as the saved Booth-persistence default for migration compatibility.
- New `kw.witchDock.booth.blackCanvasDefault.v1` stores the automatic Black Canvas default.
- Saved Booth persistence still waits for a real Photo Booth visit before auto-arming; saved Black Canvas initializes directly in the editor without requiring Booth entry.
- Booth View and Black Canvas remain available in the Booth tab as session-only overrides and do not rewrite saved defaults.
- The old `Enable Booth Persistence` checkbox moves out of Booth; Booth gains a clickable `Utilities` note for automatic defaults.
- Utilities v1.2.0 adds a `Booth Features` category with the two saved defaults.
- Utilities renames the former `Bound Decal Gizmo` top-level section to `Decal Features` and nests the unchanged gizmo controls beneath it.
- Dev shell adds `WitchDock.activateTab(name)` for first-class internal cross-tab navigation and advances to dev-loader v0.5.0 / userscript 1.0.8.5.

### Gate

Static syntax/manifest/version assertions pass before commit. Live Dev validation is required for saved-default reload behavior, session-only overrides, immediate Black Canvas startup, Booth-entry auto-arm, and Booth-to-Utilities navigation before any Stable promotion.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

## DOCK-2026-09-06-034 — Move bound decal gizmo controls to Utilities

Date: 2026-09-06

### Changes

- `tools/Decals.js` v1.1.0 no longer hosts the corrected bound decal gizmo UI and now displays `New decal tools coming shortly!` as the Decals-tab placeholder.
- `tools/Utilities.js` v1.1.0 now hosts the existing Bound Decal Gizmo control block, including enable/disable, Move/Rotate/Scale mode buttons, live status, build/mapping/decal diagnostics, and the existing Project-OFF note.
- The validated `decals.gizmo.bound-correction` runtime and its source fragments are intentionally unchanged.
- The service-owned preference key `kw.witchDock.decals.boundGizmo.enabled` is unchanged, so the user's existing enabled/disabled state carries across the host move.
- Dev manifest points the changed Decals and Utilities entries at `WITCH_DEV_UI` for the live smoke.

### Module versions

- `decals-dev`: v1.1.0.
- `utilities`: v1.1.0.
- `corrected-bound-decal-gizmo`: remains v1.1.0 / build `1.1.0-stable-undo-transform-preserve`.

### Gate

Static syntax/manifest/diff/runtime-hash checks must pass. Live Dev smoke should confirm: Decals placeholder, one gizmo control block in Utilities, preserved toggle state, and working Move/Rotate/Scale selection.

**Runtime behavior changed:** yes, Dev UI host relocation only; gizmo runtime unchanged.

---

## DOCK-2026-09-06-033 — Make Developer Mode public-ready in Dev

Date: 2026-09-06

### Changes

- Developer Mode advances to v0.3.0 / build `0.3.0-public-ready-manifest-source`.
- Product surface remains About-only, persistent, optional, and OFF by default.
- Developer Mode no longer hardcodes the `WITCH_DEV_UI` manifest. It resolves the module registry from the manifest URL advertised by the active Witch Dock host, with public `Witch_Scripts/manifest.json` only as a fallback.
- Dev loader now advertises its actual manifest URL through `KWWitchDockManifestURL` and advances to v0.4.0 / build `1.0.8.4-devmode-manifest-source` (`@version` 1.0.8.4).
- Troubleshooting UI continues to expose per-tool IDs/version/build rows, About `Module Versions`, Spinny Short Test visibility, and High Res recovery diagnostics only while Developer Mode is enabled.
- No hotkey or non-About activation surface is added.

### Gate

Static syntax/manifest/source assertions pass before commit. Live Dev smoke is required for default-off behavior, About toggle persistence, correct Dev registry versions, per-tool rows, module inventory, Spinny Short Test gating, High Res developer controls, and normal-mode cleanup.

**Runtime behavior changed:** yes, Dev diagnostics/host metadata only. Public Stable remains unchanged.

---

## DOCK-2026-09-06-032 — Validate High Res service/UI ownership cleanup

Date: 2026-09-06

User live smoke passed the Dev ownership cleanup at `b7693f03eb411c9a7d954175e6f181111fac88a4`.

Confirmed PASS:

- one compact `High Res Image Capture` section with no duplicate legacy presentation;
- Developer Mode provider/build diagnostics;
- provider disable -> enable recovery;
- direct TRUE 4096x4096 capture;
- direct TRUE 8192x8192 capture;
- Spinny coexistence;
- previously validated tab cleanup remains intact.

The service-only v0.8.0 / UI-only v0.3.0 ownership boundary is live validated in Dev.

**Runtime behavior changed:** no. Documentation-only validation checkpoint.

---

## DOCK-2026-09-06-031 — Separate High Res capture service and UI ownership

Date: 2026-09-06

### Changes

- `Photo_Booth_True_Resolution.js` v0.8.0 is now service/provider-only and no longer creates DOM, styles, or registers the Booth tool.
- Validated capture/provider function bodies are byte-identical to the prior v0.7.0 Dev service; only presentation ownership/lifecycle metadata changed.
- `Photo_Booth_True_Resolution_UI.js` v0.3.0 is the sole Witch Dock presentation owner for `High Res Image Capture`.
- The service is manifest-loaded as a hidden runtime service; the UI self-registers the visible Booth section after the service is available.
- Readiness adapter remains unchanged and continues to synchronize `.kwPBResBtn` controls.
- Compact normal UI and Developer-Mode provider diagnostics are preserved.

### Gate

Static ownership/syntax/manifest checks pass. Live Dev regression required: compact UI, direct TRUE 4K, direct TRUE 8K, Developer Mode provider disable -> enable recovery, and existing Spinny/Booth coexistence.

**Runtime behavior changed:** yes, Dev architecture/presentation ownership only. Validated 4K/8K capture math unchanged.

---

## DOCK-2026-09-06-030 — Validate Witch Dock Dev tab cleanup

Date: 2026-09-06

User live smoke passed the Dev tab cleanup introduced at `cb973c983dfaa723d7e6cb6d7c4474a1c875682e`. Confirmed default/structural order is `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`, Utilities renders as the cog icon with `Utilities` tooltip and remains pinned last, each tab still opens the correct tool, and persisted active-tab selection restores after refresh.

**Runtime behavior changed:** no. Documentation-only validation checkpoint.

---

## DOCK-2026-09-06-029 — Dev tab cleanup and pinned Utilities icon

Date: 2026-09-06

### Changes

- Dev tab presentation now displays `Body` instead of `Body Editor` without changing the internal/persisted tab key.
- Default/runtime tab order is enforced as `Body -> Pose -> Decals -> Booth -> JSON -> Utilities`.
- Utilities is an icon-only SVG cog with hover tooltip and ARIA label `Utilities`.
- Utilities is structurally pinned last; later/unknown tabs are inserted ahead of it rather than pushing Settings/Utilities into the middle.
- Manifest load order is aligned with the same visible order so registration order and core ordering agree.

### Version

- `witch-dock-dev-loader`: v0.3.0 / build `1.0.8.3-tab-order-icon`; userscript `@version` 1.0.8.3.
- Tool module sources unchanged.

### Developer Mode direction recorded

Developer Mode is intended for eventual Stable availability as a default-OFF About-menu toggle so users can expose module/build/version diagnostics when troubleshooting. This commit does not promote Developer Mode to Stable.

**Runtime behavior changed:** yes, Dev shell presentation/order only. Public Stable remains unchanged by this checkpoint.

---

## DOCK-2026-09-06-028 — Harden Spinny Dev download and capture UX

Date: 2026-09-06

### Confirmed live findings before this patch

- Integrated Spinny capture, Pause/Resume, cancellation, interaction guards, Developer-Mode Short Test visibility, and draggable popout all passed user smoke testing.
- Full and Short Test captures completed their render/mux path but the final browser download did not start from the Witch Dock-loaded context.
- Resolution/rotation native select popups opened with a white option surface and low-contrast text.
- User requested plain resolution labels, icon-only Pop Out presentation, brief successful-download feedback, and silent blocking for wheel/scroll while retaining confirmation warnings for other guarded actions.

### Changes

- Dev loader adds a privileged `GM_download` Blob host and exposes it as `WitchDock.downloadBlob`; the Spinny service now awaits confirmed host download completion instead of assuming `anchor.click()` succeeded.
- Spinny diagnostics now record download method, filename, and confirmation state.
- Wheel/scroll events are still prevented during capture/paused state but no longer open the guard modal; all other guarded mutations retain Keep Capture / Cancel Capture.
- Resolution labels are now `1024px`, `2048px`, and `3072px`.
- Select/options use explicit dark styling and `color-scheme: dark`.
- Pop Out is now a standard external-window SVG icon with tooltip/ARIA label.
- UI flashes a short `Download complete` indicator only after the privileged download host confirms completion.

### Module versions

- `witch-dock-dev-loader`: v0.2.0 / build `1.0.8.2-spinny-dev-download-host`.
- `spinny-mini-webp`: v0.5.1 / build `0.5.1-witch-dock-dev-download-scroll-guard`.
- `spinny-mini-webp-ui`: v0.1.1 / build `0.1.1-dev-download-ux`.

### Test status

Static syntax/manifest/assertion checks run in the materialization workflow. Live download and UI re-smoke remain required before Stable promotion.

Rollback: revert this single Dev hardening commit; prior validated capture/mux engine remains otherwise unchanged.

**Runtime behavior changed:** yes, Dev branch only. Public `Witch_Scripts` unchanged.

---

# Changelog

## DOCK-2026-09-06-027 - Add isolated WITCH_DEV_UI Tampermonkey loader

Date: 2026-09-06

Added `Witch_Dock_DEV.user.js` as a Dev-only test harness. It loads `WITCH_DEV_UI/manifest.json` and uses Dev-branch update/download URLs, preventing the Spinny integration smoke from silently loading Stable.

Public `Witch_Dock.user.js` and `Witch_Scripts` remain unchanged.

Module registry adds `witch-dock-dev-loader` v0.1.0 / build `1.0.8.1-spinny-dev-loader`.

**Runtime behavior changed:** Dev test harness only.

---

# Changelog

## DOCK-2026-09-06-026 — Integrate Spinny Mini WebP into Witch Dock Dev

Date: 2026-09-06

### Summary

Integrated the validated `media.spinny-mini-webp` v0.5.0 capture service into `WITCH_DEV_UI` and added a Witch Dock Booth-tab presentation adapter.

### Runtime changes

- new `features/media/Spinny_Mini_WebP.js` service, adapted from the exact checksum-verified HFC v0.5.0 source;
- new `features/media/Spinny_Mini_WebP_UI.js` Dock UI;
- default placement after High Res Image Capture in the Booth tab;
- movable draggable popout using the same control DOM/service state as the docked host;
- closing/docking the popout restores controls to the Booth tab without losing settings;
- Short Test remains part of the service but is visible only when Developer Mode is enabled;
- Pause/Resume/Cancel/progress/ETA and interaction guards are exposed through the Witch Dock host;
- Spinny-owned dock/popout UI is exempt from capture guards; HeroForge/Booth interaction remains guarded;
- 4096 animated WebP remains deferred and the existing 4096/8192 still-image provider ownership is unchanged.

### Module versions

- `spinny-mini-webp`: v0.5.0 / build `0.5.0-witch-dock-dev-service`;
- `spinny-mini-webp-ui`: v0.1.0 / build `0.1.0-dev-dock-popout`.

### Gate

Static integration checks passed. Live `WITCH_DEV_UI` smoke is required before any Stable promotion.

**Runtime behavior changed:** yes, Dev branch only. Public `Witch_Scripts` unchanged.

---

# Changelog

## DOCK-2026-09-06-025 — Preserve Witch Dock UI / Spinny follow-up queue

Date: 2026-09-06

### Summary

Documentation-only checkpoint preserving the Witch Dock side-project work discussed while the standalone 3072px Spinny/WebP validation run was active. No runtime source, manifest behavior, module version, or public Stable behavior changed.

### Confirmed completed / visually accepted

- Standalone compact `High Res Image Capture` Dev UI loaded and looked correct.
- Developer Mode loaded and worked through the About UI.
- Developer Mode v0.2 per-tool canonical version display looked correct.
- About `Module Versions` inventory was visible and looked correct.
- The standalone 3072px Spinny capture has finished; detailed result intake is the next Spinny task.

These visual confirmations do not claim that direct 4K/8K regression, provider disable/re-enable recovery, or integrated Dev-manifest loading has passed.

### Durable pending queue recorded

Added `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md` covering:

- integrated Developer Mode + compact High Res smoke/promotion;
- final High Res service/UI ownership cleanup before Stable;
- integrated `Booth -> Decals -> JSON` tab-order smoke;
- Spinny placement directly below High Res Image Capture;
- draggable Spinny popout with close/collapse behavior and shared service state;
- Pause/Resume at completed-frame boundaries;
- layout-independent capture-invalidating interaction guards for Booth exit, camera drag, view/backdrop/overlay/lighting/effect changes, and other proven frame-mutating controls;
- explicit 4096px animated-WebP deferral because of the confirmed 4096 still-provider collision;
- optional Developer Mode hotkey as non-required future convenience only.

### Preserved behavior

- `Witch_Scripts` unchanged.
- `WITCH_DEV_UI` runtime modules unchanged.
- `manifest.json` unchanged.
- Canonical module versions unchanged; `MODULE_VERSIONING.md` requires no bump for documentation-only work.
- High Res 4K/8K provider/capture math unchanged.
- Spinny/WebP capture code unchanged.
- No HF-Chat-Bridge access occurred.

### Touched files

- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md` (new)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

**Runtime behavior changed:** no.

---

## DOCK-2026-09-06-024 — Canonical module version registry

Date: 2026-09-06

- Established a canonical numeric version for every active Witch Dock runtime module in `manifest.json.moduleRegistry`.
- Added `MODULE_VERSIONING.md` as the binding future version-bump contract.
- Advanced Developer Mode to v0.2.0 with canonical per-tool versions and About module inventory.
- No Stable feature source was edited solely for bookkeeping.

**Runtime behavior changed:** Developer Mode Dev diagnostics only. Existing Stable module behavior did not change.

---

## DOCK-2026-09-05-023 — Modular Developer Mode Dev candidate

Date: 2026-09-05

- Added standalone hidden Developer Mode module and About toggle.
- Added reversible tool metadata wrapper and shared diagnostics API.
- Updated High Res UI to consume Developer Mode for provider recovery/build diagnostics.

**Runtime behavior changed:** Dev-only diagnostics/presentation.

---

## DOCK-2026-09-05-022 — High Res Image Capture UI cleanup and Decals tab order Dev candidate

Date: 2026-09-05

- Added compact High Res Image Capture Dev UI.
- Hid provider kill switch/implementation notes from ordinary users.
- Moved Dev default Decals order before JSON.
- Stable capture engine/readiness and public branch remained unchanged.

**Runtime behavior changed:** Dev-only presentation/default order.

---

## DOCK-2026-09-05-021 — Public Photo Booth Smoke Acceptance

Date: 2026-09-05

- Public HeroForge/Lob 4096 and 8192 routes passed perfectly.
- Public Witch Dock direct TRUE 4K and TRUE 8K passed perfectly.
- Readiness adapter passed without repair-toggle cycling.
- `media.screenshot-resolution`: **Witch Dock Stable validated**.

**Runtime behavior changed:** no.

---

Historical changelog records through DOCK-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.
