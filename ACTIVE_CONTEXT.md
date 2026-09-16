# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-16
**Current task:** Texture Quality post-promotion regression hardening is CLOSED. Witch Dock is paused at the mandatory HF-Chat-Bridge ergonomics stop gate before any unrelated Dock bug/feature work.
**Protected public state:** `Witch_Scripts` remains live and closed at Stable head `acaf18a0cfd2c751886e85a269b9427ddfaa5040`. Do not change Stable unless a new Dev fix passes its own gate and Amanda explicitly approves another narrow promotion.
**Validated Dev runtime source:** `d0d198cea6f8d755b79ff667c1b3d550956ea0cb`.
**Public runtime promotion:** `dac34877b5d02208c99072e67bf0e59b9233b11b`.
**Public rollout closeout:** `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.
**Current modules:** core service v0.3.5 / `0.3.5-preserve-native-source-floor`; same-figure drift guard v0.1.0 / `0.1.0-dev-stable-same-figure-repair`; active-decal priority v0.1.1 / `0.1.1-dev-projected-host-lifecycle-coordination`; UI v0.2.0 unchanged.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. GitHub backlog issue `#8` only when selecting the next Witch Dock task;
4. `MODULE_VERSIONING.md` only before a future runtime/version change;
5. only source files directly required by that future task;
6. rolling `CHANGELOG.md` / `PRE_FLIGHT_Check.md` only when committing.

Do not preload unrelated history. Do not consult HeroForge.Compatibility unless a new unresolved engine seam appears.

## Texture Quality regression matrix — CLOSED / PASS

The already-promoted Texture Quality lifecycle/projected-host patch completed the post-promotion hardening matrix with no new runtime fix required.

- Clean 2-figure Dev baseline passed; High Res enabled across D5/Seya + Demi with verified 8192×4096 native atlases and bodyLower/bodyUpper/face scale 4, bake/source 2048, packed 2048×2048.
- Real mouse-driven kitbash drag on secondary figure Demi reproduced the expected brief native downgrade and recovered automatically. Same-figure guard repaired exactly once; untouched D5 remained coherent.
- Third figure Witch of the Wilds added while High Res stayed active; 3-figure verification passed. `hairZ` supplied an additional projected-host family.
- Real Witch kitbash drag reproduced the same lifecycle and advanced guard repairs from 1 -> 2 with `baseItemB` as the repair target; all three figures returned coherent.
- Removing Witch while High Res remained active returned cleanly to 2 figures. Removed `baseItemB` / `hairZ` ownership disappeared; no extra guard repair fired.
- Deliberate same-canvas D5 -> Demi -> D5 selection switching passed. High Res stayed enabled, guard repairs remained exactly 2, host ownership remained per figure, and HeroForge finished idle.
- Canvas/scene round-trip with Persistence ON passed. Projected decals were immediately high-res on return; body atlases briefly rebuilt, then automatically returned to verified High Res. Runtime confirmed `persistent:true`, `enabled:true`, no scene-sync pending/error, and no extra guard repair.
- Final inert-selector control passed: a new default/unpainted third figure was verified by core High Res while active-decal state reported `baseItemB.activeAccessorySlots: []`. D5 retained only its four wing hosts; Demi retained only its five non-wing hosts; active-decal coordination stayed idle/error-free.
- The earlier muddy/green artifact remains non-reproducing and closed absent a fresh visual reproduction.

## Mandatory stop gate — HF-Chat-Bridge next

Before starting another Witch Dock bug, repair, or feature, switch to `Knight-Witch/HF-Chat-Bridge` and complete issue `#2580`: make the trusted DEV workbench less restrictive and lower-ceremony for routine diagnostics.

The current main workbench friction was reconfirmed during this regression: service getters such as `getState()` require the Power companion because generic workbench calls are method-name allowlisted, and descriptor reads block accessor properties. Amanda explicitly prefers more Bridge leeway when it improves efficiency/effectiveness.

Preferred direction: path-aware trusted named calls / broader trusted-DEV named-path mode rather than blindly widening a generic method-name allowlist. Preserve at-most-once mutation semantics, development-only scope, bounded transport, no credential/token extraction, no remote script loading, and no production Witch Dock dependency on the Bridge.

Do not resume the Witch Dock backlog until that Bridge update is validated and Amanda has installed/updated only the Bridge component(s) actually required.

## Witch Dock backlog after Bridge gate

The durable backlog is GitHub issue `Knight-Witch/KnightWitch.Heroforge#8`. Confirmed/deferred items there include the intermittent `Loading failed: connection error` toast, historical import/export and capture regressions needing current re-test, launcher UX status check, broader Enhanced Object Textures, Spin/WebP quality controls, in-app bug reporting, and the separate Extra Characters revamp.

Treat historical reports as re-test items, not confirmed present-day bugs, until reproduced on current code.

## Scope boundary

Broader Enhanced Object Textures remains separate future work. The completed Texture Quality work is the validated lifecycle/core body-head/projected-active-host patch already present on Stable, not a blanket accessory-resolution expansion.
