# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-24  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Active task:** issue #24 — **HR ON/OFF body visual paint tint change** (REOPENED / failed broader Stable smoke)  
**Separate active bug:** issue #32 — **HR body paint zone collapse**  
**Public Stable:** v2.0.2 / `Witch_Scripts` @ `1b7d45bad6a602ffe6a39d9457b64f7daeca72d8`  
**Public immutable payload:** `fa442b99a7376aa31882f66fd20ae8cded32fe67`  
**Canonical Dev launcher:** v1.5.4 / payload `6aee7fd8716d986e39b7415cf8927fa7043e776b`  

## Current route

Issue #24 is classified as a stale body color-bake cache after ON→OFF native restore. Dev candidate v0.3.7 forces the bounded native color-bake cache refresh that restored Quinn's body outputs byte-for-byte; integrated live Quinn/D4 validation is next. Do not close it.

Primary handoff:
`docs/investigations/ISSUE_24_REOPEN_HANDOFF_2026-09-24.md`

The highest-value new evidence is the High Res resource-failure family on current HeroForge `heroforge08.1.10.5`: Witch Dock can fail an assumed 1024 body mask preload, while High Res policy triggers native 2048 mask/AAID/normal requests that 404. Determine whether invalid source-resolution assumptions create the fallback/partial generation that later fails restore/adoption and visibly changes body tint.

Amanda is restarting Chrome/PC. First clean pass after restart:
- Dev only;
- Bridge runtime/workbench;
- 2000 Kitbash Parts only if needed for Quinn;
- Core Tweaks and all unrelated texture/helper scripts OFF;
- Quinn A/B/C (OFF -> ON -> OFF), then D4 control.

## Release state

Public v2.0.2 is already merged but its final Stable smoke did not pass. Release janitorial cleanup is therefore **paused**:
- do not close #24;
- do not delete `wd/24-public-2.0.2`;
- do not perform another Stable mutation until a corrected Dev candidate passes the required Quinn/D4/control gates.

## Scope boundary

#32 — **HR body paint zone collapse** remains separate. Do not merge body-zone-collapse diagnosis/fix into #24.

HF Core Tweaks' independent console flood remains separate issue #29 and should be disabled during #24 diagnostics.

## Protected state

- Keep `Witch_Scripts` public Stable.
- Keep `WITCH_DEV_MAIN` canonical Dev.
- Keep rollback/protected branches listed by project contract.
- HF-Chat-Bridge remains development infrastructure only and never a Witch Dock runtime dependency.
