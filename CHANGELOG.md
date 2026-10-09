# Changelog

## Latest repository change — 2026-10-09

- **#111 experimental branch:** Decals v1.2.3 preserves the actual native gradient palette vector contract: three RGB Vec3 values followed by one RGBA Vec4. The prior contrast test used Vec4 for each, and live HeroForge v1.2.2 correctly refused mismatched palette shape without editing user data.
- Tests: native RGB/RGBA shape mock, vivid GPU pixel comparison and exact restoration of palette identities, UV uniforms, cache/pixels, and saved coordinates PASS. Real live high-contrast proof still pending.
- No Stable/public changes.

## Latest Stable release context

Stable v2.4.3 has no #111 runtime.
