# Pre-Flight Check

## 2026-10-06 — #25 all-part High Res v0.1.10 intrinsic floor + premium headroom

- PASS: existing ACTIVE PROTECTED `wd/25-texture-coverage` remains the sole #25 task branch and is integrated through canonical Dev v1.17.9.
- PASS: live v0.1.9 Counting Sheep reports 91 active bindings / 23 downgrades / 12 skips / 0 failures, with core High Res healthy across two figures.
- CONFIRMED QUALITY GAP: both accepted Corvidae Herald pauldrons and all six Celestial Circlet hosts are actually bound to shared 256 normals and packed at 256×256 under v0.1.9. This does not meet the accepted 512 source+allocation control.
- PASS: live diagnostics isolate pauldrons 512 as blocked by detached native packing and circlet 512 as blocked by remaining display budget; neither is a missing-source failure.
- PASS: v0.1.10 adds a two-phase allocator. Intrinsic-floor phase advances each group only toward the next power-of-two covering HeroForge native ideal; premium-headroom phase then considers remaining verified headroom in descending native-ideal order.
- PASS: tiny/accessory behavior stays generic and bounded. Regression proves native ideal 55→64 while circlet-like ideal 184→256, with the circlet-like group ordered ahead for premium headroom.
- PASS: repeated groups remain atomic; every prospective density step retains detached native `CK.Atlas` no-collateral verification before mutation.
- PASS: existing source-resolution positive/negative caching, shared textures by URL, exact rollback/outside-edit preservation, body/face ownership, OFF→ON re-arm, event-driven change observation, failure isolation, and disposal contracts are unchanged.
- PASS: full gates pass: all-part 20/20 + ownership 4/4 (24/24 combined), runtime-delivery 12/12, manifest/divergence consistency, module syntax and git diff check.
- PASS: feature-registry impact = none; no feature identity/path/ownership/tab/routing change.
- PASS: issue-branch checkpoint is committed/pushed at `8e0c704bad8b08842b5585d27841d81a4e64c42f` and fast-forward integrated into canonical Dev locally.
- PASS: Dev launcher header/runtime and manifest launcher registry are prepared at v1.17.10 / `1.17.10-intrinsic-floor-headroom`; the prior payload pin is intentionally retained until the payload candidate commit exists.
- PENDING: pin the exact candidate SHA and verify recovery parity, then Counting Sheep exact 512 source+allocation proof followed by OFF→ON/anti-loop and remaining fixture/lifecycle matrix.
- No Stable/public promotion is authorized or performed.
