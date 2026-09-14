# Active Context — WITCH_DEV_UI

**Updated:** 2026-09-13  
**Current task:** Texture Quality multi-figure lifecycle — finish validation of the live-only v0.3.2 extra-display adoption candidate, then commit it only if foreground runtime validation passes.  
**Runtime posture:** public Stable Texture Quality v0.1.0 remains released/accepted and untouched.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `features/rendering/Texture_Quality_Native_Reconcile.js`
4. `features/rendering/Texture_Quality_Native_Reconcile_UI.js` only if UI/service API behavior becomes relevant
5. `MODULE_VERSIONING.md` before any runtime/version commit
6. `HISTORY/BULLSHIT/TEXTURE_QUALITY_NATIVE_RECONCILE.md` only when older engine evidence is genuinely needed

Do not preload full repo history/changelog/preflight/session logs.

## Public Stable — protected PASS

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

Stable remains service v0.1.0 / `0.1.0-dev-hfc-alpha3-port` + UI v0.1.0 / `0.1.0-dev-texture-quality-controls`. Blood Moon acceptance remains closed PASS. Stable has not been modified by the current investigation.

## Committed Dev state

- service v0.3.1 / build `0.3.1-dev-bounded-mask-capability`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls` unchanged;
- beta notice v0.1.2 / build `0.1.2-centered-sleek-title` unchanged;
- current committed Dev HEAD before this docs-only handoff was `74f013cf9e2cc92261fae63efdd89c73e75701db`.

Persistence semantics remain unchanged: default OFF; boolean-only Persistent intent; manual Disable while persistent is page-session suppression; manual Enable/reload clears suppression; unchecking persistence stops future automatic behavior without forcing an active session off.

## Closed prerequisites

- v0.2.2 fixed promoted body-mask path resolution.
- v0.2.3 added stable visible renderer readiness before automatic Persistent enable.
- v0.2.4 expanded native settle to 120 seconds for heavy generations.
- v0.3.0 added count-agnostic primary + `CK.character.allDisplays` figure enumeration.
- v0.3.1 bounded body-mask capability to each part's real native mask ceiling and stopped awaiting HeroForge resource promises that can hang.

## Newly confirmed multi-figure lifecycle bug

The v0.3.1 multi-figure architecture correctly changes each extra figure's data and builds a new HeroForge-owned `resourceAtlas`, but root `CK.character.refresh()` / `character.update()` only calls `display.change(data)` on the root/primary display. It does not independently arm every extra display to consume its newly rebuilt resources.

Confirmed runtime/source evidence:

- root `character.refresh()` only sets `_needsUpdating=true`;
- root `character.update()` calls `e.display.change(e.data)` for the root display, then `e.display.update()` / `gatherChildren()`;
- after v0.3.1 three-figure reconcile, figure 2 (`baseItem`) could have display atlas 4096×2048 while its `modded.resourceAtlas` was 4096×4096;
- both extras had `data.needsDisplayUpdate=true` while `display.needsUpdate=false`;
- calling the extra display's own native `display.change(display.data, true)` immediately made its display atlas adopt the 4096×4096 resource atlas and set `display.needsUpdate=true`, with no direct atlas assignment; Bridge issue #1970;
- directly calling child `display.update()` is NOT a safe service seam: it threw inside HeroForge material handling (`Cannot read properties of undefined (reading 'clutPath')`); Bridge issue #1971. Do not repeat that path.

## Live-only v0.3.2 candidate — NOT COMMITTED

A candidate was hot-loaded through HF-Chat-Bridge only:

- VERSION `0.3.2`;
- BUILD `0.3.2-dev-extra-display-adoption`;
- after each non-primary `p.m.buildAtlas()` during reconcile, call the extra display's native `p.display.change(p.d, true)`;
- during restore, rebuild each non-primary native atlas and call `p.display.change(p.d, true)` so restored resources can be adopted through HeroForge's own display lifecycle;
- primary/root lifecycle remains unchanged;
- no direct atlas assignment, no texture-policy change, no 8192 forcing, no UI/persistence change.

This candidate fixed the original atlas split in the live three-figure scene: both extras reached coherent 4096×4096 display/resource atlas identity before settle. However, the test ran while the HeroForge tab was backgrounded, so HeroForge's child render/update loop did not finish. The single Enable eventually hit the existing 120s settle timeout.

Key Bridge evidence:

- #1969 — root `character.refresh/update` source proving root-only `display.change` orchestration;
- #1970 — safe extra-display `change(data, true)` probe adopted the new atlas and armed `needsUpdate`;
- #1971 — direct child `display.update()` probe failed; reject this seam;
- #1976 — clean pre-candidate reload baseline: all three displays finished/resources-ready, extras coherent at native 4096×2048, TQ OFF;
- #1985 — at-most-once v0.3.2 three-figure Enable request;
- #1986 / #1987 / #1988 / #1989 — background polling: extras coherent at 4096×4096 but child `finished=false` and/or `needsUpdate=true` while Enable remained running;
- #1990 — the one Enable completed false after settle timeout;
- #1991 — post-failure restore readback.

## CURRENT LIVE PAGE STATE — DO NOT ASSUME CLEAN

Last confirmed readback is Bridge #1991:

- root `CK.character._needsUpdating=true`;
- figure 2 `baseItem`: display atlas 4096×4096, resource atlas 4096×4096, `needsUpdate=true`, `finished=false`;
- figure 3 `baseItemB`: display atlas 4096×4096, resource atlas 4096×4096, `needsUpdate=true`, `finished=false`;
- therefore the failure/restore path is still pending native HeroForge display work while backgrounded;
- live service object is the hot-loaded v0.3.2 candidate, but the repository/manifest still contain v0.3.1;
- Persistent was explicitly OFF before this run.

Do NOT blindly replay Enable, Disable, reconcile, `display.change`, or any other mutation. Bridge mutations are at-most-once.

## Immediate next step in the new chat

1. Read `PROJECT_CONTRACT.md` and this file only, then inspect current service source if needed.
2. First action on runtime must be a NON-MUTATING readback of root scheduler + each extra display's `needsUpdate`, `finished`, resources-ready, display atlas and resource-atlas identity.
3. If the page still shows pending child work, have Amanda foreground the HeroForge tab and allow HeroForge's normal render loop to run, then read back again. Do not call child `display.update()` directly.
4. If the current page cannot return to a coherent finished state, perform one deliberate clean reload only after reading back state. Persistent is OFF, so reload should return to committed v0.3.1 OFF/native baseline; verify before any new mutation.
5. Re-hot-load or commit v0.3.2 only after the lifecycle candidate is source-reviewed and the page is clean. The key live gate is a FOREGROUND three-figure Enable: all three figures must finish, each display/resource atlas must be identical, verification must pass, and the root scheduler must be idle.
6. Validate Disable/restore for all three figures in foreground. Restore must finish coherently; native atlas dimensions need not equal the exact pre-enable dimensions if HeroForge legitimately repacks, but no stale TQ ownership or pending display work may remain.
7. If foreground v0.3.2 passes, make the normal runtime commit: source version/build + `manifest.json.moduleRegistry`/cache key + `CHANGELOG.md` + `PRE_FLIGHT_Check.md`, then syntax/static checks and exact live Dev regression.
8. Continue count-agnostic add/remove membership testing, then Seya-as-non-primary visual validation and a heavy non-primary case such as Twilight Soak if practical.
9. Stable remains untouched until explicit narrow promotion approval.

## Handoff note

This handoff update is documentation-only. It records the current runtime baton and does not change runtime code, manifest, module versions, public behavior, or Stable.