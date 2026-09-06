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
