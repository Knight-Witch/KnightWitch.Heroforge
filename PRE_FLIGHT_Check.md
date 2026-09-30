# Current Pre-Flight

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-09-30 — #97 Dev v1.15.4 payload staging

**PASS — payload staging/static gate; paired launcher commit still required; NOT approved for Stable**

- Live Bridge request `wd97-20260930-dev1153-smoke-001` proved Dev v1.15.3 resolved immutable payload `b69e21d700423fb2ce0588cc854d6c96c7b6ebf2` with 36/36 modules executed, zero fallback resolutions, and zero failures.
- The same readback proved the local loader-sized preview transport subsequently republished reporter v0.3.0 over canonical v0.4.0. Bug Capture UI v0.4.1 adds a version-aware global publication guard so lower versions cannot replace the canonical API.
- Staged `@version`/`DEV_VERSION`/manifest launcher version at v1.15.4 with build `1.15.4-issue-97-preview-downgrade-guard`; identity and update/download URLs remain canonical Dev.
- Launcher and Bug Capture UI syntax parse; manifest and divergence JSON parse; source/registry/build/URL consistency checks pass.
- The rejected preview v0.2.0 layer remains unused; the temporary preview stays loader-sized. #59 remains capture-only, #89 remains follow-up-only, and Public Stable remains untouched.
- Feature-registry impact: **no registry impact**. Existing `bug-capture` and `script-status` IDs/ownership/placements remain canonical.
- Do not move `WITCH_DEV_MAIN` to this staging commit alone; create the paired launcher commit that pins this staging SHA, then move the canonical ref once.
- Branch lifecycle: `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty.
