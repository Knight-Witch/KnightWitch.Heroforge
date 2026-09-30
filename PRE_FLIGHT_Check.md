# Current Pre-Flight

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-09-30 — #97 Dev v1.15.5 payload staging

**PASS — corrective payload staging/static gate; paired launcher commit still required; NOT approved for Stable**

- Bridge request `wd97-20260930-dev1154-smoke-001` failed with `getter_blocked`, proving the v0.4.1 accessor publication guard broke the Bridge's safe data-property path contract.
- Bug Capture UI v0.4.2 replaces that accessor with a configurable, non-writable data property. Canonical API reads/calls remain data-property based; a later stale v0.3 strict-mode assignment throws before the old script reaches `startContextualObserver()`.
- Staged `@version`/`DEV_VERSION`/manifest launcher version at v1.15.5 with build `1.15.5-issue-97-preview-data-guard`; identity and update/download URLs remain canonical Dev.
- Launcher and Bug Capture UI syntax parse; manifest/divergence JSON parse; source/registry/build/URL consistency checks pass.
- The rejected preview v0.2.0 layer remains unused; the temporary preview stays loader-sized. #59 remains capture-only, #89 remains follow-up-only, and Public Stable remains untouched.
- Feature-registry impact: **no registry impact**. Existing `bug-capture` and `script-status` IDs/ownership/placements remain canonical.
- Do not move `WITCH_DEV_MAIN` to this staging commit alone; create the paired launcher commit that pins this staging SHA, then move the canonical ref once.
- Branch lifecycle: `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty.
