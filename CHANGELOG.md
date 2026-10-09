# Changelog

## Latest repository change — 2026-10-09

- **#111 experimental branch:** Decals v1.2.1 adds bounded live GPU color-atlas pixel readback comparison before/during/after a transient UV preview (aggregate pixel counts/checksums only, no image export). This addresses the first owner's unchanged visual result and discriminates real atlas refresh from invisible shader uniform edits. Existing preview remains opt-in, auto-reverted and save-safe; no Apply action.
- Tests: Node syntax and deterministic mocked GPU readback/rollback PASS. Live GPU and visual tests pending.
- No public/Stable changes.

## Latest Stable release context

Stable v2.4.3 retires Phase 1 notice; no #111 runtime is shipped publicly.
