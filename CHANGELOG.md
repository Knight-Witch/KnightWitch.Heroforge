# Changelog

## Latest repository change — 2026-10-07

- #107 Beta manifest revision 2 assigns the reversible `beta-channel-smoke` module for live Public Stable smoke testing.
- Module source is pinned to immutable payload `fc758733f445624b39797fc8edef91e130627237`; no moving branch source is executed.
- The smoke module exercises registration, activation/deactivation, module UI, bounded diagnostic state, and contextual Beta reporting without mutating HeroForge/Witch Dock feature state.
- High Res Phase 2 remains intentionally unstaged because Stable v2.4.2 lacks two #25 lifecycle/ownership fixes already present in Dev; raw all-part v0.1.12 would be an ambiguous Beta test.
- Public Stable code is unchanged.

## Latest Dev delivery context

Canonical Dev remains v1.17.13 / `1.17.13-public-beta-channel`, paired to immutable payload `8b92fc76f6ed6715b103d026338da5b0694d5a21`. Beta assignment is additive over normal Stable.
