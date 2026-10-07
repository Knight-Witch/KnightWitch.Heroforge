# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.3 / `0.1.3-data-change-observer`.
- Counting Sheep live Dev proved v0.1.2 still periodically self-reconciled. A controlled core reconcile left `allDisplays` semantic keys and sampled accessory part metadata unchanged, so renderer-state signatures are no longer treated as a safe user-change detector.
- v0.1.3 removes render-signature comparison from the 250 ms Texture Quality UI refresh path. It observes the existing live figure-data `change(...)` lifecycle seam instead, debounces outside changes by 600 ms, and uses refresh only to attach/retire observers and flush a pending change after HeroForge settles.
- Witch Dock-owned core enable/reconcile/disable and all-part density reconciles run under change-suppression, so their own native `data.change()` calls cannot schedule another coverage pass.
- Observer ownership is exact and reversible: stale figure observers restore when membership changes, current figure data is re-observed, disposal restores only methods still owned by this service, and later outside replacements survive.
- v0.1.1 density/source/rollback corrections remain intact: no generic `_usedTextureSize` forcing, density uses Native Reconcile, source-only promotion does not repack, and rollback preserves outside edits.
- Focused Texture Quality VM tests pass 18/18, including external-change debounce, owned-change suppression, figure observer replacement, 250 ms polling non-retrigger, failure isolation, and exact rollback.
- v0.1.2 was disposed from the active Counting Sheep page after live loop confirmation; core High Res remained stable and independently owned.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev v1.17.3 / `1.17.3-data-change-observer` is paired to immutable payload `7fd83e93ce2b615c02ec42e7df1e4ed10ee657b4`, containing all-part v0.1.3 / `0.1.3-data-change-observer`.
