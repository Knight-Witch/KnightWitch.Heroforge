# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-14-066 -- Accept Texture Quality multi-figure stress gate

Date: 2026-09-14

### Summary

Close the current Texture Quality multi-figure Dev validation after exact committed v0.3.4 passes normal, shared-Part, visual, and heavy three-figure testing. No runtime code changed in this entry.

### Confirmed validation

- exact committed service remains v0.3.4 / `0.3.4-dev-native-color-material-setup`;
- clean three-figure post-refresh OFF baseline was captured before the heavy test;
- a 1030% kitbash scene enabled successfully in ~4.05s and verified all three figures with coherent native atlases;
- primary reached 2048x2048 bodyLower/bodyUpper/face; one pressured extra reached the intentional High Res floor of 1024x1024 on bodyLower/bodyUpper while its face reached 2048x2048; the other extra reached 2048x2048 on all three targets;
- the pressured extra still had 2048 bake/used targets, confirming HeroForge native packing pressure selected the lower allocation rather than Witch Dock changing the policy;
- the verifier is intentionally floor-based: `USED=1024` is the minimum High Res source seed, while HeroForge may natively promote individual allocations to 2048 when space permits;
- Amanda visually confirmed body textures and decals on all three figures looked high resolution / stellar;
- heavy-scene Disable/restore passed in ~4.1s with root idle and non-primary material sims intact; Disable restores source policy while deliberately retaining the already-built native atlases;
- final re-enable passed in ~3.49s and the scene was left High Res ON.

### Future boundary

The later ultra-heavy / "insanity mode" investigation is separate. It becomes relevant when a targeted allocation falls below the validated 1024px High Res floor or visual quality degrades despite a verified state; this 1030% scene did not cross that boundary.

### Explicitly unchanged

Service/UI code, texture recipe, atlas target, readiness/settle timing, ownership boundaries, persistence semantics, manifest/cache key, and public Stable are unchanged.

**Runtime behavior changed:** no -- documentation-only acceptance record.

---

## DOCK-2026-09-14-065 -- Refresh pinned color-bake materials

Texture Quality v0.3.4 added HeroForge-owned `colorBake.paints.setupMaterials('color')` after pinned mask policy application and during restore. This fixed the Seya/shared-Part case where the correct 1024px override existed but an existing color-bake material retained a 512px mask. Exact committed-source smoke and Seya non-primary visual validation passed.

---

## DOCK-2026-09-14-064 -- Deduplicate shared HeroForge Part snapshots

Texture Quality v0.3.3 deduplicated first snapshots by shared Part object identity, fixing restore contamination across figures that share body Part instances. Repeated Enable/Disable and dynamic 3->2 / 2->3 membership validation passed.

---

## Prior active history

DOCK-2026-09-13-063 and earlier detailed entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.
