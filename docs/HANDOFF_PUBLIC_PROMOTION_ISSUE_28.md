# Handoff — Issue #28 Public Modular Promotion

**Status:** COMPLETE
**Completed:** 2026-09-20
**Public Stable:** `Witch_Scripts` @ `95b5cdae4c8840d950d984c73bce101ba887011e`
**Exact tested RC:** `wd/28-public-rc` @ `95b5cdae4c8840d950d984c73bce101ba887011e`
**Immutable public payload:** `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`
**Rollback archive:** `archive/Witch_Scripts-pre-modular-20260920` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`

## Final validation

The isolated public RC passed runtime and Amanda's human visual gate before promotion.

The public branch was then moved by non-forced fast-forward to the exact tested RC commit. Immediate GitHub readback confirmed `Witch_Scripts` and `wd/28-public-rc` were identical.

Actual public Stable browser smoke then passed:
- normal public userscript only; RC Host absent; Dev Auto Host absent;
- launcher v2.0.0 / stable / `Witch_Scripts`;
- Core v2.0.0 running/UI ready;
- Loader v0.2.0 with 23/23 fetched + executed and 0 failures;
- immutable resolution 23 / fallback 0;
- immutable payload `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`;
- legacy monolith=false; legacy source transforms=false;
- one Dock / one compact shell / one compact icon.

## Post-release reconciliation

- Promoted runtime/core/tool files are byte-identical between `WITCH_DEV_MAIN` and Stable.
- Non-launcher moduleRegistry entries are synchronized.
- `DEV_DIVERGENCES.json` no longer tracks issue #28; only intentional issue #19 canonical Dev identity/routing remains.
- Dev launcher v1.5.1 and Dev Auto Host v0.1.1 still route to `WITCH_DEV_MAIN`, never Stable.
- The public payload ref must remain reachable because Stable pins that immutable commit.
- The pre-modular rollback archive remains preserved.

Issue #28 must not be resumed as active work.
