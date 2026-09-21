# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-21
**Canonical Dev:** `WITCH_DEV_MAIN`
**Release status:** issue #28 COMPLETE — public modular v2.0.0 promoted and Stable-smoke validated
**Public Stable:** `Witch_Scripts` @ `95b5cdae4c8840d950d984c73bce101ba887011e`
**Public payload:** `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`
**Rollback archive:** `archive/Witch_Scripts-pre-modular-20260920` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`
**Canonical Dev launcher:** v1.5.1 / payload `6603911658b426c6b95367697bedcc4c7acf67eb`

## Current state

No active Witch Dock maintenance task.

Branch retirement is complete: exactly six required branches remain after the 49-ref cleanup. Issue #13 is complete; issue #11's migration/cleanup gate is complete. The legacy audit/harvest record remains at `docs/BRANCH_CLEANUP_HANDOFF_2026-09-20.md`.

## Next work

Wait for Amanda's next explicit Witch Dock task/backlog selection. Consult an open issue only when that task is selected.

## Protected state

- Keep `Witch_Scripts` as public Stable.
- Keep `WITCH_DEV_MAIN` as canonical Dev.
- Keep `archive/Witch_Scripts-pre-modular-20260920` as the pre-modular Stable rollback.
- Keep `wd/28-public-payload-2.0.0` and `wd/payload-1.5.1` because public Stable and canonical Dev pin their immutable commits.
- Keep `wd/dev-auto-host` as operational Dev infrastructure.
- Preserve issue #19 canonical Dev identity/routing.
- HF-Chat-Bridge remains development infrastructure only and never a Witch Dock runtime dependency.
