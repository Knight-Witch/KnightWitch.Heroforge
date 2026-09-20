# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-20
**Canonical Dev:** `WITCH_DEV_MAIN`
**Release status:** issue #28 COMPLETE — public modular v2.0.0 promoted and Stable-smoke validated
**Public Stable:** `Witch_Scripts` @ `95b5cdae4c8840d950d984c73bce101ba887011e`
**Public payload:** `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`
**Rollback archive:** `archive/Witch_Scripts-pre-modular-20260920` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`
**Canonical Dev launcher:** v1.5.1 / payload `6603911658b426c6b95367697bedcc4c7acf67eb`

## Current state

The issue #10 modular architecture is public and validated on actual Stable.

Stable smoke PASS:
- public launcher v2.0.0 / build `2.0.0-immutable-modular-bootstrap`;
- Core v2.0.0 running/UI ready;
- Loader v0.2.0: 23/23 fetched + executed, 0 failures;
- immutable resolution 23 / fallback 0;
- legacy monolith=false; legacy source transforms=false;
- exactly one Dock / compact shell / compact icon;
- temporary RC Host and Dev Auto Host absent from the Stable smoke page.

Canonical Dev parity check PASS:
- all promoted runtime/core/tool files are byte-identical between `WITCH_DEV_MAIN` and `Witch_Scripts`;
- all non-launcher moduleRegistry entries are synchronized;
- only the intentional issue #19 Dev channel identity/routing remains divergent;
- Dev Auto Host v0.1.1 still targets `WITCH_DEV_MAIN`.

## Next work

No release task is active. Do not resume issue #28 or issue #10.

Wait for Amanda's next explicit Witch Dock task/backlog selection. Consult an open issue only when that task is selected.

## Protected state

- Keep `wd/28-public-payload-2.0.0` reachable because public Stable pins its immutable commit SHA.
- Keep rollback archive `archive/Witch_Scripts-pre-modular-20260920` until a future explicit retention decision.
- Preserve issue #19 canonical Dev identity/routing.
- HF-Chat-Bridge remains development infrastructure only and never a Witch Dock runtime dependency.
