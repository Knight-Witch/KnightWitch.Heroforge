# Changelog

## Latest repository change — 2026-10-06

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.10 / `0.1.10-intrinsic-floor-headroom`.
- Live v0.1.9 Counting Sheep is safe and broad: 91 active bindings, 23 deliberate downgrades, 12 skips, and zero failures. However both accepted Corvidae Herald pauldrons and all six Celestial Circlet hosts were bound to shared 256 normal sources and packed at 256×256, below the previously accepted 512 control.
- The 512 failures had different causes: pauldrons reached a detached native-packing rejection after lower-priority progressive upgrades had already consumed packing headroom; circlet reached a display-budget stop.
- v0.1.10 divides spending into two phases. First, each eligible group advances only toward the next power-of-two that covers HeroForge's own native ideal. Second, remaining verified source/allocation headroom is spent in descending native-ideal order.
- This bounds tiny 32/64px accessories at small intrinsic floors before larger/significant parts compete for premium headroom. There are no fixture names, item/category allowlists, blanket scale multipliers, global CreationKit patches, or relaxed no-collateral checks.
- Repeated families remain atomic. Every density step still passes the detached native `CK.Atlas` preflight before live mutation, and exact ownership/rollback, cache sharing, OFF→ON re-arm, event-driven observation, body/face isolation, and failure isolation remain intact.
- Full gates pass: all-part 20/20 plus inherited ownership 4/4 (24/24 combined), runtime-delivery 12/12, manifest/divergence consistency, module syntax, and git diff checks. New contracts cover native ideal 55→64, circlet-like ideal 184→256, premium native-ideal ordering, repeated-family starvation, packing safety, rollback, OFF→ON, and anti-loop behavior.
- Feature-registry impact: none. This is internal selection/budgeting inside the existing Texture Quality service; no feature ID, module ownership/path, tab/group, or reporter-facing routing changes.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev v1.17.10 / `1.17.10-intrinsic-floor-headroom` is paired to immutable payload `732bcea1843528c0ebc30592379a1a264de5436b`, containing all-part v0.1.10 / `0.1.10-intrinsic-floor-headroom`.
