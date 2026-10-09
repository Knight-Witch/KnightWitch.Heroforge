# Changelog

## Latest repository change — 2026-10-09

- **Dev-only #111 diagnostics after failed human visual preview:** Decals v1.2.1 adds a bounded GPU color atlas pixel readback discriminator. First two-layer preview did alter native uniforms, but Amanda visually observed no movement. The diagnostic snapshots only torso color pixels and returns aggregate changes across preview/revert; no raw texture exported or saved decals modified. Dev launcher v1.17.18 will pin this module at one immutable commit.
- JS syntax, bounded mock readback/rollback checks passed. Live GPU pixel proof and human visual correction are NOT validated.
- Stable/public runtime unchanged; no permanent migration Apply exists.

## Latest Stable release context

Stable v2.4.3 retired Phase 1 notice; no #111 runtime is publicly shipped.
