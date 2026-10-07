# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction: Texture Quality All-Part Promotion advances to v0.1.1 / `0.1.1-owned-density-structural-sync`.
- Counting Sheep live Dev exposed two v0.1.0 defects before fixture-matrix acceptance: density was compounded by forcing generic `_usedTextureSize` alongside `atlasScale`, and the 250 ms Texture Quality UI refresh poll treated all-part's own normal/atlas mutations as scene changes, causing repeated restore/reapply oscillation.
- v0.1.1 now applies accessory density only through the existing owned Native Reconcile seam, observes/restores native used-size side effects instead of forcing them, skips atlas reconcile for source-only upgrades, and detects scene changes from structural figure/part identity only.
- Figure replacement rollback now waits on the current live display set rather than stale prior display-data identities, avoiding a bounded-settle timeout during legitimate scene replacement.
- Regression coverage now includes source-only promotion, density-reconcile failure isolation, structural-signature stability under owned render changes, 250 ms refresh-poll non-retrigger, and exact old-figure rollback on replacement. Focused Texture Quality suite passes 17/17.
- v0.1.0 was disposed from the active Counting Sheep page after readback proved the loop; core High Res remained ready and HeroForge returned to `_inUpdate=false`, `_needsUpdating=false`, `finished=true`, `resourcesReady=true`.
- Current public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Canonical Dev v1.17.0 / `1.17.0-all-part-promotion` currently pins immutable payload `69d7e4eecd371c0d36a49712f986c36a3073661a` containing all-part v0.1.0. v0.1.1 must be paired as a new immutable Dev payload before live revalidation.
