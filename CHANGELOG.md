# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.7 / `0.1.7-native-ideal-priority`.
- Live v0.1.6 Counting Sheep passed deterministic native-packer selection: one `attach-ready` pass retained 38 active bindings, 7 deliberate downgrades, 33 skips, zero failures, and no error. The exact run timestamp stayed unchanged across the prior self-loop recurrence window.
- Counting Sheep OFF restored all 83 all-part-owned normal/atlasScale/observed-used entries with `restored=true`, `outside=false`. Core then reported the existing bodyLower restore warning tracked separately by #34; #25 did not broaden into that defect.
- Re-enabling core High Res exposed a #25 lifecycle gap: core returned healthy ON, but all-part stayed inactive because OFF had not re-armed the initial coverage obligation.
- v0.1.7 re-arms one coverage obligation whenever core is disabled, so the next settled ON receives exactly one all-part pass.
- v0.1.7 also ranks scarce-budget groups by HeroForge intrinsic ideal-texture metadata before repeat count and deficit. This prevents already-large low-intrinsic-detail allocations from receiving priority merely because they are already large, while retaining the v0.1.6 detached native `CK.Atlas` no-collateral preflight.
- Full gates pass: all-part VM 18/18, inherited Texture Quality ownership 4/4 (22/22 combined), runtime delivery 12/12, syntax, manifest/divergence consistency, and git diff checks.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev v1.17.7 / `1.17.7-native-ideal-priority` payload candidate is being prepared from the validated v0.1.7 tree. The launcher intentionally retains the prior v1.17.6 payload pin until the candidate commit exists.
