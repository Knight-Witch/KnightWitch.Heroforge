# Pre-Flight Check

## 2026-10-09 — #111 experimental UV preview Dev integration

- PASS: Canonical Dev bootstrap, branch registry/queue, source, module versioning, runtime delivery and Dev workflow followed. Task branch wd/111-legacy-uv-preview remains protected until human visual acceptance.
- PASS: Isolated `Decals.js` v1.2.0 and targeted regression test: pure transformation, two-layer/single-layer, invalid inputs, uniform restoration on success/failure, no saved character data edits.
- PASS: Live baseline read-only Bridge #4735, #4745, #4746 verified D5 part, UV shader material indices, RenderKit vector types, atlas methods and exact circle IDs/mappings.
- PASS: Dev launcher v1.17.17 @version/DEV_VERSION/DEV_BUILD synchronized with manifest; one immutable payload 4d25fcd for launcher/core/modules; no new external API grants or delivery endpoints.
- HOLD: New launcher not yet reloaded/live-smoke verified. Shader-only preview visible atlas and full rollback need Bridge and visual acceptance. Do not describe as confirmed correction.
- NOTE: Existing High Res restore warning #34 occurred during prior HR OFF test; an unbiased clean-load baseline is required for visual proof.
- NOTE: Existing Decals-tab reporter feature ID remains; new permanent functionality requires HF.Status feature-registry follow-up before public promotion.
- Stable/public runtime unchanged; no permanent native decal save migration exists in this Dev preview.
