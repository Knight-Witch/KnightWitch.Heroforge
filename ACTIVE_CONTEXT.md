# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-13  
**Current task:** Texture Quality multi-figure lifecycle — validate committed v0.3.2 child-state-preservation fix in live Dev, then continue three-figure/membership/visual gates.  
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `features/rendering/Texture_Quality_Native_Reconcile.js`
4. `features/rendering/Texture_Quality_Native_Reconcile_UI.js` only if UI/service API behavior becomes relevant
5. `MODULE_VERSIONING.md` before any later runtime/version commit
6. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md` only when older engine evidence is genuinely needed

Do not preload full repo history/changelog/preflight/session logs.

## Public Stable — protected PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Stable remains service v0.1.0 / `0.1.0-dev-hfc-alpha3-port` + UI v0.1.0 / `0.1.0-dev-texture-quality-controls`. Blood Moon acceptance remains closed PASS. Stable has not been modified by the current investigation.

## Current Dev state

- service v0.3.2 / build `0.3.2-dev-preserve-child-modded-state`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls` unchanged;
- beta notice v0.1.2 / build `0.1.2-centered-sleek-title` unchanged;
- v0.3.2 is a PATCH lifecycle correction to v0.3.1; texture recipe, settle timing, UI API and persistence semantics are unchanged.

Persistence semantics remain: default OFF; boolean-only Persistent intent; manual Disable while persistent suppresses only the current page session; manual Enable/reload clears suppression; unchecking persistence stops future automatic behavior without forcing an active session off.

## Confirmed root cause

The multi-figure failure was not fundamentally an extra-display adoption problem. Texture Quality v0.3.1 independently called each non-primary figure's `Data.change()` before rebuilding its atlas.

HeroForge's `Data.change()` replaces `this.modded` with a new object. On a clean two-figure scene, the Colliefolk extra has a resolved `modded.sim` object with `materialSim="color"` and `clutPath` present. After the v0.3.1 child `Data.change()`, the child still knows `materialSim="color"` but its resolved `modded.sim` is missing. The parent-owned child display update then reaches `applyMaterialSims()` and throws `Cannot read properties of undefined (reading 'clutPath')`.

Exact stage instrumentation confirmed the child update successfully completes bone/skeleton/part/parent/blend-shape/pose setup and fails immediately inside `applyMaterialSims()`, before lighting or shader sliders.

## Proven fix seam

Do not independently rebuild non-primary `Data` objects.

v0.3.2 therefore:

- keeps `Data.change()` for the primary/root figure only during reconcile and restore;
- preserves non-primary HeroForge-resolved `data/modded` state;
- continues applying the existing per-figure Texture Quality policy and native `modded.buildAtlas()`;
- performs one root `CK.character.refresh()` and lets HeroForge's parent-owned display lifecycle propagate children;
- does not call child `display.change()` or `display.update()` directly and does not assign atlases manually.

A bounded live probe proved this before commit by replacing only the Colliefolk child's `Data.change()` with a temporary no-op while running the exact v0.3.1 service:

- Enable PASS: wrapper called once; child sim remained intact; both figures finished; scheduler idle; child display/resource atlas coherent at 4096×4096; status `ON — 2 figures · native atlases verified`.
- Disable/restore PASS: wrapper called a second time where old restore would rebuild the child; child sim remained intact; both displays finished; scheduler idle; status `OFF — source values restored; native atlases retained.`
- The temporary wrapper was removed successfully after the probe.

## Key Bridge evidence

- #2040 — exact child stage trace: failure is inside `applyMaterialSims()` / `clutPath`.
- #2052 — clean reload proves the untouched child has resolved `modded.sim` + `clutPath`.
- #2058 — two-figure Enable PASS when only child `Data.change()` is suppressed.
- #2060 — matching Disable/restore PASS with child state preserved.
- #2061 — temporary no-op probe removed.

## Rejected seams — do not reuse

- direct child `display.update()` — throws in HeroForge material handling;
- child `display.change(data, true)` lifecycle candidate — can adopt the atlas but wedges the child update lifecycle;
- parent `_updateChildren(true)` helper candidate — the ordinary parent update already aborts earlier if child material state was destroyed;
- direct atlas assignment or fabricated/copied `sim` state — violates native ownership and is unnecessary.

## Immediate next steps

1. Reload the live Dev page so the manifest cache key loads exact committed service v0.3.2 / `0.3.2-dev-preserve-child-modded-state`.
2. Non-mutating baseline: require two figures finished, child native atlas coherent, child `modded.sim` present, Texture Quality OFF, scheduler idle.
3. One manual Enable: require service success, both figures finished, scheduler idle, child sim preserved, and both display/resource atlases coherent at High Res.
4. One Disable/restore: require both figures finished, scheduler idle, child sim preserved and source-policy restoration clean.
5. Move to three figures and repeat Enable/Disable; then exercise count-agnostic add/remove membership while High Res is active.
6. Validate Seya as a non-primary figure visually; then a heavy non-primary case such as Twilight Soak if practical.
7. Stable remains untouched until explicit narrow promotion approval.

## Handoff note

The v0.3.2 change is intentionally narrow. It fixes Witch Dock's ownership violation by preserving HeroForge's already-resolved non-primary material state. Do not re-open rejected child-display lifecycle work unless exact committed v0.3.2 live validation produces new evidence that requires it.
