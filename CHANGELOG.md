# Changelog

## Latest repository change — 2026-10-07

- #25 follows the r4 safe rollback with an exact native-shadow packing preflight.
- r4 v0.1.13 removed the original false detached veto, but the real HeroForge rebuild then triggered the unchanged collateral guard and rolled back to Stable. This proved that forcing observed live floors into the detached model was too permissive.
- All-part v0.1.14 / `0.1.14-native-shadow-preflight` now calls the live display's own `buildAtlas` method against a detached shadow object, preserving HeroForge's private minimum-size/reference closure without mutating the live figure.
- Direct `CK.Atlas` remains only a bounded fallback when no native builder result is available.
- The real post-rebuild collateral detector and exact rollback remain unchanged.
- Stable-compatible Beta wrapper is v0.1.2 / `0.1.2-native-shadow-preflight`.
- Focused all-part/ownership/Beta suites pass 42/42.
- Public Stable and manifest r4 remain unchanged until this new immutable payload is committed.

## Latest Dev delivery context

Next gate: commit the immutable v0.1.14/v0.1.2 package, stage manifest r5 default-OFF, then controlled Counting Sheep live proof. No Stable promotion is authorized.
