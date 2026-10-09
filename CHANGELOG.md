# Changelog

## Latest repository change — 2026-10-09

- **Dev-only #111 compatibility:** Decals v1.2.3 uses the actual native shader gradient palette vector array (3×Vec3 RGB + 1×Vec4 RGBA). The previous live v1.2.2 high-contrast preview refused a wrongly assumed all-Vec4 structure and restored uniformly. v1.2.3 preserves original palette refs and saved UV decals across previews and revert.
- Dev launcher v1.17.20 prepared; immutable payload 34afdcca8748f6a1920e6b9619f201cd181bf558 pinned. JS syntax and simulated native Vec3/Vec4 contrast/readback/restore tests PASS. Real GPU visual test pending; previous no-visible-change result remains FAIL.
- No permanent Apply or Stable/public change.

## Latest Stable release context

Stable v2.4.3 does not include #111.
