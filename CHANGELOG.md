# Changelog

## Latest repository change — 2026-10-07

- #107 adds the source for a bounded reversible `beta-channel-smoke` module plus focused Beta Tester regression coverage.
- The smoke module mutates no HeroForge/Witch Dock feature state; it exposes activation/deactivation counters and one local UI smoke marker through bounded Beta diagnostics.
- This source-staging commit does not assign the module in the moving Beta manifest. A following manifest revision will pin this exact immutable commit.
- High Res Phase 2 is intentionally not staged yet: Stable lacks two #25 lifecycle/ownership fixes present in Dev, so raw all-part v0.1.12 over Stable would not reproduce the validated Dev stack.
- No runtime/module manifest/public Stable behavior changed in this source-staging commit.

## Latest Dev delivery context

Canonical Dev remains v1.17.13 / `1.17.13-public-beta-channel`, paired to immutable payload `8b92fc76f6ed6715b103d026338da5b0694d5a21`. Public Stable remains v2.4.2 unchanged.
