# Pre-Flight Check

## 2026-10-06 — #25 all-part High Res v0.1.8 detail-pressure priority

- PASS: existing ACTIVE PROTECTED `wd/25-texture-coverage` remains the sole #25 task branch and is fast-forwarded through canonical Dev v1.17.7.
- PASS: v0.1.7 live Counting Sheep is healthy at core High Res ON with one all-part attach-ready pass, 45 selected bindings, 7 downgrades, 29 skips, zero failures, and no self-loop.
- CONFIRMED GAP: accepted Corvidae Herald pauldrons `k_23/k_25` still bind 128px normals and occupy 128×128 atlas regions; Celestial Circlet is also skipped.
- PASS: both groups report current source 128, verified source ceiling 512, desired 512, no native-packing rejection, and only coarse display-budget exhaustion with 29,440 pixels remaining.
- PASS: runtime metadata supplies intrinsic mesh complexity: the accepted pauldrons expose 69,996 `facesHiRez` versus 2,778 on a competing large shield control.
- PASS: v0.1.8 resolves source ceilings before ranking and scores `facesHiRez`/faces per current effective normal texel, amplified by verified source/effective-detail gain; intrinsic ideal metadata and repeat count remain tie-breakers.
- PASS: zero-benefit groups score zero; verified higher-source/effective-detail headroom is required to retain priority.
- PASS: detached native `CK.Atlas` preflight remains final density admission authority and may downgrade/skip any candidate that would shrink a baseline host.
- PASS: v0.1.7 OFF→ON re-arm, exact owned rollback, outside-edit preservation, readiness, and anti-loop behavior remain covered.
- PASS: full gates pass: all-part VM 18/18, inherited ownership 4/4 (22/22 combined), runtime-delivery 12/12, module syntax, manifest/divergence consistency, and `git diff --check`.
- PASS: issue-branch checkpoint is committed at `75ba55f93ced0b67ac6ec90687771f87b182b864` and integrated into canonical Dev.
- PASS: Dev launcher header/runtime and manifest registry are prepared at v1.17.8 / `1.17.8-detail-pressure-priority`; prior payload pin is intentionally retained until the candidate commit exists.
- PASS: Dev launcher pins exact immutable v1.17.8 payload candidate `d579ca8981ad1bb0dbe7a434e7d7e36a5b3630eb`; candidate manifest contains all-part v0.1.8 / `0.1.8-detail-pressure-priority`.
- PENDING: verify recovery parity, then Counting Sheep pauldrons/circlet + OFF→ON + anti-loop revalidation.
- No Stable/public promotion is authorized or performed.
