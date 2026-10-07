# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.2 / `0.1.2-stable-asset-scene-sync`.
- Counting Sheep live Dev proved v0.1.1 still periodically self-reconciled after the first feedback fix. The remaining discriminator was HeroForge regenerating display/data object identities and numeric part IDs during native reconcile.
- v0.1.2 removes generated object/numeric IDs from scene-sync detection. Polling now compares stable display keys plus rendered host keys, stable part metadata, and size-neutral normal-family URLs, so Witch Dock source promotion and HeroForge reconcile generations do not appear to be scene changes while real rendered asset swaps still do.
- v0.1.1's owned-density corrections remain: generic `_usedTextureSize` is never forced, density uses Native Reconcile, source-only promotion does not repack, rollback preserves outside edits, and figure replacement waits on the current live scene.
- Focused Texture Quality VM tests pass 17/17, including regenerated part-ID/display-data identity stability and real asset-change detection.
- v0.1.1 was disposed from the active Counting Sheep page before this patch; core High Res remains independently owned.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev v1.17.2 / `1.17.2-stable-asset-sync` is paired to immutable payload `0a4b5a8de4eb825c881f5ecf21d236f202c08004`, containing all-part v0.1.2 / `0.1.2-stable-asset-scene-sync`.
