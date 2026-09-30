# Current Pre-Flight

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-09-30 — #97 canonical Dev v1.15.6 corrective candidate

**PASS — immutable Dev candidate/static delivery gate; live corrective and human gates still required; NOT approved for Stable**

- Launcher v1.15.6 pins immutable payload `acb517b4848e47f9acf842c34fac4b6d737bf016`; its manifest carries matching launcher metadata and Bug Capture UI v0.4.3.
- Bug Capture UI v0.4.3 adds exact active-save `config_id` URL resolution, visible-report source-context preservation, missing contextual mappings, and stronger section-icon CSS without adding a second observer or preview refinement layer.
- Exact mapped sections: High Res Image Capture (Booth group), Spinny Mini WebP Capture, Texture Quality, and Utilities → Bug Capture. High Res Diagnostics is intentionally excluded because it is an internal Dev diagnostic surface without a distinct HF.Status registry feature.
- Active-save URL construction accepts only a numeric `CK.saves.activeConfig.config_id` and emits `https://www.heroforge.com/load_config%3D<ID>/`; the HeroForge root URL is never attached.
- `@name` remains `WITCH DOCK - DEV`, namespace remains `KnightWitch`, `@version`/`DEV_VERSION`/payload-manifest launcher version and build match, update/download URLs still target `WITCH_DEV_MAIN`, and JavaScript/JSON syntax checks pass.
- Canonical v1.15.5 exact-source Bridge regression and real capture/upload/report/HFBR/triage already passed for `HFBR-20260930-V4M8M2EA`. Exact v1.15.6 corrective Bridge regression and Amanda's final visual confirmation remain.
- The rejected preview v0.2.0 layer remains unused. The obsolete local preview loader must be disabled/removed before Amanda's final smoke. #59 remains capture-only, #89 remains follow-up-only, and Public Stable remains untouched.
- Feature-registry impact: **no registry impact**. Existing feature/group IDs remain canonical.
- Branch lifecycle: `wd/97-integrated-bug-reporter` remains `ACTIVE PROTECTED`; deletion queue remains empty.
