# Current Pre-Flight

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-09-30 — #97 canonical Dev v1.15.6 corrective live gate

**PASS — static and live corrective gates; Amanda's final visual/interaction confirmation remains; NOT approved for Stable**

- Launcher v1.15.6 pins immutable payload `acb517b4848e47f9acf842c34fac4b6d737bf016`; Bug Capture UI is v0.4.3 / `0.4.3-contextual-action-corrections`.
- Exact-source Bridge request `wd97-20260930-dev1156-smoke-001` confirmed 36/36 immutable module resolutions, zero fallback, zero failure, and the expected launcher/module identities.
- Exactly one contextual bug action exists for High Res Image Capture, Spinny Mini WebP Capture, Texture Quality, and Utilities → Bug Capture. High Res Diagnostics correctly has none because it is an internal Dev diagnostic surface without a distinct registry feature.
- Computed icon checks returned 28×28 pixels, transparent background, zero border, and `kwWDDragHandle` as the next sibling.
- Source-context guard request `wd97-20260930-source-context-guard-001` opened Body Editor → Butt Mirror, attempted a second Utilities → Bug Capture launch, and retained the original timestamp/product/group/tool/feature plus the original editable classification.
- Save-link request `wd97-20260930-save-link-exact-003` returned the exact expected `https://www.heroforge.com/load_config%3D59237060/`. Earlier live inspection independently confirmed `CK.saves.activeConfig.config_id = 59237060` after HeroForge had rewritten the visible route to `/`.
- The earlier real capture/upload/report/HFBR/exact-triage E2E remains passed for `HFBR-20260930-V4M8M2EA`; these corrective changes did not require a duplicate backend submission.
- JavaScript/JSON static identity checks remain passed. Feature-registry impact: **no registry impact**.
- The obsolete local preview loader must be disabled/removed before Amanda's final smoke; its alert is the expected failure of the rejected lower-version preview assignment, not a canonical Dev boot failure.
- #59 remains capture-only, #89 remains follow-up-only, Public Stable remains untouched, `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`, and the deletion queue remains empty.
