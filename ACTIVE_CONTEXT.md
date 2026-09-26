# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-26 UTC
**Canonical Dev:** `WITCH_DEV_MAIN` v1.10.3 / immutable payload `a0fe5d89777877c90b2e5ffd7e17bb92f68d3abc`
**Public Stable:** `Witch_Scripts` v2.3.1 / immutable payload `50405ca027e28227123f475c488538d214644b0d`
**Open product bug:** #34 — HR false restore warning / native body mask verification

## Current route

Issues #58 (Polymorph/header/UI consistency) and #83 (reusable notification / update alert) are publicly released together. Amanda approved the visual layout and authored popup copy; v2.3.1 adds an explicit instruction to remove the old Witch Dock v2.2.2-or-earlier Tampermonkey entry after installing the latest version. Its new notice ID allows old-wrapper users who saw the first notice to see this correction once. The trigger compares `KWWitchDockStableHost.getState().installedWrapperVersion` against 2.3.0; current wrappers suppress it. Public update action is the canonical raw `Witch_Scripts/Witch_Dock.user.js` URL.

Live Stable smoke passed on installed wrapper v2.3.0 self-hosting v2.3.1: public head `327053785876bb8c7cd0a45876bc86c9b693c108` at test, loader 25/25 executed, zero failures/fallbacks, Release Notices v0.2.2. Documentation-only Stable head subsequently advanced to `303c56806d74b18338f866f601b904010356bf52`. Dev now mirrors the promoted shared runtime byte-for-byte and keeps #35 diagnostic capture/UI/service seam intentionally Dev-only; #19 owns channel routing. The prior acknowledgement/no-repeat gate was not replayed.

## Remaining release janitorial step

The GitHub connector cannot delete refs. `docs/BRANCH_DELETION_HANDOFF_ISSUE_83_2026-09-26.md` contains the exact mechanical deletion for 27 temporary #58/#83 branches, the complete KEEP inventory, reachability/classification evidence, and a paste-ready Work instruction. Issue #14 tracks its execution. Do not re-audit or delete unrelated branches unless live state contradicts the handoff. After deletion, verify inventory, mark the handoff complete, remove this temporary note, and record documentation-only closeout.

## Other boundaries

- #32 HR body paint zone collapse remains complete on Stable; #34 remains separate.
- #35 High Res diagnostics remain Dev-only, with Texture Quality Native Reconcile v0.4.1 and diagnostic service/UI. Stable Texture Quality remains v0.3.8.
- #42 is a later Developer Mode/module-version-display cleanup.
- HF-Chat-Bridge is development infrastructure only and never a Witch Dock runtime dependency.
- Existing #32/#35/#37/#41 branch deletion handoffs remain separate. `wd/dev-auto-host` is persistent infrastructure and must be kept.
