# Current Pre-Flight

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-09-30 — #97 canonical Dev v1.15.5 candidate

**PASS — immutable Dev candidate/static delivery gate; live Dev and human gates still required; NOT approved for Stable**

- Launcher v1.15.5 pins immutable payload `87bbad3d6c652287f45d1b8eec4174fff1302d52`; its manifest carries matching launcher metadata and Bug Capture UI v0.4.2.
- `@name` remains `WITCH DOCK - DEV`, namespace remains `KnightWitch`, `@version`/`DEV_VERSION`/payload-manifest launcher version and build match, and update/download URLs still target `WITCH_DEV_MAIN`.
- Launcher and Bug Capture UI syntax parse; manifest/divergence JSON parse; source/registry/build/URL consistency and payload existence checks pass.
- The v0.4.2 global is a configurable, non-writable data property: Bridge path traversal is preserved and a later strict-mode v0.3 assignment aborts before `startContextualObserver()`.
- The rejected preview v0.2.0 layer remains unused and the temporary preview remains loader-sized. #59 remains capture-only, #89 remains follow-up-only, and Public Stable remains untouched.
- Feature-registry impact: **no registry impact**. Existing `bug-capture` and `script-status` IDs/ownership/placements remain canonical.
- Exact v1.15.5 launcher/payload/loader regression, real capture/upload/report/HFBR/triage, and Amanda's final visual/interaction confirmation remain.
- Branch lifecycle: `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty.
