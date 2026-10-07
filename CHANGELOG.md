# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.9 / `0.1.9-progressive-budget`.
- Live v0.1.8 Counting Sheep is safe and materially improved: 60 active bindings, three downgrades, 27 skips, zero failures. The accepted Corvidae Herald pauldrons `k_23/k_25` now select their verified 512 normal source.
- Celestial Circlet remained a verified 128→512 candidate with no native-packing rejection but was still skipped on display budget.
- Runtime evidence isolated the remaining starvation mechanism: tiny 32/64px accessories could take their maximum 512 target in one greedy step, consuming most of the primary display budget before the six-host 128px circlet group was considered.
- v0.1.9 preserves detail-pressure ranking, source verification/cache behavior, repeated-family atomicity, exact ownership/rollback, OFF→ON re-arm, event-driven observation, and detached native `CK.Atlas` no-collateral preflight. Budget spending is now progressive: each eligible group receives at most one successful resolution step per round before any group advances again.
- The new constrained regression models five repeated 32px hosts versus six repeated 128px hosts under a shared budget. The 128px group reaches its verified 512 target while the tiny family is downgraded rather than consuming the entire budget first.
- Full gates pass: all-part VM 19/19 plus inherited ownership 4/4 (23/23 combined), runtime-delivery 12/12, manifest/divergence consistency, module syntax, and git diff checks.
- Feature-registry impact: none. This changes internal selection/budgeting inside the existing Texture Quality provider/service; no feature ID, path ownership, tab/group, or reporter-facing routing changes.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev v1.17.9 / `1.17.9-progressive-budget` payload candidate is being prepared from the validated v0.1.9 tree. The launcher intentionally retains the prior v1.17.8 payload pin until the candidate commit exists.
