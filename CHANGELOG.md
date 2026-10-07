# Changelog

## Latest repository change — 2026-10-07

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.12 / `0.1.12-independent-normal-headroom`.
- Live v0.1.11 on Counting Sheep confirmed Amanda's visual comparison: Witch Dock improved the scene but still left the lion torque and Corvidae Herald pauldrons on 256x256 normals/allocations and all six Celestial Circlet hosts on 128x128 normals/allocations, below the prior 512 visual control.
- This is not a missing-resource problem. The 512 normal variants are valid, and the prior bounded causal probe established that replacing the displayed normal maps with verified 512 variants produced the accepted sharpness without independently requiring Lob's global pixels-per-unit/output-size/giant-atlas patches.
- v0.1.12 separates those two channels. Highest verified normal-map source headroom can bind directly to the rendered material even when the bounded atlas-density planner cannot safely enlarge the paint/mask rectangle. Atlas density remains under the existing 32 MP ceiling, marginal-value selection, repeated-family atomicity, and detached native `CK.Atlas` no-collateral proof.
- The change preserves pass-scoped negative caching, clean `_usedTextureSize` restore ordering, exact ownership/outside-edit preservation, OFF->ON re-arm, event-driven observation, body/face separation, and failure isolation.
- Focused all-part + ownership regression suite passes 28/28. New coverage proves a 128->512 normal source can bind with a completely exhausted atlas-density budget while `atlasScale`, `_usedTextureSize`, and the 128x128 allocation remain untouched.
- Feature-registry impact: none. No fixture/item/category allowlist, blanket scale multiplier, CreationKit global patch, or Stable/public change is introduced.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev launcher v1.17.12 / `1.17.12-independent-normal-headroom` is prepared with all-part v0.1.12. The prior payload pin is intentionally retained only until this payload-candidate commit has an immutable SHA; the following pairing commit will pin that exact candidate.
