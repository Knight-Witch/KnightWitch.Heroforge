# Witch Dock Master

This is the canonical high-level source for current public Witch Dock state. Historical detail remains available in Git history and the HISTORY records.

## Current Stable

- Repository: `Knight-Witch/KnightWitch.Heroforge`
- Production branch: `Witch_Scripts`
- Public userscript: `Witch_Dock.user.js`
- Current public shell version: **1.2.1**
- HeroForge validation target: `heroforge07.1.9.98`
- Runtime dependency on HeroForge.Compatibility unstable head or HF-Chat-Bridge: **none**

Public shell v1.2.1 adds the validated cache-keyed manifest/module loader so branch-based raw GitHub caching cannot strand a page on an older manifest/module body. Module execution order and enablement are otherwise unchanged.

Final public Stable acceptance on 2026-09-07: **PASS**. Amanda confirmed the public v1.2.1 load and final Booth/Black Canvas behavior look correct after the narrow promotion commit `91a78ebaba6e54ee143dbae0053d782495f252fa`.

## Booth / Black Canvas

Public Booth: `tools/Booth.js` v27.0.4 / build `v27.0.4`.

Public Black Canvas replay: `features/booth/Black_Canvas_Display_Replay.js` v0.1.5 / build `0.1.5-dev-restore-before-booth-handoff`.

Public Booth runtime bootstrap: `features/booth/Booth_Runtime_Bootstrap.js` v0.1.0 / build `0.1.0-dev-native-booth-bootstrap`.

Public Stable validated behavior:

- saved Booth figures can bootstrap HeroForge's native gated Booth runtime and restore Booth View without first visiting native Photo Booth;
- bare camera state is not a saved-Booth signal, preserving `+ New Figure` exclusion;
- Black Canvas persistence remains independent from Booth persistence;
- the post-`CK.character.display.update()` replay preserves the validated white-flash suppression boundary and always lets native update run;
- replay restores any pre-BT background visibility it owns before Booth takes presentation ownership;
- editor environment restoration checks the actual `CK.environment.background.mesh`/ground state instead of trusting the wrapper flag alone;
- Lighting, Effects, Overlays, and Background component toggles use narrow redraw/reassertion and no longer rerun the broad overlay visibility sequence that stranded the editor environment;
- Black Canvas ON -> OFF restores the full fantasy backdrop plus pedestal/ground;
- Black Canvas ON + Booth Background OFF no longer strands the fantasy background mesh hidden.

Final Dev v27.0.4 state-repair smoke: **PASS** for full fantasy-background restoration, all four component toggles, Black Canvas ON/OFF restoration, and Black Canvas + Background-OFF fallthrough.

Final public Stable smoke: **PASS**. Public shell/module versions were correct, saved Booth/Black Canvas startup restoration behaved as expected, Black Canvas ON/OFF behaved as expected, and the previously reliable white-flash action remained clean.

### Deferred cosmetic issue — not a release blocker

A thin approximately 1 px checkerboard seam can still appear between the 1:1 Booth viewport and outer canvas, typically top/bottom and sometimes top/bottom/right depending on window geometry/maximization. It may appear after a delay. This is explicitly deferred to a later separately scoped frame/mask geometry investigation. Do not reopen the rejected `getTokenViewOffset()` DOM matte or the closed white-flash investigation as a shortcut.

Detailed records:
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`
- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_ACCEPTANCE.md`

## Utilities

Public Utilities: `tools/Utilities.js` v1.2.1.

- `Booth Features`: saved Booth Persistence Across Sessions and Black Canvas Across Sessions defaults.
- `Decal Features`: Bound Decal Gizmo controls.
- `HeroForge UI Patches`: existing optional UI utilities.
- existing storage keys and corrected-gizmo service ownership are preserved.

## Public tab presentation

Default/structural visible tab order:

`Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`

- The historical `Body Editor` internal tab key remains compatible while the visible label is `Body`.
- Utilities is an icon-only cog with tooltip/ARIA label `Utilities` and is structurally pinned last.

## Developer Mode

Public Developer Mode: v0.3.0 / build `0.3.0-public-ready-manifest-source`.

- optional/default OFF;
- About-only toggle;
- persistent user choice;
- exposes canonical module versions/runtime builds and tool IDs for troubleshooting;
- reads the active public manifest registry.

`manifest.json.moduleRegistry` is the canonical public active-module version registry.

## Photo Booth true resolution

Feature ID: `media.screenshot-resolution`.

- Service: v0.8.0 / build `0.8.0-service-only-provider`.
- UI: v0.3.0 / build `0.3.0-service-ui-ownership`.
- Readiness adapter: v1.0.0 / build `1.0.0-public-readiness`.
- TRUE 4K/8K remains Stable validated and unchanged by the Booth promotion.

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

- Service: v0.5.1 / build `0.5.1-witch-dock-stable-download-scroll-guard`.
- UI: v0.1.1 / build `0.1.1-stable-download-ux`.
- Capture engine/UI are unchanged by the Booth promotion.

## Other live tools

- Body: live.
- Pose: live.
- Decals: live placeholder.
- JSON: live.
- Corrected Bound Decal Gizmo runtime: v1.1.1 / build `1.1.1-dev-fresh-slot-normalization`, Dev validated and promoted to Stable. Fresh untouched first Project-OFF normalizes H/V to `0/0` and S/SY to `-1.5/-1.5`; edited Project state and artwork swaps preserve established bound transforms.

## Current integration rules

- `Witch_Scripts` is production; experiments validate separately before promotion.
- Promote accepted deltas only; do not merge diverged Dev branches wholesale.
- Preserve validated timing/state sequencing, lifecycle restoration, capability gates, and failure isolation.
- Public Stable must not depend on HF-Chat-Bridge or an unstable Compatibility/Foundation head.

## Current queue

1. Booth/Black Canvas lifecycle + loader cache repair: **closed / public Stable validated** on `heroforge07.1.9.98`.
2. The approximately 1 px checkerboard seam at the 1:1 edge remains a documented deferred cosmetic issue; investigate later against the actual frame/mask viewport geometry.
3. Move on to the next separately scoped project. Do not continue the Black Canvas investigation merely because the deferred seam exists.

## Durable records

- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `MODULE_VERSIONING.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_ACCEPTANCE.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
