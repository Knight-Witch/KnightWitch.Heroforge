# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.4 / `0.1.4-deferred-initial-coverage`.
- v0.1.3 removed renderer-signature polling and replaced it with a reversible debounced observer on live figure-data `change(...)`, with Witch Dock-owned native lifecycle calls suppression-scoped.
- First live v0.1.3 Counting Sheep sample proved the loop was gone but exposed a bootstrap gap: when the module attached while core High Res was already busy/enabled, all-part remained `idle` with `activeBindings=0` and never performed its initial coverage pass.
- v0.1.4 adds one deferred initial-coverage obligation. If attach occurs while core is busy, the first settled 250 ms refresh queues exactly one `attach-ready` coverage pass; any actual coverage entry clears the obligation at the single `runCoverage()` boundary.
- After the initial pass, refresh remains observational except for flushing debounced outside `data.change()` signals. Repeated refresh polling cannot re-run coverage without an actual outside change.
- Focused Texture Quality VM tests pass 19/19, including deferred attach-ready bootstrap, no duplicate initial pass, external-change debounce, owned-change suppression, figure observer replacement, failure isolation, and exact rollback.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Canonical Dev v1.17.3 / `1.17.3-data-change-observer` currently pins immutable payload `7fd83e93ce2b615c02ec42e7df1e4ed10ee657b4` containing all-part v0.1.3. v0.1.4 must receive a new immutable Dev payload before live revalidation.
