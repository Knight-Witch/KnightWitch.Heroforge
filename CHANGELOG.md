# Changelog

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
