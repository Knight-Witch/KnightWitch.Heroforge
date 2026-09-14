# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-14-067 -- Hand off Texture Quality to Stable promotion

Date: 2026-09-14

### Summary

Record the completed Dev phase and hand the next chat a narrow public Stable promotion task. Amanda explicitly approved beginning the public update in the next chat. No Stable or runtime files are changed by this entry.

### Promotion boundary

- do not restart the completed v0.3.4 multi-figure investigation;
- reconfirm both branch heads before writing;
- inspect only the exact Texture Quality service/UI files plus required `manifest.json` registry/cache entries on Dev and Stable;
- do not merge WITCH_DEV_UI wholesale or carry unrelated Dev work into Stable;
- follow `MODULE_VERSIONING.md`, run static/syntax checks, update release logs, then run a narrow `Witch_Scripts` smoke through HF-Chat-Bridge;
- if Stable differs from the validated Dev behavior, diagnose rather than widening scope or patching blindly.

### Accepted Dev source

Service v0.3.4 / `0.3.4-dev-native-color-material-setup` and UI v0.2.0 / `0.2.0-dev-persistence-advanced-controls` have passed committed-source smoke, non-primary Seya visual validation, dynamic multi-figure membership, shared-Part restore, and the 1030% three-detailed-figure stress gate.

### Deferred

Ultra-heavy / "insanity mode" remains a separate future phase and should not be mixed into this promotion.

**Runtime behavior changed:** no -- documentation-only release handoff.

---

## DOCK-2026-09-14-066 -- Accept Texture Quality multi-figure stress gate

Current Dev v0.3.4 passed the full multi-figure gate, including a 1030% three-detailed-figure scene. One pressured extra packed body allocations at the intentional 1024px High Res floor while other headline targets promoted to 2048px; Amanda visually confirmed all three figures' body textures and decals looked excellent. Heavy Disable/restore and final re-enable passed.

---

## DOCK-2026-09-14-065 -- Refresh pinned color-bake materials

Texture Quality v0.3.4 added HeroForge-owned `colorBake.paints.setupMaterials('color')` after pinned mask policy application and during restore. This fixed the Seya/shared-Part case where the correct 1024px override existed but an existing color-bake material retained a 512px mask. Exact committed-source smoke and Seya non-primary visual validation passed.

---

## DOCK-2026-09-14-064 -- Deduplicate shared HeroForge Part snapshots

Texture Quality v0.3.3 deduplicated first snapshots by shared Part object identity, fixing restore contamination across figures that share body Part instances. Repeated Enable/Disable and dynamic 3->2 / 2->3 membership validation passed.

---

## Prior active history

DOCK-2026-09-13-063 and earlier detailed entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.
