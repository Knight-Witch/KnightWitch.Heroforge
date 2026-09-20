# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-20  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active release task:** issue #28  
**Release handoff:** `docs/HANDOFF_PUBLIC_PROMOTION_ISSUE_28.md`  
**Canonical Dev:** launcher v1.5.1 / payload `6603911658b426c6b95367697bedcc4c7acf67eb` — live PASS  
**Public RC:** `wd/28-public-rc` @ `95b5cdae4c8840d950d984c73bce101ba887011e` — static candidate, live gate pending  
**Public payload:** `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`  
**Public Stable:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4` — untouched  
**Rollback archive:** `archive/Witch_Scripts-pre-modular-20260920`

## Current phase

Issue #28 public RC live validation. Canonical Dev reconciliation/smoke and RC construction are complete. The exact public RC has not yet been executed under a faithful userscript privilege surface.

Read `docs/HANDOFF_PUBLIC_PROMOTION_ISSUE_28.md` before any release mutation.

## Immediate next step

Build a temporary isolated Public RC Host userscript with the same privileged grants needed by the public launcher, targeting exact `wd/28-public-rc/Witch_Dock.user.js`. Do not use HF-Chat-Bridge itself as the launcher host because its userscript lacks `GM_addStyle`, `GM_setClipboard`, and `GM_download`.

After RC live PASS, stop at Amanda's explicit Stable-promotion approval gate.

## Protected state

- Stable remains untouched until explicit approval.
- Do not resume #10.
- Keep Dev Auto Host v0.1.1 targeting `WITCH_DEV_MAIN`.
- Preserve RC/payload/rollback refs until Stable smoke + issue #14 cleanup.
- HF-Chat-Bridge remains development infrastructure only.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`
2. this file
3. `docs/HANDOFF_PUBLIC_PROMOTION_ISSUE_28.md`
4. issue #28
5. issue #14
6. only files directly required to build/test the temporary Public RC Host

Do not preload old #10 logs/history unless a specific discrepancy requires provenance.
