# Pre-Flight Check

## 2026-10-09 — #111 reversible shader-uniform UV preview, isolated task branch

- PASS: Registered protected branch wd/111-legacy-uv-preview; read current contract/router/branch policy and only affected code; no branch deletion or promotion.
- PASS: Source v1.2.0 and manifest registry synchronized; source-local version/build consistent; user UI is opt-in and includes no permanent Apply.
- PASS: JS syntax check and targeted deterministic VM test (two layers/single layer, inverse matrix, rejected invalid scale, exact original vector restoration after success/failure, saved character data unchanged).
- PASS: Current HeroForge D5 Bridge #4745 verifies RK.Vec2/Vec4, getBakeMeshes, atlasBaker.bakeAtlas/dilate and nonprojected native uniforms available. Isolated mock verification is NOT live shader/visual proof.
- PASS: HF.Status feature-registry checked: existing Decals tab/tool remains; new proposed subfunction needs feature-registry alignment before any release; #111 Dev-preview is not yet a reporter-facing public feature.
- HOLD: Real native atlas preview/revert, appearance, independent D4/Blood Moon validation, lifecycle, and user visual gate.
- Stable/public runtime unchanged; this branch is not installed by the canonical Dev launcher.
