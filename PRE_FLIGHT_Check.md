# Pre-Flight Check

## 2026-10-09 — #111 live GPU pixel-diagnostic integration

- PASS: Canonical contract/context, #111 task branch, source and native HeroForge color atlas pipeline inspected.
- PASS: v1.2.1 Decals module and v1.17.18 Dev launcher source/manifest registry versions and builds synchronized; immutable payload pin to be added as the next release-stage commit.
- PASS: JS syntax and deterministic mock GPU readback test: pixel change during UV preview, zero pixel difference after revert, existing shader uniform object restored and figure JSON unaltered.
- PASS: Live Bridge #4766–#4767 verified both D5 circle layers active and successful uniform updates; Amanda reports NO visible motion, therefore no correction accepted. Live #4769–#4772 confirmed decal uniforms participate in native getKey and renderer display material references the color atlas.
- HOLD: GPU pixel comparison in the real HeroForge session is required, followed by owner visual test only after mechanism is verified. Existing High Res #34 restore defect remains separate.
- PASS: Existing `wd-decals` feature-registry ID is still the affected Decals tool, no public/reporter taxonomy change published. No permanent migration or user-save mutation.
- Public Stable remains unchanged.
