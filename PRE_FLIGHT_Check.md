# Current Pre-Flight

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-09-30 — #97 canonical Dev v1.15.4 candidate

**PASS — immutable Dev candidate/static delivery gate; live Dev and human gates still required; NOT approved for Stable**

- Launcher v1.15.4 pins immutable payload `b3e1a58502468187a75a1865b0e4abca90d315c9`; its manifest carries matching launcher metadata and Bug Capture UI v0.4.1.
- `@name` remains `WITCH DOCK - DEV`, namespace remains `KnightWitch`, `@version`/`DEV_VERSION`/payload-manifest launcher version and build match, and update/download URLs still target `WITCH_DEV_MAIN`.
- Launcher and Bug Capture UI syntax parse; manifest and divergence JSON parse; source/registry/build/URL consistency, payload existence, and changed-file whitespace checks pass.
- Live v1.15.3 evidence proved the loader resolved 36/36 immutable modules with zero fallback/failures and isolated the remaining stale preview downgrade; v1.15.4 contains the version-aware publication guard.
- The rejected preview v0.2.0 layer remains unused and the temporary preview remains loader-sized. #59 remains capture-only, #89 remains follow-up-only, and Public Stable remains untouched.
- Feature-registry impact: **no registry impact**. Existing `bug-capture` and `script-status` IDs/ownership/placements remain canonical.
- Exact v1.15.4 launcher/payload/loader regression, real capture/upload/report/HFBR/triage, and Amanda's final visual/interaction confirmation remain.
- Branch lifecycle: `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty.
