# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.5 / `0.1.5-initial-coverage-race`.
- v0.1.3 removed renderer-signature polling in favor of reversible debounced live figure-data `change(...)` observation with Witch Dock-owned lifecycle suppression.
- v0.1.4 added a deferred initial coverage obligation for attach-during-core-busy, but live Counting Sheep exposed a queue/start race: UI refresh could enqueue `attach-ready`, clear the obligation, then core could become busy before the queued microtask entered `runCoverage()`; the run was correctly rejected but the obligation was lost.
- v0.1.5 makes `runCoverage()` the only code path allowed to consume the initial obligation, and only after its ready guards pass. Queue acceptance alone no longer consumes it.
- Regression reproduces the exact race: queue while ready, flip core busy before the microtask runs, verify the obligation remains, then verify one successful `attach-ready` pass after core settles and no duplicate runs under repeated refresh polling.
- Focused Texture Quality VM tests pass 19/19. Public Stable remains v2.4.2 and is unchanged.

## Latest Dev delivery context

Dev v1.17.5 / `1.17.5-initial-coverage-race` is paired to immutable payload `07c245f16c1a869d8b680bfef2859825e0c099a4`, containing all-part v0.1.5 / `0.1.5-initial-coverage-race`.
