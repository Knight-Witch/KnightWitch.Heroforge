# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.6 / `0.1.6-native-packing-preflight`.
- Live v0.1.5 Counting Sheep performed exactly one deferred `attach-ready` pass and did not self-loop, but the area-only planner drove the primary 8192×4096 display to effectively full occupancy. HeroForge then globally reduced many selected and unselected allocations; the existing no-collateral verifier correctly rolled the pass back.
- Runtime source confirms current native `modded.buildAtlas()` delegates to `new CK.Atlas(parts, undefined, undefined, undefined, data.isUHD(), data.atlasScale)`. `CK.Atlas` reduces a global packing factor in 0.05 steps until the pack fits, so summed rectangle area is not a sufficient predictor of safe native packing.
- v0.1.6 keeps the fast area budget as a coarse filter, then preflights every prospective density selection through a detached native `CK.Atlas` using the exact current parts/UHD/scales. A candidate is accepted only when every baseline allocation survives and every selected host reaches its requested target within the existing 32 MP owned ceiling.
- Unsafe higher targets are downgraded or skipped before any live mutation. Source-only promotions remain independent of the density preflight.
- Focused Texture Quality VM tests pass 20/20, including a native-packer regression where 512 would shrink an unrelated host but 256 is selected safely with no live-state mutation. Inherited runtime-delivery tests pass 12/12.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev v1.17.6 / `1.17.6-native-packing-preflight` payload candidate is being prepared from the validated v0.1.6 tree. The launcher intentionally retains the v1.17.5 payload pin until that candidate commit exists.
